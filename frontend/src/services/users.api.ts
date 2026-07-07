import type { FollowProps, ProfileProps } from "@/types/api.types";
import { api } from "./api";

export const usersApi = {
  getMe: async () => {
    const response = await api.get("/api/users/me");
    return response.data;
  },
  getUser: async (id: string) => {
    const response = await api.get(`/api/users/${id}`);
    return response.data.data;
  },
  deleteMe: async () => {
    const response = await api.post("/api/users/me");
    return response.data;
  },
  updateMe: async ({ username, name, bio }: ProfileProps) => {
    const response = await api.patch("/api/users/me", { username, name, bio });
    return response.data;
  },
  uploadAvatar: async (file: string) => {
    const response = await api.post("/api/users/me/avatar", file);
    return response.data;
  },
  deleteAvatar: async () => {
    const response = await api.delete("/api/users/me/avatar");
    return response.data;
  },

  getFollowers: async ({ skip, limit }: FollowProps) => {
    const response = await api.get("/api/users/me/followers", {
      params: { skip, limit },
    });
    return response.data.data;
  },
  getFollowings: async ({ skip, limit }: FollowProps) => {
    const response = await api.get("/api/users/me/followings", {
      params: { skip, limit },
    });
    return response.data.data;
  },
};
