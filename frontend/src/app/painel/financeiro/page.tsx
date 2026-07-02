'use client';
import React, { useEffect, useState } from 'react';
import { DollarSign, TrendingUp, AlertCircle, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function FinanceiroPage() {
  const [finances, setFinances] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadFinances() {
      try {
        const token = localStorage.getItem('@belezza:token');
        const res = await fetch('http://localhost:3333/api/professionals/finances', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setFinances(data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    loadFinances();
  }, []);

  if (isLoading) return <div style={{ padding: '64px', textAlign: 'center' }}>Carregando finanças...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="heading-2">Financeiro</h1>
          <p className="body-text">Acompanhe seus ganhos e recebimentos pendentes.</p>
        </div>
        <Button variant="secondary" leftIcon={<Calendar size={18} />}>Este Mês</Button>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--spacing-4)' }}>
        <div style={{ backgroundColor: 'var(--surface-card)', padding: 'var(--spacing-6)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--surface-border)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)' }}>
          <div style={{ backgroundColor: 'var(--color-success-50)', color: 'var(--color-success-600)', padding: '16px', borderRadius: '50%' }}>
            <TrendingUp size={32} />
          </div>
          <div>
            <p style={{ color: 'var(--color-neutral-500)', fontSize: '14px', fontWeight: 500 }}>Receita Recebida</p>
            <strong style={{ fontSize: '28px', color: 'var(--color-neutral-900)' }}>R$ {(finances?.totalRevenue || 0).toFixed(2)}</strong>
          </div>
        </div>

        <div style={{ backgroundColor: 'var(--surface-card)', padding: 'var(--spacing-6)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--surface-border)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)' }}>
          <div style={{ backgroundColor: 'var(--color-warning-50)', color: 'var(--color-warning)', padding: '16px', borderRadius: '50%' }}>
            <AlertCircle size={32} />
          </div>
          <div>
            <p style={{ color: 'var(--color-neutral-500)', fontSize: '14px', fontWeight: 500 }}>A Receber (Pendentes)</p>
            <strong style={{ fontSize: '28px', color: 'var(--color-neutral-900)' }}>R$ {(finances?.pendingRevenue || 0).toFixed(2)}</strong>
          </div>
        </div>
      </div>

      <div style={{ backgroundColor: 'var(--surface-card)', padding: 'var(--spacing-6)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--surface-border)' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: 'var(--spacing-4)' }}>Histórico de Transações</h3>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--surface-border)', color: 'var(--color-neutral-500)' }}>
                <th style={{ padding: 'var(--spacing-3)', fontWeight: 600 }}>Data</th>
                <th style={{ padding: 'var(--spacing-3)', fontWeight: 600 }}>Cliente</th>
                <th style={{ padding: 'var(--spacing-3)', fontWeight: 600 }}>Serviço</th>
                <th style={{ padding: 'var(--spacing-3)', fontWeight: 600 }}>Status</th>
                <th style={{ padding: 'var(--spacing-3)', fontWeight: 600, textAlign: 'right' }}>Valor</th>
              </tr>
            </thead>
            <tbody>
              {finances?.transactions?.map((t: any) => (
                <tr key={t.id} style={{ borderBottom: '1px solid var(--surface-main)' }}>
                  <td style={{ padding: 'var(--spacing-3)', fontSize: '14px' }}>
                    {new Date(t.date).toLocaleDateString()}
                  </td>
                  <td style={{ padding: 'var(--spacing-3)', fontWeight: 500, color: 'var(--color-neutral-900)' }}>
                    {t.client}
                  </td>
                  <td style={{ padding: 'var(--spacing-3)', fontSize: '14px', color: 'var(--color-neutral-600)' }}>
                    {t.service}
                  </td>
                  <td style={{ padding: 'var(--spacing-3)' }}>
                    <span style={{ 
                      padding: '4px 8px', 
                      borderRadius: '16px', 
                      fontSize: '12px', 
                      fontWeight: 600,
                      backgroundColor: t.status === 'Recebido' ? 'var(--color-success-50)' : 'var(--color-warning-50)',
                      color: t.status === 'Recebido' ? 'var(--color-success-600)' : 'var(--color-warning)'
                    }}>
                      {t.status}
                    </span>
                  </td>
                  <td style={{ padding: 'var(--spacing-3)', textAlign: 'right', fontWeight: 600, color: 'var(--color-neutral-900)' }}>
                    R$ {t.amount.toFixed(2)}
                  </td>
                </tr>
              ))}
              {(!finances?.transactions || finances.transactions.length === 0) && (
                <tr>
                  <td colSpan={5} style={{ padding: 'var(--spacing-8)', textAlign: 'center', color: 'var(--color-neutral-500)' }}>
                    Nenhuma transação encontrada.
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
