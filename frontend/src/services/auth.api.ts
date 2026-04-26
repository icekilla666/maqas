import type { LoginData, RegisterData } from "../types/api.types";
import { api } from "./api";

export const authApi = {
  refreshAccess: () => {
    return api.post("/api/auth/refresh-access");
  },
  resendEmail: (email: string) => {
    return api.post("/api/auth/resend-verification-email", email);
  },
  register: (data: RegisterData) => {
    return api.post("/api/auth/register", data);
  },
  verifyEmail: (token: string) => {
    return api.get(`/api/auth/verify-email?${token}`);
  },
  login: (data: LoginData) => {
    return api.post("/api/auth/login", data);
  },
  logout: () => {
    return api.post("/api/auth/logout");
  },
};
