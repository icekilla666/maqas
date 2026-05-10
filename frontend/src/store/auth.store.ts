import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  isAuth: boolean;
  isAuthChecked: boolean;
  accessToken: string | null;
  pendingEmail: string | null;

  setPendingEmail: (email: string | null) => void;
  setIsAuthChecked: (isAuthChecked: boolean) => void;
  setUser: (isAuth: boolean, accessToken: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuth: false,
      accessToken: null,
      isAuthChecked: false,
      pendingEmail: null,

      setIsAuthChecked: (isAuthChecked) => set({ isAuthChecked }),
      setUser: (isAuth, accessToken) => set({ isAuth, accessToken }),
      logout: () => set({ isAuth: false, accessToken: null }),
      setPendingEmail: (pendingEmail) => set({ pendingEmail }),
    }),
    {
      name: "pending-email",
      partialize: (state) => ({
        pendingEmail: state.pendingEmail,
      }),
    },
  ),
);
