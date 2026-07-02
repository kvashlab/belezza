'use client';
import { useEffect } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { useUIStore } from '@/stores/ui.store';

export function AppInitializer() {
  const { fetchMe, isAuthenticated } = useAuthStore();
  const { fetchFavorites } = useUIStore();

  useEffect(() => {
    fetchMe();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchFavorites();
    }
  }, [isAuthenticated]);

  return null;
}
