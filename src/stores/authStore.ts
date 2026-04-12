import { create } from 'zustand';
import { api, User } from '../lib/api';
import { socketManager } from '../lib/socket';

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
    if (response?.user) {
      set({ user: response.user, isAuthenticated: true });
      // Connect socket with the new token
      if (response.token) {
        socketManager.connect(response.token);
      }
      return true;
    }
    return false;
  },

  register: async (username: string, email: string, password: string) => {
    const response = await api.register(username, email, password);
    if (response?.user) {
      set({ user: response.user, isAuthenticated: true });
      if (response.token) {
        socketManager.connect(response.token);
      }
      return true;
    }
    return false;
  },

  guestLogin: async () => {
    const response = await api.guestLogin();
    if (response?.user) {
      set({ user: response.user, isAuthenticated: true });
      if (response.token) {
        socketManager.connect(response.token);
      }
      return true;
    }
    return false;
  },

  logout: () => {
    api.setToken(null);
    socketManager.disconnect();
    set({ user: null, isAuthenticated: false });
  },

  refreshUser: async () => {
    const user = await api.getMe();
    if (user) {
      set({ user });
    }
  },

  checkAuth: async () => {
    set({ isLoading: true });
    const user = await api.getMe();
    if (user) {
      set({ user, isAuthenticated: true, isLoading: false });
      // Reconnect socket if we have a stored token
      const token = api.getToken();
      if (token) {
        socketManager.connect(token);
      }
    } else {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
}));
