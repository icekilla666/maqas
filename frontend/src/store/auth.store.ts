import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  isAuth: boolean;
  isAuthChecked: boolean;
  accessToken: string | null;
  sessionVersion: number;
  pendingEmail: string | null;
  verificationResendAt: number;

  setPendingEmail: (email: string | null) => void;
  startVerificationCooldown: (email: string) => void;
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
      verificationResendAt: 0,

      setIsAuthChecked: (isAuthChecked) => set({ isAuthChecked }),
      setUser: (isAuth, accessToken) => set((state) => ({
        isAuth, accessToken, sessionVersion: state.sessionVersion + 1,
      })),
      setAccessToken: (accessToken) => set({ isAuth: true, accessToken }),
      logout: () => set((state) => ({
        isAuth: false, accessToken: null, sessionVersion: state.sessionVersion + 1,
      })),
      setPendingEmail: (pendingEmail) => set((state) => ({
        pendingEmail,
        verificationResendAt: pendingEmail && pendingEmail === state.pendingEmail
          ? state.verificationResendAt : 0,
      })),
      startVerificationCooldown: (pendingEmail) => set({
        pendingEmail,
        verificationResendAt: Date.now() + 60_000,
      }),
    }),
    {
      name: "pending-email",
      partialize: (state) => ({
        pendingEmail: state.pendingEmail,
        verificationResendAt: state.verificationResendAt,
      }),
    },
  ),
);
