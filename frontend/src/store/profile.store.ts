import { create } from "zustand";
import { usersApi } from "@/services/users.api";
import type { AccountData } from "@/types/entities";
import type { ProfileProps } from "@/types/api.types";

interface ProfileState {
  profile: AccountData | null;
  isLoading: boolean;
  error: string | null;

  fetchProfile: () => Promise<void>;
  updateProfile: (data: ProfileProps) => Promise<void>;
  uploadAvatar: (file: File) => Promise<void>;
  changeFollowingsCount: (delta: number) => void;
  clearProfile: () => void;
}
export const useProfileStore = create<ProfileState>()((set, get) => ({
  profile: null,
  isLoading: false,
  error: null,

  fetchProfile: async () => {
    if (get().profile) return;

    set({ isLoading: true, error: null });
    try {
      const response = await usersApi.getMe();
      set({ profile: response.data, isLoading: false });
    } catch (error) {
      set({ error: "Не удалось загрузить профиль", isLoading: false });
      console.error(error);
    }
  },

  updateProfile: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await usersApi.updateMe(data);
      set({ profile: response.data, isLoading: false });
    } catch (error) {
      set({ error: "Не удалось обновить профиль", isLoading: false });
      throw error;
    }
  },

  uploadAvatar: async (file) => {
    set({ isLoading: true, error: null });
    try {
      const response = await usersApi.uploadAvatar(file);
      set((state) => ({
        profile: state.profile
          ? { ...state.profile, avatar_url: response.data }
          : state.profile,
        isLoading: false,
      }));
    } catch (error) {
      set({ error: "Не удалось обновить аватар", isLoading: false });
      throw error;
    }
  },

  changeFollowingsCount: (delta) => {
    set((state) => ({
      profile: state.profile
        ? {
            ...state.profile,
            followings_count: Math.max(
              0,
              state.profile.followings_count + delta,
            ),
          }
        : state.profile,
    }));
  },

  clearProfile: () => {
    set({ profile: null, isLoading: false, error: null });
  },
}));
