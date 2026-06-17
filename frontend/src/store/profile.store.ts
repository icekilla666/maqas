import { create } from "zustand";
import { usersApi } from "@/services/users.api";
import type { AccountData } from "@/types/entities";
import type { ProfileProps } from "@/types/api.types";
import { persist } from "zustand/middleware";

interface ProfileState {
  profile: AccountData | null;
  isLoading: boolean;
  error: string | null;

  fetchProfile: () => Promise<void>;
  updateProfile: (data: ProfileProps) => Promise<void>;
  clearProfile: () => void;
}
export const useProfileStore = create<ProfileState>()(
  persist(
    (set, get) => ({
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

      clearProfile: () => {
        set({ profile: null, isLoading: false, error: null });
      },
    }),
    {
      name: "profile-storage",
      partialize: (s) => ({ profile: s.profile }),
    },
  ),
);
