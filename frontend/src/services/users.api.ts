import type {
  AccountData,
  BlackListUserData,
  FindUsers,
  ListUsersProps,
  ProfileProps,
  UserData,
} from "@/types/api.types";
import { api } from "./api";

export const usersApi = {
  getMe: async (): Promise<AccountData> => {
    const response = await api.get("/api/users/me");
    return response.data.data;
  },
  getUser: async (id: string): Promise<UserData> => {
    const response = await api.get(`/api/users/${id}`);
    return response.data.data;
  },
  findUser: async ({
    username,
    skip,
    limit,
  }: ListUsersProps & { username: string }): Promise<FindUsers[]> => {
    const response = await api.get("/api/users/", {
      params: {
        username,
        skip,
        limit,
      },
    });
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
  uploadAvatar: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post("/api/users/me/avatar", formData);
    return response.data;
  },
  deleteAvatar: async () => {
    const response = await api.delete("/api/users/me/avatar");
    return response.data;
  },

  getFollowers: async ({ skip, limit }: ListUsersProps) => {
    const response = await api.get("/api/users/me/followers", {
      params: { skip, limit },
    });
    return response.data.data;
  },
  getFollowings: async ({ skip, limit }: ListUsersProps) => {
    const response = await api.get("/api/users/me/followings", {
      params: { skip, limit },
    });
    return response.data.data;
  },
  getUserFollowers: async (id: string, { skip, limit }: ListUsersProps) => {
    const response = await api.get(`/api/users/${id}/followers`, {
      params: { skip, limit },
    });
    return response.data.data;
  },
  getUserFollowings: async (id: string, { skip, limit }: ListUsersProps) => {
    const response = await api.get(`/api/users/${id}/followings`, {
      params: { skip, limit },
    });
    return response.data.data;
  },
  followUser: async (id: string) => {
    const response = await api.post(`/api/users/${id}/follow`);
    return response.data.data;
  },
  unfollowUser: async (id: string) => {
    const response = await api.delete(`/api/users/${id}/unfollow`);
    return response.data.data;
  },
  blockUser: async (id: string) => {
    const response = await api.post(`/api/users/${id}/block`);
    return response.data.data;
  },
  unblockUser: async (id: string) => {
    const response = await api.delete(`/api/users/${id}/unblock`);
    return response.data.data;
  },

  getBlackList: async ({
    skip,
    limit,
  }: ListUsersProps): Promise<BlackListUserData[]> => {
    const response = await api.get(`/api/users/me/blacklist`, {
      params: { skip, limit },
    });
    return response.data.data;
  },
};
