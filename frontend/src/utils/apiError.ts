import { isAxiosError } from "axios";
import { toast } from "sonner";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const getMessage = (value: unknown): string | undefined => {
  if (typeof value === "string") return value.trim() || undefined;
  if (!isRecord(value)) return undefined;

  // message — ошибки приложения, msg — ошибки валидации FastAPI.
  const message = value.message ?? value.msg;
  return typeof message === "string" ? message.trim() || undefined : undefined;
};

export const getApiErrorMessage = (
  error: unknown,
  fallback = "Что-то пошло не так",
): string => {
  if (!isAxiosError<unknown>(error)) return fallback;

  const data = error.response?.data;
  if (!isRecord(data)) return fallback;

  if (Array.isArray(data.detail)) {
    const messages = data.detail.map(getMessage).filter(Boolean);
    if (messages.length) return [...new Set(messages)].join("; ");
  }

  return getMessage(data.detail) ?? getMessage(data) ?? fallback;
};

export const showApiError = (error: unknown): void => {
  toast.error(getApiErrorMessage(error));
};
