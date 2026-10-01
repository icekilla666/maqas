import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  isAuth: boolean;
  isAuthChecked: boolean;
  accessToken: string | null;
  sessionVersion: number;
  pendingEmail: string | null;

  setPendingEmail: (email: string | null) => void;
  setIsAuthChecked: (isAuthChecked: boolean) => void;
  setUser: (isAuth: boolean, accessToken: string | null) => void;
  setAccessToken: (accessToken: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuth: false,
      accessToken: null,
      sessionVersion: 0,
      isAuthChecked: false,
      pendingEmail: null,

      setIsAuthChecked: (isAuthChecked) => set({ isAuthChecked }),
      // Вход/выход меняет сессию, refresh обновляет только её access token.
      setUser: (isAuth, accessToken) => set((state) => ({
        isAuth, accessToken, sessionVersion: state.sessionVersion + 1,
      })),
      setAccessToken: (accessToken) => set({ isAuth: true, accessToken }),
      logout: () => set((state) => ({
        isAuth: false, accessToken: null, sessionVersion: state.sessionVersion + 1,
      })),
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
