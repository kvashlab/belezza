'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Plus, Trash2, Camera, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useUIStore } from '@/stores/ui.store';
import { Badge } from '@/components/ui/Badge';
import { api } from '@/lib/api';

export default function PortfolioPage() {
  const [photos, setPhotos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const { addToast } = useUIStore();

  const fetchPortfolio = async () => {
    try {
      const response = await api.get('/professionals/portfolio');
      setPhotos(response.data);
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
    if (!file.type.startsWith('image/')) {
      addToast({ type: 'error', title: 'Erro', message: 'Selecione uma imagem.' });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      addToast({ type: 'error', title: 'Erro', message: 'A imagem deve ter no máximo 5MB.' });
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const img = new window.Image();
      img.onload = async () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1080;
        const MAX_HEIGHT = 1080;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(async (blob) => {
          if (!blob) return;
          const newFile = new File([blob], 'portfolio.jpg', { type: 'image/jpeg' });
          const formData = new FormData();
          formData.append('photo', newFile);
          formData.append('description', 'Nova foto do portfólio');
          formData.append('isBeforeAfter', 'false');

          setIsUploading(true);
          try {
            await api.post('/professionals/portfolio', formData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            });

            addToast({ type: 'success', title: 'Sucesso', message: 'Foto adicionada!' });
            fetchPortfolio();
          } catch (error: any) {
            addToast({ type: 'error', title: 'Erro', message: error.response?.data?.error || 'Falha no upload.' });
          } finally {
            setIsUploading(false);
          }
        }, 'image/jpeg', 0.8);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente excluir esta foto?')) return;

    try {
      await api.delete(`/professionals/portfolio/${id}`);
      addToast({ type: 'success', title: 'Sucesso', message: 'Foto excluída.' });
      fetchPortfolio();
    } catch {
      addToast({ type: 'error', title: 'Erro', message: 'Falha ao excluir foto.' });
    }
  };

  const fileInputRef = React.useRef<HTMLInputElement>(null);

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
            ref={fileInputRef}
            accept="image/*" 
            style={{ display: 'none' }} 
            onChange={handleUpload}
            disabled={isUploading}
          />
          <Button 
            variant="primary" 
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            leftIcon={isUploading ? <AlertCircle size={18} /> : <Plus size={18} />}
          >
            {isUploading ? 'Enviando...' : 'Adicionar Foto'}
          </Button>
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
