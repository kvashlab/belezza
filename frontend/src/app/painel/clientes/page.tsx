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

  useEffect(() => {
    async function loadClients() {
      try {
        const response = await api.get('/professionals/clients');
        setClients(response.data);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    loadClients();
  }, []);

  const filteredClients = clients.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="heading-2">Meus Clientes</h1>
          <p className="body-text">Gerencie sua base de clientes e histórico.</p>
        </div>
        <Button variant="primary">Adicionar Cliente</Button>
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
                filteredClients.map(client => (
                  <tr key={client.id} style={{ borderBottom: '1px solid var(--surface-main)' }}>
                  <td style={{ padding: 'var(--spacing-3)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
                      <Avatar name={client.name} src={client.avatar} size="sm" />
                      <span style={{ fontWeight: 600, color: 'var(--color-neutral-900)' }}>{client.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: 'var(--spacing-3)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '13px', color: 'var(--color-neutral-500)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Mail size={12} /> {client.email}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Phone size={12} /> {client.phone}</span>
                    </div>
                  </td>
                  <td style={{ padding: 'var(--spacing-3)', fontSize: '14px' }}>
                    {new Date(client.lastVisit).toLocaleDateString()}
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
    </div>
  );
}
