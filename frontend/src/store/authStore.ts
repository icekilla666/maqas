import { create } from "zustand";
import type { UserData } from "../types/entities";

interface AuthState {
  user: UserData | null;
  setUser: (user: UserData | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));