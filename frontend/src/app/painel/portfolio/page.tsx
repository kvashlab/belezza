'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Plus, Trash2, Camera, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useUIStore } from '@/stores/ui.store';
import { Badge } from '@/components/ui/Badge';

export default function PortfolioPage() {
  const [photos, setPhotos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const { addToast } = useUIStore();

  const fetchPortfolio = async () => {
    try {
      const token = localStorage.getItem('@belezza:token');
      const res = await fetch('http://localhost:3333/api/professionals/portfolio', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setPhotos(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Convert to base64 for simplicity
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result;
      if (!base64) return;

      setIsUploading(true);
      try {
        const token = localStorage.getItem('@belezza:token');
        const res = await fetch('http://localhost:3333/api/professionals/portfolio', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}` 
          },
          body: JSON.stringify({ 
            url: base64,
            description: 'Nova foto do portfólio',
            isBeforeAfter: false
          })
        });

        if (res.ok) {
          addToast({ type: 'success', title: 'Sucesso', message: 'Foto adicionada!' });
          fetchPortfolio();
        } else {
          const err = await res.json();
          addToast({ type: 'error', title: 'Erro', message: err.error || 'Falha ao adicionar foto.' });
        }
      } catch (error) {
        addToast({ type: 'error', title: 'Erro', message: 'Falha no upload.' });
      } finally {
        setIsUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente excluir esta foto?')) return;

    try {
      const token = localStorage.getItem('@belezza:token');
      const res = await fetch(`http://localhost:3333/api/professionals/portfolio/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        addToast({ type: 'success', title: 'Sucesso', message: 'Foto excluída.' });
        fetchPortfolio();
      } else {
        addToast({ type: 'error', title: 'Erro', message: 'Falha ao excluir foto.' });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--spacing-4)' }}>
        <div>
          <h1 className="heading-2" style={{ color: 'var(--color-neutral-900)' }}>Meu Portfólio</h1>
          <p className="body-text" style={{ color: 'var(--color-neutral-500)' }}>
            Mostre seu talento. Contas gratuitas podem adicionar até 5 fotos.
          </p>
        </div>
        
        <div>
          <input 
            type="file" 
            id="photo-upload" 
            accept="image/*" 
            style={{ display: 'none' }} 
            onChange={handleUpload}
            disabled={isUploading}
          />
          <label htmlFor="photo-upload">
            <Button variant="primary" leftIcon={isUploading ? <AlertCircle size={18} /> : <Plus size={18} />}>
              {isUploading ? 'Enviando...' : 'Adicionar Foto'}
            </Button>
          </label>
        </div>
      </div>

      {isLoading ? (
        <div style={{ padding: '64px', textAlign: 'center' }}>Carregando portfólio...</div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
          gap: 'var(--spacing-4)' 
        }}>
          {photos.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', padding: '64px', textAlign: 'center', backgroundColor: 'var(--surface-card)', borderRadius: 'var(--radius-lg)' }}>
              <Camera size={48} color="var(--color-neutral-300)" style={{ margin: '0 auto 16px' }} />
              <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>Nenhuma foto ainda</h3>
              <p style={{ color: 'var(--color-neutral-500)' }}>Adicione fotos do seu trabalho para atrair mais clientes.</p>
            </div>
          ) : (
            photos.map((photo) => (
              <div key={photo.id} style={{ 
                position: 'relative', 
                aspectRatio: '1', 
                borderRadius: 'var(--radius-md)', 
                overflow: 'hidden',
                backgroundColor: 'var(--surface-card)',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <Image src={photo.url} alt="Portfolio" fill style={{ objectFit: 'cover' }} unoptimized />
                
                {photo.isBeforeAfter && (
                  <Badge style={{ position: 'absolute', top: '8px', left: '8px' }}>Antes/Depois</Badge>
                )}

                <button 
                  onClick={() => handleDelete(photo.id)}
                  style={{ 
                    position: 'absolute', 
                    top: '8px', 
                    right: '8px',
                    backgroundColor: 'rgba(255, 59, 48, 0.9)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    opacity: 0.8,
                    transition: 'opacity 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = '0.8'}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
