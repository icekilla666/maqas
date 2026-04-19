import { api } from "./api";

export interface RegisterData {
  username: string;
  name: string;
  email: string;
  password: string;
  password_confirm: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export const authApi = {
  register: (data: RegisterData) => {
    return api.post("/api/auth/register", data);
  },
  verifyEmail: (token: string) => {
    return api.get(`/api/auth/verify-email?${token}`);
  },
  login: (data: LoginData) => {
    return api.post("/api/auth/login", data);
  },
};
