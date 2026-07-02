import React from 'react';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';

export default function PainelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRole="professional">
      <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--surface-main)' }}>
        {/* Futura Sidebar do Painel */}
        <aside style={{ width: '250px', backgroundColor: 'var(--surface-card)', borderRight: '1px solid var(--surface-border)', padding: 'var(--spacing-4)' }}>
          <h2 style={{ fontFamily: 'var(--font-family-display)', color: 'var(--color-primary-600)' }}>Belezza Pro</h2>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)', marginTop: 'var(--spacing-6)' }}>
            <a href="/painel" style={{ padding: 'var(--spacing-2)' }}>Dashboard</a>
            <a href="/painel/agenda" style={{ padding: 'var(--spacing-2)' }}>Agenda</a>
            <a href="/painel/servicos" style={{ padding: 'var(--spacing-2)' }}>Serviços</a>
            <a href="/painel/clientes" style={{ padding: 'var(--spacing-2)' }}>Clientes</a>
            <a href="/painel/financeiro" style={{ padding: 'var(--spacing-2)' }}>Financeiro</a>
          </nav>
        </aside>
        
        <main style={{ flex: 1, padding: 'var(--spacing-6)' }}>
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
