import { create } from "zustand";
import type { UserData } from "../types/entities";

interface AuthState {
  user: UserData | null;
  accessToken: string | null;
  setUser: (user: UserData | null, accessToken: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  setUser: (user, accessToken) => set({ user, accessToken }),
  logout: () => set({ user: null, accessToken: null }),
}));