import { create } from 'zustand';
import * as authApi from '../api/auth';
import { getAccessToken, setTokens, removeTokens } from '../utils/token';
import type { Admin } from '../types';

interface AuthState {
  admin: Admin | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  admin: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: true,

  login: async (username, password) => {
    const { data: resp } = await authApi.login({ username, password });
    if (resp.data) {
      setTokens(resp.data.access_token, resp.data.refresh_token);
      set({
        admin: resp.data.admin,
        accessToken: resp.data.access_token,
        isAuthenticated: true,
      });
    }
  },

  logout: () => {
    removeTokens();
    set({ admin: null, accessToken: null, isAuthenticated: false });
  },

  checkAuth: async () => {
    try {
      const token = getAccessToken();
      if (!token) throw new Error('No token');
      const { data: resp } = await authApi.getMe();
      set({
        admin: resp.data ?? null,
        accessToken: token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch {
      removeTokens();
      set({ admin: null, isAuthenticated: false, isLoading: false });
    }
  },
}));
