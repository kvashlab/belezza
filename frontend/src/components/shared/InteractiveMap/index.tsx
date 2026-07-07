import dynamic from 'next/dynamic';
import React from 'react';
import { Professional } from '@/types/professional.types';

const MapWithNoSSR = dynamic(() => import('./Map'), {
  ssr: false,
  loading: () => <div style={{ height: '100%', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5', borderRadius: '12px' }}>Carregando mapa...</div>
});

interface InteractiveMapProps {
  professionals: Professional[];
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({ professionals }) => {
  return <MapWithNoSSR professionals={professionals} />;
};
