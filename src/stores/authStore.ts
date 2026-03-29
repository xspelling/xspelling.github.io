import { create } from 'zustand';
import { api, User } from '../lib/api';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  guestLogin: () => Promise<boolean>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  login: async (username: string, password: string) => {
    const response = await api.login(username, password);
    if (response.user) {
      set({ user: response.user as User, isAuthenticated: true });
      return true;
    }
    return false;
  },

  register: async (username: string, email: string, password: string) => {
    const response = await api.register(username, email, password);
    if (response.user) {
      set({ user: response.user as User, isAuthenticated: true });
      return true;
    }
    return false;
  },

  guestLogin: async () => {
    const response = await api.guestLogin();
    if (response.user) {
      set({ user: response.user as User, isAuthenticated: true });
      return true;
    }
    return false;
  },

  logout: () => {
    api.setToken(null);
    set({ user: null, isAuthenticated: false });
  },

  refreshUser: async () => {
    const response = await api.getMe();
    if (response) {
      set({ user: response as User });
    }
  },

  checkAuth: async () => {
    set({ isLoading: true });
    const response = await api.getMe();
    if (response) {
      set({ user: response as User, isAuthenticated: true, isLoading: false });
    } else {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
}));
