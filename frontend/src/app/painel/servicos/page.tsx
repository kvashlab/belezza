'use client';
import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { useUIStore } from '@/stores/ui.store';
import { Button } from '@/components/ui/Button';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { api } from '@/lib/api';
import styles from '../perfil/styles.module.css';

export default function ServicosProfissional() {
  const { user } = useAuthStore();
  const { addToast } = useUIStore();
  const [services, setServices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);

  const fetchServices = async () => {
    try {
      const response = await api.get('/professionals/services');
      setServices(response.data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if ((user as any)?.role === 'professional') {
      fetchServices();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const form = e.target as HTMLFormElement;
    
    const payload = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      description: (form.elements.namedItem('description') as HTMLInputElement).value,
      category: (form.elements.namedItem('category') as HTMLInputElement).value,
      price: parseFloat((form.elements.namedItem('price') as HTMLInputElement).value),
      duration: parseInt((form.elements.namedItem('duration') as HTMLInputElement).value),
    };

    try {
      if (editingService) {
        await api.put(`/professionals/services/${editingService.id}`, payload);
      } else {
        await api.post('/professionals/services', payload);
      }
      
      addToast({ type: 'success', title: editingService ? 'Serviço atualizado!' : 'Serviço criado!' });
      setIsModalOpen(false);
      setEditingService(null);
      fetchServices();
    } catch {
      addToast({ type: 'error', title: 'Falha ao salvar serviço' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente excluir este serviço?')) return;
    
    try {
      await api.delete(`/professionals/services/${id}`);
      
      addToast({ type: 'success', title: 'Serviço excluído!' });
      fetchServices();
    } catch {
      addToast({ type: 'error', title: 'Falha ao excluir serviço' });
    }
  };

  if (isLoading) return <div className={styles.container}>Carregando serviços...</div>;

  return (
    <div className={styles.container}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-6)' }}>
        <h1 className="heading-2 title" style={{ marginBottom: 0 }}>Meus Serviços</h1>
        <Button 
          variant="primary"
          leftIcon={<Plus size={18} />}
          onClick={() => { setEditingService(null); setIsModalOpen(true); }}
        >
          Novo Serviço
        </Button>
      </div>
      
      <div className={styles.content} style={{ display: 'block' }}>
        {services.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 'var(--spacing-8)', color: 'var(--gray-500)' }}>
            <p>Você ainda não tem serviços cadastrados.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 'var(--spacing-4)' }}>
            {services.map((service) => (
              <div key={service.id} style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--spacing-4)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)' }}>
                <div>
                  <h3 style={{ fontWeight: 600, fontSize: '1.1rem' }}>{service.name}</h3>
                  <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem', margin: '4px 0' }}>{service.category}</p>
                  <div style={{ display: 'flex', gap: '16px', marginTop: '8px', fontSize: '0.9rem', fontWeight: 500 }}>
                    <span style={{ color: 'var(--primary-600)' }}>R$ {service.price.toFixed(2)}</span>
                    <span>{service.duration} min</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <button 
                    type="button"
                    onClick={() => { setEditingService(service); setIsModalOpen(true); }}
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--gray-500)' }}
                  >
                    <Edit2 size={18} />
                  </button>
                  <button 
                    type="button"
                    onClick={() => handleDelete(service.id)}
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--danger-500)' }}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex',
          alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)'
        }}>
          <div style={{
            backgroundColor: 'var(--surface-card)', padding: '32px', borderRadius: '16px',
            width: '90%', maxWidth: '500px', position: 'relative', boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
          }}>
            <button onClick={() => setIsModalOpen(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: 'var(--color-neutral-400)' }}>&times;</button>
            <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '24px', color: 'var(--color-neutral-900)' }}>{editingService ? 'Editar Serviço' : 'Novo Serviço'}</h2>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500, color: 'var(--color-neutral-700)' }}>Nome do Serviço</label>
                <input required name="name" type="text" defaultValue={editingService?.name || ''} placeholder="Ex: Corte Degrade" style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--surface-border)', outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500, color: 'var(--color-neutral-700)' }}>Categoria</label>
                <input required name="category" type="text" defaultValue={editingService?.category || ''} placeholder="Ex: Cabelo" style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--surface-border)', outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500, color: 'var(--color-neutral-700)' }}>Descrição (Opcional)</label>
                <textarea name="description" defaultValue={editingService?.description || ''} placeholder="Detalhes do serviço..." style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--surface-border)', outline: 'none', minHeight: '80px', resize: 'vertical' }} />
              </div>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500, color: 'var(--color-neutral-700)' }}>Preço (R$)</label>
                  <input required name="price" type="number" step="0.01" defaultValue={editingService?.price || ''} placeholder="0.00" style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--surface-border)', outline: 'none' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500, color: 'var(--color-neutral-700)' }}>Duração (Min)</label>
                  <input required name="duration" type="number" defaultValue={editingService?.duration || ''} placeholder="60" style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--surface-border)', outline: 'none' }} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '16px', justifyContent: 'flex-end' }}>
                <Button variant="secondary" type="button" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                <Button variant="primary" type="submit" isLoading={isSaving}>Salvar Serviço</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
