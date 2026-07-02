'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { EmptyState } from '@/components/ui/EmptyState';
import { ProfessionalCard } from '@/components/shared/ProfessionalCard';

export default function FavoritosPage() {
  const router = useRouter();
  const [favorites, setFavorites] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const token = localStorage.getItem('@belezza:token');
        const res = await fetch('http://localhost:3333/api/clients/favorites', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          // data is array of Favorite, with .professional
          const professionals = data.map((fav: any) => fav.professional);
          setFavorites(professionals);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);
  
  if (isLoading) return <div style={{ padding: '64px', textAlign: 'center' }}>Carregando favoritos...</div>;

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
