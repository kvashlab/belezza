'use client';
import React from 'react';
import { EmptyState } from '@/components/ui/EmptyState';

export default function ServicosPage() {
  // Extract route name from window location or just use a generic title
  const title = typeof window !== 'undefined' ? window.location.pathname.split('/').pop() : 'Módulo';
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
      <div>
        <h1 className="heading-2" style={{ textTransform: 'capitalize' }}>{title}</h1>
        <p className="body-text">Gerencie esta seção do seu negócio.</p>
      </div>
      
      <div style={{ backgroundColor: 'var(--surface-card)', padding: 'var(--spacing-8)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--surface-border)', minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <EmptyState 
          title="Em desenvolvimento" 
          description="Este módulo estará disponível na próxima atualização." 
          icon="document" 
          actionText="Voltar ao Dashboard" 
          onAction={() => window.location.href = '/painel'} 
        />
      </div>
    </div>
  );
}
