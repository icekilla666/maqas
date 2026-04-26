import { create } from "zustand";

interface AuthState {
  isAuth: boolean;
  isAuthChecked: boolean;
  setIsAuthChecked: (isAuthChecked: boolean) => void;
  accessToken: string | null;
  setUser: (isAuth: boolean, accessToken: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuth: false,
  accessToken: null,
  isAuthChecked: false,
  setIsAuthChecked: (isAuthChecked) => set({ isAuthChecked }),
  setUser: (isAuth, accessToken) => set({ isAuth, accessToken }),
  logout: () => set({ isAuth: false, accessToken: null }),
}));
