import axios, { type InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "../store/auth.store";

const options = {
  baseURL: import.meta.env.VITE_API_URL || "/",
  withCredentials: true,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
};

export const api = axios.create(options);
// Отдельный клиент не перехватывает собственный 401 и не зацикливает refresh.
const refreshApi = axios.create(options);

type RefreshAccessResponse = {
  success: boolean;
  data: { access_token: string; token_type: string };
};

type AuthRequestConfig = InternalAxiosRequestConfig & {
  _authRetry?: boolean;
  _authSession?: number;
};

let pendingRefresh: {
  sessionVersion: number;
  promise: Promise<RefreshAccessResponse>;
} | null = null;

export const refreshAccessToken = (): Promise<RefreshAccessResponse> => {
  const { sessionVersion } = useAuthStore.getState();
  if (pendingRefresh?.sessionVersion === sessionVersion) return pendingRefresh.promise;

  const promise = refreshApi.post<RefreshAccessResponse>("/api/auth/refresh-access")
    .then(({ data }) => {
      // Запоздавший refresh не должен восстанавливать сессию после выхода.
      if (useAuthStore.getState().sessionVersion !== sessionVersion) {
        throw new axios.CanceledError("Сессия изменилась");
      }
      if (typeof data?.data?.access_token !== "string" || !data.data.access_token) {
        throw new Error("Сервер не вернул access token");
      }
      useAuthStore.getState().setAccessToken(data.data.access_token);
      return data;
    })
    .catch((error: unknown) => {
      if (
        axios.isAxiosError(error) &&
        [401, 403].includes(error.response?.status ?? 0) &&
        useAuthStore.getState().sessionVersion === sessionVersion
      ) {
        useAuthStore.getState().logout();
      }
      throw error;
    })
    .finally(() => {
      if (pendingRefresh?.promise === promise) pendingRefresh = null;
    });

  pendingRefresh = { sessionVersion, promise };
  return promise;
};

api.interceptors.request.use((config) => {
  const { accessToken, sessionVersion } = useAuthStore.getState();
  const authConfig = config as AuthRequestConfig;
  authConfig._authSession ??= sessionVersion;
  if (authConfig._authSession !== sessionVersion) {
    throw new axios.CanceledError("Сессия изменилась");
  }

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }
  return config;
});

const publicAuthPaths = new Set([
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/verify-email",
  "/api/auth/resend-verification-email",
  "/api/auth/refresh-access",
  "/api/auth/logout",
]);

api.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!axios.isAxiosError(error)) throw error;
    const config = error.config as AuthRequestConfig | undefined;
    if (error.response?.status !== 401 || !config || config._authRetry) throw error;

    const path = new URL(config.url ?? "", "https://maqas.ru").pathname;
    const { accessToken, sessionVersion } = useAuthStore.getState();
    if (
      publicAuthPaths.has(path) ||
      !accessToken ||
      !config.headers.Authorization ||
      config._authSession !== sessionVersion
    ) throw error;

    config._authRetry = true;
    // Если другой запрос уже обновил токен, достаточно повторить этот запрос.
    if (config.headers.Authorization === `Bearer ${accessToken}`) {
      await refreshAccessToken();
    }
    return api.request(config);
  },
);
