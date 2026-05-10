import type { LoginData, RegisterData } from "../types/api.types";
import { api } from "./api";

export const authApi = {
  refreshAccess: async () => {
    const response = await api.post("/api/auth/refresh-access");
    return response.data;
  },
  resendEmail: async (email: string) => {
    const response = await api.post("/api/auth/resend-verification-email", {
      email,
    });
    return response.data;
  },
  register: async (data: RegisterData) => {
    const response = await api.post("/api/auth/register", data);
    return response.data;
  },
  verifyEmail: async (token: string) => {
    const response = await api.get(`/api/auth/verify-email?token=${token}`);
    return response.data;
  },
  login: async (data: LoginData) => {
    const response = await api.post("/api/auth/login", data);
    return response.data;
  },
  logout: async () => {
    const response = await api.post("/api/auth/logout");
    return response.data;
  },
};
