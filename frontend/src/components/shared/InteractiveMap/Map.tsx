import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Professional } from '@/types/professional.types';
import Link from 'next/link';

// Fix Leaflet's default icon path issues in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

interface MapProps {
  professionals: Professional[];
}

function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

const Map: React.FC<MapProps> = ({ professionals }) => {
  const [userLoc, setUserLoc] = useState<[number, number] | null>(null);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLoc([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.warn("User denied location or error", error);
        }
      );
    }
  }, []);

  const validProfessionals = professionals.filter(p => p.address && p.address.lat && p.address.lng);
  
  // Center somewhere default or the first professional's location or User Location
  const firstWithAddress = validProfessionals[0];
  const defaultCenter: [number, number] = userLoc 
    ? userLoc 
    : (firstWithAddress 
      ? [firstWithAddress.address.lat, firstWithAddress.address.lng]
      : [-23.5505, -46.6333]); // Sao Paulo default

  return (
    <div style={{ position: 'relative', height: '100%', width: '100%', borderRadius: '12px', overflow: 'hidden' }}>
      {validProfessionals.length === 0 && (
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(4px)',
          zIndex: 1000, // Above leaflet which is usually 400
          flexDirection: 'column',
          gap: '12px',
          textAlign: 'center',
          padding: '24px'
        }}>
          <h3 style={{ margin: 0, color: 'var(--color-neutral-900)', fontSize: '18px', fontWeight: 600 }}>Nenhum profissional por perto</h3>
          <p style={{ margin: 0, color: 'var(--color-neutral-600)', fontSize: '14px' }}>
            Não encontramos profissionais na sua região com os filtros atuais.
          </p>
        </div>
      )}
      <MapContainer center={defaultCenter} zoom={13} style={{ height: '100%', width: '100%', zIndex: 1 }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />
      <MapUpdater center={defaultCenter} />
      {validProfessionals.map(prof => (
        <Marker key={prof.id} position={[prof.address.lat, prof.address.lng]}>
          <Popup>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '150px' }}>
              <strong style={{ fontSize: '14px', color: 'var(--color-neutral-900)' }}>{prof.businessName || prof.name}</strong>
              <span style={{ fontSize: '12px', color: 'var(--color-neutral-500)' }}>
                {(() => {
                  let cats: string[] = [];
                  try {
                    cats = Array.isArray(prof.categories) 
                      ? prof.categories 
                      : (typeof prof.categories === 'string' ? JSON.parse(prof.categories) : []);
                  } catch (e) {
                    cats = [];
                  }
                  return cats.map(c => c.replace('_', ' ')).join(', ');
                })()}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ color: '#F59E0B' }}>★</span>
                <span style={{ fontSize: '12px', fontWeight: 'bold' }}>{prof.rating}</span>
              </div>
              <Link href={`/@${prof.username}`} style={{ 
                background: 'var(--color-primary-600)', 
                color: 'white', 
                padding: '6px 8px', 
                borderRadius: '6px', 
                textDecoration: 'none',
                textAlign: 'center',
                fontSize: '12px',
                marginTop: '4px',
                fontWeight: '500'
              }}>
                Ver Perfil
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
    </div>
  );
};

export default Map;
