'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { EmptyState } from '@/components/ui/EmptyState';
import { useUIStore } from '@/stores/ui.store';
import { professionalsMock } from '@/mocks/professionals.mock';
import { ProfessionalCard } from '@/components/shared/ProfessionalCard';

export default function FavoritosPage() {
  const router = useRouter();
  const { favoriteIds } = useUIStore();
  
  const favorites = professionalsMock.filter(p => favoriteIds.includes(p.id));
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
      <div>
        <h1 className="heading-2">Profissionais Favoritas</h1>
        <p className="body-text">Sua seleção pessoal das melhores profissionais.</p>
      </div>
      
      {favorites.length === 0 ? (
        <div style={{ backgroundColor: 'var(--surface-card)', padding: 'var(--spacing-8)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--surface-border)', minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <EmptyState 
            title="Nenhum favorito salvo" 
            description="Você ainda não salvou nenhuma profissional. Encontre suas favoritas e salve para agendar mais rápido." 
            icon="search" 
            actionText="Explorar Profissionais" 
            onAction={() => router.push('/')} 
          />
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--spacing-6)' }}>
          {favorites.map(prof => (
            <ProfessionalCard key={prof.id} professional={prof} />
          ))}
        </div>
      )}
    </div>
  );
}
