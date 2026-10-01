import { isAxiosError } from "axios";

// Без ответа или при сбое сервера запись могла уже сохраниться.
// Это не подтверждённый отказ: автоматически повторять создание нельзя.
export const isMessageDeliveryUncertain = (error: unknown): boolean => {
  if (!isAxiosError(error)) return false;
  const status = error.response?.status;
  return status === undefined || status === 408 || status >= 500;
};
