'use client';
import React, { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { ProSidebar } from '@/components/layout/ProSidebar';
import { Menu, Bell, Check } from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';
import { useSocket } from '@/providers/SocketProvider';
import { api } from '@/lib/api';

export default function PainelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const { user, role } = useAuthStore();
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
    if (role === 'professional') {
      fetchNotifications();
    }
  }, [role]);

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
    <ProtectedRoute allowedRole="professional">
      <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--surface-main)' }}>
        <ProSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
          {/* Mobile Header */}
          <header style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            padding: 'var(--spacing-4) var(--spacing-6)',
            backgroundColor: 'var(--surface-card)',
            borderBottom: '1px solid var(--surface-border)',
            position: 'sticky',
            top: 0,
            zIndex: 10
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)' }}>
              <button 
                onClick={() => setSidebarOpen(true)}
                style={{ display: 'block' }}
                className="lg-hidden"
                aria-label="Abrir menu"
              >
                <Menu size={24} color="var(--color-neutral-700)" />
              </button>
              <span style={{ fontWeight: 600, color: 'var(--color-neutral-900)' }} className="lg-hidden-text">
                Olá, {((user as any)?.professionalProfile?.businessName || user?.name)?.split(' ')[0] || 'Profissional'}
              </span>
            </div>
            
            <div style={{ position: 'relative' }}>
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
                  boxShadow: 'var(--shadow-lg)', overflow: 'hidden', zIndex: 50
                }}>
                  <div style={{ padding: '16px', borderBottom: '1px solid var(--surface-border)', fontWeight: 600 }}>
                    Notificações
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
          </header>

          <main style={{ flex: 1, padding: 'var(--spacing-6)', overflowY: 'auto' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
              {children}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
