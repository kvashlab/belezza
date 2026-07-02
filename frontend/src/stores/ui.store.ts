import { create } from 'zustand';

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
      const res = await fetch('http://localhost:3333/api/clients/favorites', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        set({ favoriteIds: data.map((f: any) => f.professionalId) });
      }
    } catch (e) {
      console.error(e);
    }
  },

  toggleFavorite: async (professionalId) => {
    const isFavorite = useUIStore.getState().favoriteIds.includes(professionalId);
    try {
      const token = localStorage.getItem('@belezza:token');
      if (!token) return; // Must be logged in

      if (isFavorite) {
        await fetch(`http://localhost:3333/api/clients/favorites/${professionalId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
        set((state) => ({ favoriteIds: state.favoriteIds.filter(id => id !== professionalId) }));
      } else {
        await fetch(`http://localhost:3333/api/clients/favorites`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}` 
          },
          body: JSON.stringify({ professionalId })
        });
        set((state) => ({ favoriteIds: [...state.favoriteIds, professionalId] }));
      }
    } catch (e) {
      console.error(e);
    }
  },

  addToast: (toast) => set((state) => ({
    toasts: [...state.toasts, { ...toast, id: Math.random().toString(36).substring(7) }]
  })),

  removeToast: (id) => set((state) => ({
    toasts: state.toasts.filter(t => t.id !== id)
  })),
}));
