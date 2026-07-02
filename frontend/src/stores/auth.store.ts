import { create } from 'zustand';
import { Client } from '../types/client.types';
import { Professional } from '../types/professional.types';

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
      const response = await fetch('http://localhost:3333/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao realizar login');
      }

      set({ user: data.user, role: data.user.role.toLowerCase(), isAuthenticated: true });
      localStorage.setItem('@belezza:token', data.token);
    } catch (error) {
      throw error;
    }
  },
  register: async (credentials: any) => {
    try {
      const response = await fetch('http://localhost:3333/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao realizar cadastro');
      }

      set({ user: data.user, role: data.user.role.toLowerCase(), isAuthenticated: true });
      localStorage.setItem('@belezza:token', data.token);
    } catch (error) {
      throw error;
    }
  },
  googleLogin: async (credentials: any) => {
    try {
      const response = await fetch('http://localhost:3333/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao realizar login com Google');
      }

      set({ user: data.user, role: data.user.role.toLowerCase(), isAuthenticated: true });
      localStorage.setItem('@belezza:token', data.token);
    } catch (error) {
      throw error;
    }
  },
  fetchMe: async () => {
    try {
      const token = localStorage.getItem('@belezza:token');
      if (!token) return;

      const response = await fetch('http://localhost:3333/api/users/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const user = await response.json();
      if (!response.ok) throw new Error(user.error || 'Erro ao carregar perfil');

      set({ user, role: user.role.toLowerCase(), isAuthenticated: true });
    } catch (error) {
      console.error(error);
    }
  },
  logout: () => {
    localStorage.removeItem('@belezza:token');
    set({ user: null, role: null, isAuthenticated: false });
  },
}));
