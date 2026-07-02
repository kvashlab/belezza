'use client';
import React from 'react';
import { Calendar, DollarSign, Star, Users } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { SimpleBarChart } from '@/components/ui/SimpleBarChart';
import { useAuthStore } from '@/stores/auth.store';
import styles from './styles.module.css';

export default function PainelDashboard() {
  const { user } = useAuthStore();
  
  const chartData = [
    { label: 'Seg', value: 150 },
    { label: 'Ter', value: 300 },
    { label: 'Qua', value: 450 },
    { label: 'Qui', value: 200 },
    { label: 'Sex', value: 800 },
    { label: 'Sáb', value: 1200 },
    { label: 'Dom', value: 0 },
  ];

  const metrics = [
    { title: 'Agendamentos Hoje', value: '8', icon: Calendar, color: 'var(--color-info)' },
    { title: 'Faturamento Mês', value: 'R$ 4.250', icon: DollarSign, color: 'var(--color-success)' },
    { title: 'Nota Média', value: '4.8', icon: Star, color: 'var(--color-gold-500)' },
    { title: 'Novos Clientes', value: '12', icon: Users, color: 'var(--color-primary-500)' },
  ];

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Olá, {user?.name?.split(' ')[0] || 'Profissional'} 👋</h1>
          <p className={styles.subtitle}>Aqui está o resumo do seu negócio hoje.</p>
        </div>
        <Button variant="primary">Novo Agendamento</Button>
      </header>

      <div className={styles.metricsGrid}>
        {metrics.map((metric, i) => (
          <div key={i} className={styles.metricCard}>
            <div className={styles.metricIcon} style={{ color: metric.color, backgroundColor: `${metric.color}20` }}>
              <metric.icon size={24} />
            </div>
            <div>
              <p className={styles.metricLabel}>{metric.title}</p>
              <strong className={styles.metricValue}>{metric.value}</strong>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.chartSection} style={{ marginTop: 'var(--spacing-8)', backgroundColor: 'var(--surface-card)', padding: 'var(--spacing-6)', borderRadius: 'var(--radius-md)', border: '1px solid var(--surface-border)' }}>
        <h2 className="heading-3" style={{ marginBottom: 'var(--spacing-4)' }}>Faturamento da Semana</h2>
        <SimpleBarChart data={chartData} height={250} />
      </div>
    </div>
  );
}
