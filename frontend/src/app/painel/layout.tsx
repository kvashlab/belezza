'use client';
import React, { useState } from 'react';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { ProSidebar } from '@/components/layout/ProSidebar';
import { Menu, Bell } from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';

export default function PainelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuthStore();

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
                className="lg-hidden" // Assuming we can use a class or just rely on the sidebar's media query to hide this if needed. Let's just keep it simple. Actually, we should only show the hamburger on mobile. Let's use a media query trick or inline style.
                aria-label="Abrir menu"
              >
                <Menu size={24} color="var(--color-neutral-700)" />
              </button>
              <span style={{ fontWeight: 600, color: 'var(--color-neutral-900)' }} className="lg-hidden-text">
                Olá, {((user as any)?.professionalProfile?.businessName || user?.name)?.split(' ')[0] || 'Profissional'}
              </span>
            </div>
            <button aria-label="Notificações">
              <Bell size={20} color="var(--color-neutral-700)" />
            </button>
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
