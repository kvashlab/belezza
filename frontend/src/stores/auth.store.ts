import { create } from 'zustand';
import { Client } from '../types/client.types';
import { Professional } from '../types/professional.types';
import { api } from '../lib/api';

interface AuthStore {
  user: (Client | Professional) | null;
  role: 'client' | 'professional' | null;
  isAuthenticated: boolean;
  login: (credentials: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  googleLogin: (data: any) => Promise<void>;
  fetchMe: () => Promise<void>;
  logout: () => void;
}
export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  role: null,
  isAuthenticated: false,
  login: async (credentials: any) => {
    try {
      const response = await api.post('/auth/login', credentials);
      const data = response.data;
      
      set({ user: data.user, role: data.user.role.toLowerCase(), isAuthenticated: true });
      localStorage.setItem('@belezza:token', data.token);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Erro ao realizar login');
    }
  },
  register: async (credentials: any) => {
    try {
      const response = await api.post('/auth/register', credentials);
      const data = response.data;
      
      set({ user: data.user, role: data.user.role.toLowerCase(), isAuthenticated: true });
      localStorage.setItem('@belezza:token', data.token);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Erro ao realizar cadastro');
    }
  },
  googleLogin: async (credentials: any) => {
    try {
      const response = await api.post('/auth/google', credentials);
      const data = response.data;
      
      set({ user: data.user, role: data.user.role.toLowerCase(), isAuthenticated: true });
      localStorage.setItem('@belezza:token', data.token);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Erro ao realizar login com Google');
    }
  },
  fetchMe: async () => {
    try {
      const token = localStorage.getItem('@belezza:token');
      if (!token) return;

      const response = await api.get('/users/me');
      const user = response.data;

      set({ user, role: user.role.toLowerCase(), isAuthenticated: true });
    } catch (error) {
      console.error(error);
      // Let the interceptor handle the 401 logout if token is invalid
    }
  },
  logout: () => {
    localStorage.removeItem('@belezza:token');
    localStorage.removeItem('@belezza:user');
    set({ user: null, role: null, isAuthenticated: false });
  },
}));
