import { User } from "@/types/user";
import { create } from "zustand";
type AuthState = {
  user: User | null;
  setUser: (user: User) => void;
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  accessToken: null,
  setAccessToken: (token) => set({ accessToken: token }),
}));
