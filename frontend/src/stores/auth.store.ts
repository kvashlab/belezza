import { create } from 'zustand';
import { Client } from '../types/client.types';
import { Professional } from '../types/professional.types';

interface AuthStore {
  user: (Client | Professional) | null;
  role: 'client' | 'professional' | null;
  isAuthenticated: boolean;
  login: (credentials: any) => Promise<void>;
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
      // In a real app, save data.token to localStorage/cookies here
      localStorage.setItem('@belezza:token', data.token);
    } catch (error) {
      throw error;
    }
  },
  logout: () => {
    localStorage.removeItem('@belezza:token');
    set({ user: null, role: null, isAuthenticated: false });
  },
}));
