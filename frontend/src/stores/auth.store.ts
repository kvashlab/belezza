import { create } from 'zustand';
import { Client } from '../types/client.types';
import { Professional } from '../types/professional.types';
import { api } from '../lib/api';
import { supabase } from '../lib/supabase';

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
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) throw error;
      
      // Ensure session is set
      localStorage.setItem('@belezza:token', data.session.access_token);
      
      // Fetch user profile from Prisma DB using the new token
      await useAuthStore.getState().fetchMe();
    } catch (error: any) {
      throw new Error(error.message || 'Erro ao realizar login');
    }
  },
  register: async (credentials: any) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: {
            name: credentials.name,
            phone: credentials.phone,
            role: credentials.role || 'CLIENT',
          }
        }
      });

      if (error) throw error;
      
      if (data.session) {
        localStorage.setItem('@belezza:token', data.session.access_token);
        // Sync with our Prisma backend
        await api.post('/auth/sync-user', {
          id: data.user?.id,
          email: credentials.email,
          name: credentials.name,
          phone: credentials.phone,
          role: credentials.role || 'CLIENT'
        });
        await useAuthStore.getState().fetchMe();
      } else {
        // Confirm email required
        throw new Error('Verifique seu e-mail para confirmar o cadastro.');
      }
    } catch (error: any) {
      throw new Error(error.message || 'Erro ao realizar cadastro');
    }
  },
  googleLogin: async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      if (error) throw error;
    } catch (error: any) {
      throw new Error(error.message || 'Erro ao realizar login com Google');
    }
  },
  fetchMe: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      
      localStorage.setItem('@belezza:token', session.access_token);

      const response = await api.get('/users/me');
      const user = response.data;

      set({ user, role: user.role.toLowerCase(), isAuthenticated: true });
    } catch (error) {
      console.error(error);
    }
  },
  logout: async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('@belezza:token');
    localStorage.removeItem('@belezza:user');
    set({ user: null, role: null, isAuthenticated: false });
  },
}));
