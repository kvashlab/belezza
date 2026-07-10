'use client';
import React, { useState, useEffect } from 'react';
import { Bell, Check } from 'lucide-react';
import { useSocket } from '@/providers/SocketProvider';
import { useAuthStore } from '@/stores/auth.store';
import { api } from '@/lib/api';

export const NotificationBell = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const { user } = useAuthStore();
  const { socket } = useSocket();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await api.get('/notifications');
        setNotifications(response.data);
      } catch (err) {
        console.error('Failed to fetch notifications', err);
      }
    };
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  useEffect(() => {
    if (!socket) return;
    const handleNotification = (data: any) => {
      setNotifications(prev => {
        if (prev.some(n => n.id === data.id)) return prev;
        return [data, ...prev];
      });
    };
    socket.on('notification', handleNotification);
    return () => {
      socket.off('notification', handleNotification);
    };
  }, [socket]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = async (id: string) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      <button 
        aria-label="Notificações" 
        onClick={() => setShowNotifications(!showNotifications)}
        style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', padding: '8px' }}
      >
        <Bell size={20} color="var(--color-neutral-700)" />
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute', top: '2px', right: '4px',
            backgroundColor: 'var(--color-primary-500)', color: 'white',
            fontSize: '10px', fontWeight: 'bold', borderRadius: '50%',
            width: '16px', height: '16px', display: 'flex',
            alignItems: 'center', justifyContent: 'center'
          }}>
            {unreadCount}
          </span>
        )}
      </button>

      {showNotifications && (
        <div style={{
          position: 'absolute', top: '100%', right: 0, marginTop: '8px',
          width: '320px', backgroundColor: 'var(--surface-card)',
          border: '1px solid var(--surface-border)', borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-lg)', overflow: 'hidden', zIndex: 100
        }}>
          <div style={{ padding: '16px', borderBottom: '1px solid var(--surface-border)', fontWeight: 600, color: 'var(--color-neutral-900)' }}>
            Suas Notificações
          </div>
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {notifications.length === 0 ? (
              <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--color-neutral-500)' }}>
                Nenhuma notificação no momento.
              </div>
            ) : (
              notifications.map(notif => (
                <div key={notif.id} style={{ 
                  padding: '16px', 
                  borderBottom: '1px solid var(--surface-border)',
                  backgroundColor: notif.read ? 'transparent' : 'var(--color-primary-50)',
                  display: 'flex', gap: '12px'
                }}>
                  <div style={{ flex: 1 }}>
                    <strong style={{ display: 'block', fontSize: '14px', marginBottom: '4px', color: 'var(--color-neutral-900)' }}>
                      {notif.title}
                    </strong>
                    <span style={{ display: 'block', fontSize: '13px', color: 'var(--color-neutral-600)' }}>
                      {notif.message}
                    </span>
                    <span style={{ display: 'block', fontSize: '11px', color: 'var(--color-neutral-400)', marginTop: '8px' }}>
                      {new Date(notif.createdAt).toLocaleString()}
                    </span>
                  </div>
                  {!notif.read && (
                    <button 
                      onClick={() => markAsRead(notif.id)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', alignSelf: 'flex-start', color: 'var(--color-primary-500)' }}
                      title="Marcar como lido"
                    >
                      <Check size={16} />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
