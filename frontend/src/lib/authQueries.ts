import { showApiError } from "@/utils/apiError";
import { authApi } from "@/services/auth.api";
import { usersApi } from "@/services/users.api";
import { useAuthStore } from "@/store/auth.store";
import type { LoginData, RegisterData } from "@/types/api.types";
import { authKeys } from "@/utils/constants";
import {
  useMutation,
  useQueryClient,
  type QueryClient,
} from "@tanstack/react-query";

const clearServerCache = async (queryClient: QueryClient) => {
  await queryClient.cancelQueries();
  queryClient.removeQueries();
};

export const useLoginMutation = () => {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);
  const setPendingEmail = useAuthStore((s) => s.setPendingEmail);

  return useMutation({
    mutationKey: authKeys.login(),
    mutationFn: (data: LoginData) => authApi.login(data),
    onSuccess: async (response) => {
      await clearServerCache(queryClient);
      setPendingEmail(null);
      setUser(true, response.data.access_token);
    },
  });
};

export const useRegisterMutation = () => {
  const startCooldown = useAuthStore((state) => state.startVerificationCooldown);

  return useMutation({
    mutationKey: authKeys.register(),
    mutationFn: (data: RegisterData) => authApi.register(data),
    onSuccess: (response) => {
      startCooldown(response.data);
    },
  });
};

export const useLogoutMutation = () => {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationKey: authKeys.logout(),
    mutationFn: authApi.logout,
    onError: showApiError,
    onSettled: async () => {
      setUser(false, null);
      await clearServerCache(queryClient);
    },
  });
};

export const useLogoutAllMutation = () => {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationKey: authKeys.logoutAll(),
    mutationFn: authApi.logoutAll,
    onError: showApiError,
    onSettled: async () => {
      setUser(false, null);
      await clearServerCache(queryClient);
    },
  });
};

export const useDeleteMeMutation = () => {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationKey: authKeys.deleteMe(),
    mutationFn: usersApi.deleteMe,
    onError: showApiError,
    onSuccess: async () => {
      setUser(false, null);
      await clearServerCache(queryClient);
    },
  });
};

export const useResendEmailMutation = () => {
  return useMutation({
    mutationKey: authKeys.resendEmail(),
    mutationFn: (email: string) => authApi.resendEmail(email),
    onError: showApiError,
  });
};
