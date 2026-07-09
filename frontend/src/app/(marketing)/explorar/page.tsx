'use client';
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Map as MapIcon, List, MapPin, SlidersHorizontal } from 'lucide-react';
import { ProfessionalCard } from '@/components/shared/ProfessionalCard';
import { InteractiveMap } from '@/components/shared/InteractiveMap';

import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { api } from '@/lib/api';
import styles from './styles.module.css';

function ExplorarContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('categoria') || '';
  
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [isMobile, setIsMobile] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState(initialCategory);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [cityTerm, setCityTerm] = useState(searchParams.get('cidade') || '');
  const [professionals, setProfessionals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);

  const CATEGORIES = [
    'Todas', 'Cabelo', 'Unhas', 'Maquiagem', 'Estética', 
    'Sobrancelhas', 'Cílios', 'Depilação', 'Barbearia', 
    'Massagem', 'Tatuagem / Piercing'
  ];
  
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    async function load() {
      if (!cityTerm || cityTerm.trim() === '') {
        setProfessionals([]);
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const query = new URLSearchParams();
        if (categoryFilter && categoryFilter.toLowerCase() !== 'todas') query.append('category', categoryFilter);
        if (searchTerm) query.append('q', searchTerm);
        if (cityTerm) query.append('city', cityTerm);

        const response = await api.get(`/professionals?${query.toString()}`);
        
        // Map the flat DB structure to the expected Professional type, and filter out those without a location
        const mappedProfessionals = response.data
          .map((p: any) => ({
            ...p,
            address: {
              city: p.city,
              state: p.state,
              neighborhood: p.neighborhood,
              lat: p.lat,
              lng: p.lng
            }
          }));
          
        setProfessionals(mappedProfessionals);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [categoryFilter, searchTerm, cityTerm]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategoryFilter(e.target.value);
  };

  return (
    <div className={styles.page}>
      <div className={styles.topbar}>
        <div className={styles.searchForm}>
          <div className={styles.inputWrapper}>
            <MapPin className={styles.searchIcon} size={18} />
            <input 
              type="text" 
              placeholder="Digite a sua cidade (ex: São Paulo)" 
              className={styles.searchInput}
              value={cityTerm}
              onChange={(e) => setCityTerm(e.target.value)}
            />
          </div>
          <div className={styles.filtersWrapper}>
            <button 
              className={`${styles.filterToggleBtn} ${isFilterExpanded ? styles.active : ''}`}
              onClick={() => setIsFilterExpanded(!isFilterExpanded)}
            >
              <SlidersHorizontal size={18} />
              <span style={{ display: isMobile ? 'none' : 'inline' }}>Filtros</span>
            </button>
            {isMobile && (
              <button 
                className={styles.filterToggleBtn}
                onClick={() => setViewMode(v => v === 'list' ? 'map' : 'list')}
              >
                {viewMode === 'list' ? <MapIcon size={18} /> : <List size={18} />}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className={`${styles.filterPanel} ${isFilterExpanded ? styles.filterPanelExpanded : ''}`}>
        <div className={styles.filterPanelContent}>
          <div className={styles.inputWrapper} style={{ maxWidth: '400px' }}>
            <Search className={styles.searchIcon} size={18} />
            <input 
              type="text" 
              placeholder="Buscar por nome do local ou profissional..." 
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <h4 style={{ fontSize: '14px', color: 'var(--color-neutral-700)', marginBottom: '8px' }}>Categorias Especializadas</h4>
            <div className={styles.categoryGrid}>
              {CATEGORIES.map(cat => (
                <button 
                  key={cat} 
                  className={`${styles.categoryTag} ${categoryFilter.toLowerCase() === cat.toLowerCase() || (cat === 'Todas' && !categoryFilter) ? styles.active : ''}`}
                  onClick={() => setCategoryFilter(cat === 'Todas' ? '' : cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.content}>
        {(viewMode === 'list' || !isMobile) && (
          <div className={styles.listContainer}>
            <div className={styles.resultsHeader}>
              <h2>Profissionais encontrados</h2>
              <span className={styles.resultsCount}>{professionals.length} resultados</span>
            </div>
            
            {isLoading ? (
              <div style={{ padding: '24px', textAlign: 'center' }}>Buscando profissionais...</div>
            ) : (!cityTerm || cityTerm.trim() === '') ? (
              <div style={{ padding: '48px 24px', textAlign: 'center', backgroundColor: 'var(--surface-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--surface-border)' }}>
                <MapPin size={48} style={{ color: 'var(--color-neutral-300)', margin: '0 auto 16px' }} />
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-neutral-900)', marginBottom: '8px' }}>Qual é a sua cidade?</h3>
                <p style={{ color: 'var(--color-neutral-500)', maxWidth: '400px', margin: '0 auto' }}>
                  Para começarmos, digite o nome da sua cidade na barra de busca acima para ver os profissionais mais próximos de você.
                </p>
              </div>
            ) : professionals.length > 0 ? (
              <div className={styles.grid}>
                {professionals.map(prof => (
                  <ProfessionalCard key={prof.id} professional={prof} />
                ))}
              </div>
            ) : (
              <div style={{ padding: '48px 24px', textAlign: 'center', backgroundColor: 'var(--surface-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--surface-border)' }}>
                <Search size={48} style={{ color: 'var(--color-neutral-300)', margin: '0 auto 16px' }} />
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-neutral-900)', marginBottom: '8px' }}>Nenhum profissional encontrado</h3>
                <p style={{ color: 'var(--color-neutral-500)', maxWidth: '400px', margin: '0 auto' }}>
                  Não encontramos profissionais na cidade de <strong>{cityTerm}</strong> com os filtros aplicados.
                </p>
              </div>
            )}
          </div>
        )}

        {(viewMode === 'map' || !isMobile) && (
          <div className={styles.mapContainer}>
            <InteractiveMap professionals={professionals} />
          </div>
        )}
      </div>
    </div>
  );
}

export default function Explorar() {
  return (
    <React.Suspense fallback={<div className={styles.page} style={{ display: 'flex', justifyContent: 'center', padding: 'var(--spacing-16)' }}>Carregando...</div>}>
      <ExplorarContent />
    </React.Suspense>
  );
}
