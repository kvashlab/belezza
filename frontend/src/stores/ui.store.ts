import { create } from 'zustand';
import { api } from '@/lib/api';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

interface UIStore {
  theme: 'light' | 'dark';
  favoriteIds: string[];
  toasts: ToastMessage[];
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  fetchFavorites: () => Promise<void>;
  toggleFavorite: (professionalId: string) => Promise<void>;
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  theme: 'light',
  favoriteIds: [],
  toasts: [],
  
  toggleTheme: () => set((state) => {
    const newTheme = state.theme === 'light' ? 'dark' : 'light';
    if (typeof window !== 'undefined') {
      if (newTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.removeAttribute('data-theme');
      }
    }
    return { theme: newTheme };
  }),

  setTheme: (theme) => set(() => {
    if (typeof window !== 'undefined') {
      if (theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.removeAttribute('data-theme');
      }
    }
    return { theme };
  }),
  
  fetchFavorites: async () => {
    try {
      const token = localStorage.getItem('@belezza:token');
      if (!token) return;
      const res = await api.get('/clients/favorites');
      set({ favoriteIds: res.data.map((f: any) => f.professionalId) });
    } catch (e) {
      console.error(e);
    }
  },

  toggleFavorite: async (professionalId) => {
    const isFavorite = useUIStore.getState().favoriteIds.includes(professionalId);
    try {
      const token = localStorage.getItem('@belezza:token');
      if (!token) {
        useUIStore.getState().addToast({ type: 'info', title: 'Atenção', message: 'Faça login para favoritar profissionais.' });
        return;
      }

      if (isFavorite) {
        await api.delete(`/clients/favorites/${professionalId}`);
        set((state) => ({ favoriteIds: state.favoriteIds.filter(id => id !== professionalId) }));
        useUIStore.getState().addToast({ type: 'success', title: 'Removido', message: 'Profissional removido dos favoritos.' });
      } else {
        await api.post(`/clients/favorites`, { professionalId });
        set((state) => ({ favoriteIds: [...state.favoriteIds, professionalId] }));
        useUIStore.getState().addToast({ type: 'success', title: 'Favorito salvo', message: 'Profissional adicionado aos favoritos!' });
      }
    } catch (e: any) {
      console.error(e);
      useUIStore.getState().addToast({ type: 'error', title: 'Erro', message: e.response?.data?.error || e.message || 'Não foi possível salvar o favorito.' });
    }
  },

  addToast: (toast) => set((state) => ({
    toasts: [...state.toasts, { ...toast, id: Math.random().toString(36).substring(7) }]
  })),

  removeToast: (id) => set((state) => ({
    toasts: state.toasts.filter(t => t.id !== id)
  })),
}));
