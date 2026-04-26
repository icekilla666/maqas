import { create } from "zustand";

interface AuthState {
  isAuth: boolean;
  accessToken: string | null;
  setUser: (isAuth: boolean, accessToken: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuth: false,
  accessToken: null,
  setUser: (isAuth, accessToken) => set({ isAuth, accessToken }),
  logout: () => set({ isAuth: false, accessToken: null }),
}));