'use client';
import { useEffect } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { useUIStore } from '@/stores/ui.store';
import { useSocket } from '@/providers/SocketProvider';

export function AppInitializer() {
  const { fetchMe, isAuthenticated } = useAuthStore();
  const { fetchFavorites, addToast } = useUIStore();
  const { socket } = useSocket();

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchFavorites();
    }
  }, [isAuthenticated, fetchFavorites]);

  useEffect(() => {
    if (!socket) return;

    const handleNotification = (data: any) => {
      console.log('Received notification via WebSocket:', data);
      
      const toastType = data.type === 'WAITLIST' ? 'success' : 'info';
      
      addToast({
        type: toastType,
        title: data.title,
        message: data.message,
        duration: 8000
      });
    };

    socket.on('notification', handleNotification);

    return () => {
      socket.off('notification', handleNotification);
    };
  }, [socket, addToast]);

  return null;
}
