import React from 'react';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { Header } from '@/components/layout/Header';
import { ClientSidebar } from '@/components/layout/ClientSidebar';

export default function ClienteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRole="client">
      <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--surface-main)' }}>
        <ClientSidebar />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <Header />
          <main style={{ flex: 1, padding: 'var(--spacing-6) var(--spacing-8)', overflowY: 'auto' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
              {children}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
