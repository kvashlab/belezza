'use client';
import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { useUIStore } from '@/stores/ui.store';
import { Button } from '@/components/ui/Button';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { api } from '@/lib/api';
import { VALID_CATEGORIES } from '@/constants/categories';
import styles from '../perfil/styles.module.css';

export default function ServicosProfissional() {
  // role from the store is already normalized to lowercase ('professional')
  const { role, isAuthenticated } = useAuthStore();
  const { addToast } = useUIStore();
  const [services, setServices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);

  const fetchServices = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/professionals/services');
      setServices(response.data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  // Use the `role` field from the store which is already lowercase
  useEffect(() => {
    if (isAuthenticated && role === 'professional') {
      fetchServices();
    } else if (!isAuthenticated) {
      setIsLoading(false);
    }
  }, [isAuthenticated, role]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const form = e.target as HTMLFormElement;
    
    const formData = new FormData();
    formData.append('name', (form.elements.namedItem('name') as HTMLInputElement).value);
    formData.append('description', (form.elements.namedItem('description') as HTMLInputElement).value);
    formData.append('category', (form.elements.namedItem('category') as HTMLInputElement).value);
    formData.append('price', (form.elements.namedItem('price') as HTMLInputElement).value);
    formData.append('duration', (form.elements.namedItem('duration') as HTMLInputElement).value);

    const imageFile = (form.elements.namedItem('image') as HTMLInputElement)?.files?.[0];
    if (imageFile) {
      formData.append('image', imageFile);
    } else if (editingService) {
      const removeImage = (form.elements.namedItem('removeImage') as HTMLInputElement)?.checked;
      if (removeImage) {
        formData.append('imageUrl', 'null');
      }
    }

    try {
      if (editingService) {
        await api.put(`/professionals/services/${editingService.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await api.post('/professionals/services', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
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
        <div>
          <h1 className="heading-2" style={{ color: 'var(--color-neutral-900)' }}>Meus Serviços</h1>
          <p className="body-text" style={{ color: 'var(--color-neutral-500)' }}>Gerencie os serviços que você oferece aos seus clientes.</p>
        </div>
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
          <div style={{ textAlign: 'center', padding: 'var(--spacing-8)', color: 'var(--color-neutral-500)', backgroundColor: 'var(--surface-card)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--surface-border)' }}>
            <div style={{ width: '64px', height: '64px', backgroundColor: 'var(--color-neutral-100)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Plus size={24} color="var(--color-neutral-400)" />
            </div>
            <p style={{ fontSize: '16px', fontWeight: 500, color: 'var(--color-neutral-700)' }}>Você ainda não tem serviços cadastrados.</p>
            <p style={{ fontSize: '14px', marginTop: '4px' }}>Adicione seu primeiro serviço para começar a receber agendamentos.</p>
            <Button variant="primary" style={{ marginTop: '16px' }} onClick={() => { setEditingService(null); setIsModalOpen(true); }}>
              Adicionar Serviço
            </Button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--spacing-4)' }}>
            {services.map((service) => (
              <div key={service.id} style={{ 
                backgroundColor: 'var(--surface-card)', 
                border: '1px solid var(--surface-border)', 
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                transition: 'transform 0.2s, box-shadow 0.2s',
                display: 'flex',
                flexDirection: 'column'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                {service.imageUrl ? (
                  <div style={{ width: '100%', height: '160px', position: 'relative', backgroundColor: 'var(--surface-main)' }}>
                    <img src={service.imageUrl} alt={service.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ) : (
                  <div style={{ width: '100%', height: '120px', backgroundColor: 'var(--color-primary-50)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ color: 'var(--color-primary-300)', fontSize: '14px', fontWeight: 500 }}>Sem Imagem</span>
                  </div>
                )}
                
                <div style={{ padding: 'var(--spacing-4)', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <span style={{ display: 'inline-block', padding: '2px 8px', backgroundColor: 'var(--color-neutral-100)', color: 'var(--color-neutral-600)', borderRadius: '12px', fontSize: '12px', fontWeight: 500, marginBottom: '8px' }}>
                        {service.category}
                      </span>
                      <h3 style={{ fontWeight: 600, fontSize: '16px', color: 'var(--color-neutral-900)' }}>{service.name}</h3>
                    </div>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button 
                        type="button"
                        onClick={() => { setEditingService(service); setIsModalOpen(true); }}
                        style={{ padding: '6px', background: 'var(--color-primary-50)', borderRadius: '6px', border: 'none', cursor: 'pointer', color: 'var(--color-primary-600)' }}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        type="button"
                        onClick={() => handleDelete(service.id)}
                        style={{ padding: '6px', background: 'var(--color-danger-50)', borderRadius: '6px', border: 'none', cursor: 'pointer', color: 'var(--color-danger-600)' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  
                  {service.description && (
                    <p style={{ color: 'var(--color-neutral-500)', fontSize: '13px', margin: '12px 0', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {service.description}
                    </p>
                  )}
                  
                  <div style={{ marginTop: 'auto', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--surface-border)' }}>
                    <span style={{ color: 'var(--color-primary-700)', fontWeight: 700, fontSize: '18px' }}>R$ {service.price.toFixed(2)}</span>
                    <span style={{ color: 'var(--color-neutral-500)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      ⏱ {service.duration} min
                    </span>
                  </div>
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
            width: '90%', maxWidth: '500px', position: 'relative', boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
            maxHeight: '90vh', overflowY: 'auto'
          }}>
            <button onClick={() => setIsModalOpen(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: 'var(--color-neutral-400)' }}>&times;</button>
            <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '24px', color: 'var(--color-neutral-900)' }}>{editingService ? 'Editar Serviço' : 'Novo Serviço'}</h2>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500, color: 'var(--color-neutral-700)' }}>Imagem do Serviço</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {editingService?.imageUrl && (
                    <img src={editingService.imageUrl} alt="Atual" style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} />
                  )}
                  <input type="file" name="image" accept="image/*" style={{ fontSize: '14px' }} />
                </div>
                {editingService?.imageUrl && (
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px', fontSize: '13px', color: 'var(--color-danger-600)', cursor: 'pointer' }}>
                    <input type="checkbox" name="removeImage" />
                    Remover imagem atual
                  </label>
                )}
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500, color: 'var(--color-neutral-700)' }}>Nome do Serviço</label>
                <input required name="name" type="text" defaultValue={editingService?.name || ''} placeholder="Ex: Corte Degrade" style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--surface-border)', outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500, color: 'var(--color-neutral-700)' }}>Categoria</label>
                <select required name="category" defaultValue={editingService?.category || ''} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--surface-border)', outline: 'none', backgroundColor: 'var(--surface-main)' }}>
                  <option value="" disabled>Selecione uma categoria</option>
                  {VALID_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
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
