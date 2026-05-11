import type { ProfileProps } from "@/types/api.types";
import { api } from "./api";

export const usersApi = {
  getMe: async () => {
    const response = await api.get("/api/users/me");
    return response.data;
  },
  deleteMe: async () => {
    const response = await api.post("/api/users/me");
    return response;
  },
  updateMe: async ({ username, name, bio }: ProfileProps) => {
    const response = await api.patch("/api/users/me", { username, name, bio });
    return response;
  },
  uploadAvatar: async (file: string) => {
    const response = await api.post("/api/users/me/avatar", file);
    return response;
  },
  deleteAvatar: async () => {
    const response = await api.delete("/api/users/me/avatar");
    return response;
  },
};
