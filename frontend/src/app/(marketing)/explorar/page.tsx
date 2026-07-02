'use client';
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Map as MapIcon, List } from 'lucide-react';
import { ProfessionalCard } from '@/components/shared/ProfessionalCard';
import { ServiceCategory } from '@/types/professional.types';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { professionalsMock } from '@/mocks/professionals.mock';
import styles from './styles.module.css';

function ExplorarContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('categoria') || '';
  
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [isMobile, setIsMobile] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState(initialCategory);
  
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategoryFilter(e.target.value);
  };

  const filteredProfessionals = professionalsMock.filter(p => {
    if (categoryFilter && categoryFilter !== 'todas') {
      return p.categories.includes(categoryFilter as unknown as ServiceCategory);
    }
    return true;
  });

  return (
    <div className={styles.page}>
      <div className={styles.topbar}>
        <div className={styles.searchForm}>
          <Search className={styles.searchIcon} size={18} />
          <input 
            type="text" 
            placeholder="Buscar por nome, serviço ou bairro..." 
            className={styles.searchInput}
          />
          <div className={styles.filtersWrapper}>
            <Select 
              className={styles.filterSelect}
              value={categoryFilter}
              onChange={handleFilterChange}
              options={[
                { value: 'todas', label: 'Todas Categorias' },
                { value: 'cabelo', label: 'Cabelo' },
                { value: 'unhas', label: 'Unhas' },
                { value: 'maquiagem', label: 'Maquiagem' },
                { value: 'estetica', label: 'Estética' }
              ]}
            />
          </div>
          {isMobile && (
            <Button 
              variant="secondary" 
              className={styles.mobileFilterBtn}
              onClick={() => setViewMode(v => v === 'list' ? 'map' : 'list')}
            >
              {viewMode === 'list' ? <MapIcon size={20} /> : <List size={20} />}
            </Button>
          )}
        </div>
      </div>

      <div className={styles.content}>
        {(viewMode === 'list' || !isMobile) && (
          <div className={styles.listContainer}>
            <div className={styles.resultsHeader}>
              <h2>Profissionais encontradas</h2>
              <span className={styles.resultsCount}>{filteredProfessionals.length} resultados</span>
            </div>
            
            <div className={styles.grid}>
              {filteredProfessionals.map(prof => (
                <ProfessionalCard key={prof.id} professional={prof} />
              ))}
            </div>
          </div>
        )}

        {(viewMode === 'map' || !isMobile) && (
          <div className={styles.mapContainer}>
            {/* Placeholder para mapa */}
            <div className={styles.mapPlaceholder}>
              <MapIcon size={48} className={styles.mapIcon} />
              <p>Mapa Interativo</p>
              <span>Navegue para ver profissionais na sua região</span>
            </div>
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
