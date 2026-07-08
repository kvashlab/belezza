'use client';
import React, { useEffect, useState, useMemo } from 'react';
import { TrendingUp, AlertCircle, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { api } from '@/lib/api';

type Period = 'month' | 'quarter' | 'year' | 'all';

const PERIOD_LABELS: Record<Period, string> = {
  month: 'Este Mês',
  quarter: 'Últimos 3 Meses',
  year: 'Este Ano',
  all: 'Tudo',
};

export default function FinanceiroPage() {
  const [finances, setFinances] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState<Period>('month');
  const [showPeriodMenu, setShowPeriodMenu] = useState(false);

  useEffect(() => {
    async function loadFinances() {
      try {
        const response = await api.get('/professionals/finances');
        setFinances(response.data);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    loadFinances();
  }, []);

  // Filter transactions by selected period (client-side filtering)
  const filteredData = useMemo(() => {
    if (!finances?.transactions) return { transactions: [], totalRevenue: 0, pendingRevenue: 0 };

    const now = new Date();
    const periodStart = new Date();

    if (period === 'month') {
      periodStart.setDate(1);
      periodStart.setHours(0, 0, 0, 0);
    } else if (period === 'quarter') {
      periodStart.setMonth(now.getMonth() - 2);
      periodStart.setDate(1);
      periodStart.setHours(0, 0, 0, 0);
    } else if (period === 'year') {
      periodStart.setMonth(0);
      periodStart.setDate(1);
      periodStart.setHours(0, 0, 0, 0);
    }

    const transactions = period === 'all'
      ? finances.transactions
      : finances.transactions.filter((t: any) => new Date(t.date) >= periodStart);

    let totalRevenue = 0;
    let pendingRevenue = 0;
    transactions.forEach((t: any) => {
      if (t.status === 'Recebido') totalRevenue += t.amount;
      else pendingRevenue += t.amount;
    });

    return { transactions, totalRevenue, pendingRevenue };
  }, [finances, period]);

  if (isLoading) return <div style={{ padding: '64px', textAlign: 'center' }}>Carregando finanças...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="heading-2">Financeiro</h1>
          <p className="body-text">Acompanhe seus ganhos e recebimentos pendentes.</p>
        </div>
        {/* Period selector dropdown */}
        <div style={{ position: 'relative' }}>
          <Button
            variant="secondary"
            leftIcon={<Calendar size={18} />}
            onClick={() => setShowPeriodMenu(v => !v)}
          >
            {PERIOD_LABELS[period]}
          </Button>
          {showPeriodMenu && (
            <div style={{
              position: 'absolute', top: '100%', right: 0, marginTop: '8px',
              backgroundColor: 'var(--surface-card)', border: '1px solid var(--surface-border)',
              borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)',
              zIndex: 50, minWidth: '160px', overflow: 'hidden'
            }}>
              {(Object.entries(PERIOD_LABELS) as [Period, string][]).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => { setPeriod(key); setShowPeriodMenu(false); }}
                  style={{
                    width: '100%', textAlign: 'left', padding: '10px 16px',
                    background: period === key ? 'var(--color-primary-50)' : 'transparent',
                    border: 'none', cursor: 'pointer',
                    color: period === key ? 'var(--color-primary-700)' : 'var(--color-neutral-700)',
                    fontWeight: period === key ? 600 : 400, fontSize: '14px'
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--spacing-4)' }}>
        <div style={{ backgroundColor: 'var(--surface-card)', padding: 'var(--spacing-6)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--surface-border)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)' }}>
          <div style={{ backgroundColor: 'var(--color-success-50)', color: 'var(--color-success-600)', padding: '16px', borderRadius: '50%' }}>
            <TrendingUp size={32} />
          </div>
          <div>
            <p style={{ color: 'var(--color-neutral-500)', fontSize: '14px', fontWeight: 500 }}>Receita Recebida</p>
            <strong style={{ fontSize: '28px', color: 'var(--color-neutral-900)' }}>R$ {filteredData.totalRevenue.toFixed(2)}</strong>
            <p style={{ fontSize: '12px', color: 'var(--color-neutral-400)', marginTop: '2px' }}>{PERIOD_LABELS[period]}</p>
          </div>
        </div>

        <div style={{ backgroundColor: 'var(--surface-card)', padding: 'var(--spacing-6)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--surface-border)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)' }}>
          <div style={{ backgroundColor: 'var(--color-warning-50)', color: 'var(--color-warning)', padding: '16px', borderRadius: '50%' }}>
            <AlertCircle size={32} />
          </div>
          <div>
            <p style={{ color: 'var(--color-neutral-500)', fontSize: '14px', fontWeight: 500 }}>A Receber (Pendentes)</p>
            <strong style={{ fontSize: '28px', color: 'var(--color-neutral-900)' }}>R$ {filteredData.pendingRevenue.toFixed(2)}</strong>
            <p style={{ fontSize: '12px', color: 'var(--color-neutral-400)', marginTop: '2px' }}>{PERIOD_LABELS[period]}</p>
          </div>
        </div>
      </div>

      <div style={{ backgroundColor: 'var(--surface-card)', padding: 'var(--spacing-6)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--surface-border)' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: 'var(--spacing-4)' }}>
          Histórico de Transações — {PERIOD_LABELS[period]}
        </h3>
        
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
              {filteredData.transactions.map((t: any) => (
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
              {filteredData.transactions.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: 'var(--spacing-8)', textAlign: 'center', color: 'var(--color-neutral-500)' }}>
                    Nenhuma transação encontrada para este período.
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
