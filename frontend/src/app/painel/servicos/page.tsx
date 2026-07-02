'use client';
import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { useUIStore } from '@/stores/ui.store';
import { Button } from '@/components/ui/Button';
import { Plus, Edit2, Trash2 } from 'lucide-react';
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
      const token = localStorage.getItem('@belezza:token');
      const res = await fetch('http://localhost:3333/api/professionals/services', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setServices(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'professional') {
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
      const token = localStorage.getItem('@belezza:token');
      const url = editingService 
        ? `http://localhost:3333/api/professionals/services/${editingService.id}`
        : 'http://localhost:3333/api/professionals/services';
        
      const res = await fetch(url, {
        method: editingService ? 'PUT' : 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Erro ao salvar serviço');
      
      addToast({ type: 'success', title: editingService ? 'Serviço atualizado!' : 'Serviço criado!' });
      setIsModalOpen(false);
      setEditingService(null);
      fetchServices();
    } catch (e) {
      addToast({ type: 'error', title: 'Falha ao salvar serviço' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente excluir este serviço?')) return;
    
    try {
      const token = localStorage.getItem('@belezza:token');
      const res = await fetch(`http://localhost:3333/api/professionals/services/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) throw new Error('Erro ao deletar');
      
      addToast({ type: 'success', title: 'Serviço excluído!' });
      fetchServices();
    } catch (e) {
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
          onClick={() => { setEditingService(null); setIsModalOpen(true); }}
        >
          <Plus size={18} style={{ marginRight: 8 }} />
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
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'var(--bg-card)', padding: 'var(--spacing-6)', borderRadius: 'var(--radius-xl)', width: '100%', maxWidth: '500px' }}>
            <h2 style={{ marginBottom: 'var(--spacing-4)' }}>{editingService ? 'Editar Serviço' : 'Novo Serviço'}</h2>
            
            <form onSubmit={handleSubmit}>
              <div className={styles.formGridFull}>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Nome do Serviço</label>
                  <input required name="name" type="text" className={styles.input} defaultValue={editingService?.name || ''} placeholder="Ex: Corte Degrade" />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Categoria</label>
                  <input required name="category" type="text" className={styles.input} defaultValue={editingService?.category || ''} placeholder="Ex: Cabelo" />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Descrição (Opcional)</label>
                  <textarea name="description" className={styles.textarea} defaultValue={editingService?.description || ''} placeholder="Detalhes do serviço..." />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Preço (R$)</label>
                    <input required name="price" type="number" step="0.01" className={styles.input} defaultValue={editingService?.price || ''} placeholder="0.00" />
                  </div>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Duração (Minutos)</label>
                    <input required name="duration" type="number" className={styles.input} defaultValue={editingService?.duration || ''} placeholder="60" />
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: 'var(--spacing-6)', justifyContent: 'flex-end' }}>
                <Button variant="secondary" type="button" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                <Button variant="primary" type="submit" isLoading={isSaving}>Salvar</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
