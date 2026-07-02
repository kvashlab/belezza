import { create } from 'zustand';
import { Client } from '../types/client.types';
import { Professional } from '../types/professional.types';

interface AuthStore {
  user: (Client | Professional) | null;
  role: 'client' | 'professional' | null;
  isAuthenticated: boolean;
  login: () => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  role: null,
  isAuthenticated: false,
  login: async () => {
    // Simulação de login mockado
    return new Promise((resolve) => {
      setTimeout(() => {
        // Dummy data para simular um usuário cliente
        const fakeUser: Client = {
          id: 'cli_logged',
          name: 'Maria Cliente',
          email: 'maria@exemplo.com',
          phone: '11999999999',
          totalBookings: 2,
          tags: [],
        };
        set({ user: fakeUser, role: 'client', isAuthenticated: true });
        resolve();
      }, 1000);
    });
  },
  logout: () => {
    set({ user: null, role: null, isAuthenticated: false });
  },
}));
