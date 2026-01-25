import { create } from "zustand";

interface UserInfo {
  idnguoidung: number;
  hoten: string;
  mail: string;
  vaitro: string;
}

interface AuthState {
  user: UserInfo | null;
  accessToken: string | null;
  isAuthenticated: boolean;

  setAuth: (user: UserInfo, accessToken: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,

  setAuth: (user, accessToken) =>
    set({
      user,
      accessToken,
      isAuthenticated: true,
    }),

  logout: () =>
    set({
      user: null,
      accessToken: null,
      isAuthenticated: false,
    }),
}));
