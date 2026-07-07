'use client';
import React, { useState, useEffect } from 'react';
import { Search, Mail, Phone, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { api } from '@/lib/api';

export default function ClientesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [clients, setClients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const loadClients = async () => {
    try {
      const response = await api.get('/professionals/clients');
      setClients(response.data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

  const handleSaveClient = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const form = e.target as HTMLFormElement;
    
    const payload = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      phone: (form.elements.namedItem('phone') as HTMLInputElement).value,
    };

    try {
      await api.post('/professionals/customers', payload);
      setIsModalOpen(false);
      loadClients();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  const filteredClients = clients.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="heading-2">Meus Clientes</h1>
          <p className="body-text">Gerencie sua base de clientes e histórico.</p>
        </div>
        <Button variant="primary" onClick={() => setIsModalOpen(true)}>Adicionar Cliente</Button>
      </div>

      <div style={{ backgroundColor: 'var(--surface-card)', padding: 'var(--spacing-6)', borderRadius: 'var(--radius-md)', border: '1px solid var(--surface-border)' }}>
        
        <div style={{ display: 'flex', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-6)' }}>
          <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'var(--surface-main)', padding: 'var(--spacing-2) var(--spacing-3)', borderRadius: 'var(--radius-sm)', flex: 1, border: '1px solid var(--surface-border)' }}>
            <Search size={18} color="var(--color-neutral-500)" style={{ marginRight: '8px' }} />
            <input 
              type="text" 
              placeholder="Buscar por nome..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', color: 'var(--color-neutral-900)' }}
            />
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--surface-border)', color: 'var(--color-neutral-500)' }}>
                <th style={{ padding: 'var(--spacing-3)', fontWeight: 600 }}>Cliente</th>
                <th style={{ padding: 'var(--spacing-3)', fontWeight: 600 }}>Contato</th>
                <th style={{ padding: 'var(--spacing-3)', fontWeight: 600 }}>Última Visita</th>
                <th style={{ padding: 'var(--spacing-3)', fontWeight: 600 }}>Gasto Total</th>
                <th style={{ padding: 'var(--spacing-3)', fontWeight: 600, width: '40px' }}></th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} style={{ padding: 'var(--spacing-8)', textAlign: 'center', color: 'var(--color-neutral-500)' }}>
                    Carregando clientes...
                  </td>
                </tr>
              ) : (
                filteredClients.map((client, i) => (
                  <tr key={client.id || i} style={{ borderBottom: '1px solid var(--surface-main)' }}>
                  <td style={{ padding: 'var(--spacing-3)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
                      <Avatar name={client.name} src={client.avatar} size="sm" />
                      <div>
                        <span style={{ fontWeight: 600, color: 'var(--color-neutral-900)', display: 'block' }}>{client.name}</span>
                        {client.isManual && <span style={{ fontSize: '11px', color: 'var(--color-neutral-500)', background: 'var(--surface-border)', padding: '2px 6px', borderRadius: '4px' }}>Adicionado Manualmente</span>}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: 'var(--spacing-3)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '13px', color: 'var(--color-neutral-500)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Mail size={12} /> {client.email || '-'}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Phone size={12} /> {client.phone || '-'}</span>
                    </div>
                  </td>
                  <td style={{ padding: 'var(--spacing-3)', fontSize: '14px' }}>
                    {client.lastVisit ? new Date(client.lastVisit).toLocaleDateString() : 'N/A'}
                  </td>
                  <td style={{ padding: 'var(--spacing-3)', fontSize: '14px', fontWeight: 600 }}>
                    R$ {client.totalSpent.toFixed(2)}
                  </td>
                  <td style={{ padding: 'var(--spacing-3)' }}>
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-neutral-500)' }}>
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
                ))
              )}
              {!isLoading && filteredClients.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: 'var(--spacing-8)', textAlign: 'center', color: 'var(--color-neutral-500)' }}>
                    Nenhum cliente encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex',
          alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)'
        }}>
          <div style={{
            backgroundColor: 'var(--surface-card)', padding: '32px', borderRadius: '16px',
            width: '90%', maxWidth: '400px', position: 'relative', boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
          }}>
            <button onClick={() => setIsModalOpen(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: 'var(--color-neutral-400)' }}>&times;</button>
            <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '24px', color: 'var(--color-neutral-900)' }}>Novo Cliente</h2>
            
            <form onSubmit={handleSaveClient} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500, color: 'var(--color-neutral-700)' }}>Nome do Cliente *</label>
                <input required name="name" type="text" placeholder="Ex: Maria Joaquina" style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--surface-border)', outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500, color: 'var(--color-neutral-700)' }}>Telefone / WhatsApp</label>
                <input name="phone" type="text" placeholder="(11) 99999-9999" style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--surface-border)', outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500, color: 'var(--color-neutral-700)' }}>E-mail</label>
                <input name="email" type="email" placeholder="maria@email.com" style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--surface-border)', outline: 'none' }} />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '16px', justifyContent: 'flex-end' }}>
                <Button variant="secondary" type="button" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                <Button variant="primary" type="submit" isLoading={isSaving}>Salvar Cliente</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
