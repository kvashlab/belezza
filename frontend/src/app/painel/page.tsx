'use client';
import React from 'react';
import Link from 'next/link';
import { Calendar, DollarSign, Star, Users, Plus } from 'lucide-react';
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

  const upcomingClients = [
    { time: '14:00', name: 'Ana Clara', service: 'Corte e Escova', status: 'confirmed' },
    { time: '15:30', name: 'Juliana Silva', service: 'Coloração', status: 'confirmed' },
    { time: '17:00', name: 'Marcos Paulo', service: 'Corte Masculino', status: 'pending' },
    { time: '18:30', name: 'Beatriz Souza', service: 'Hidratação', status: 'confirmed' },
  ];

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div>
          <h1 className="heading-1 title">Olá, {user?.name?.split(' ')[0] || 'Profissional'} 👋</h1>
          <p className={styles.subtitle}>Aqui está o resumo do seu negócio hoje.</p>
        </div>
        <Button variant="primary" leftIcon={<Plus size={18} />}>Novo Agendamento</Button>
      </header>

      <div className={styles.metricsGrid}>
        {metrics.map((metric, i) => (
          <div key={i} className={styles.metricCard}>
            <div className={styles.metricIcon} style={{ color: metric.color, backgroundColor: `${metric.color}20` }}>
              <metric.icon size={24} />
            </div>
            <div className={styles.metricContent}>
              <p className={styles.metricLabel}>{metric.title}</p>
              <strong className={styles.metricValue}>{metric.value}</strong>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.gridContent}>
        <section className={styles.section}>
          <div className={styles.chartCard}>
            <h2 className={styles.sectionTitle} style={{ marginBottom: 'var(--spacing-6)' }}>Faturamento da Semana</h2>
            <SimpleBarChart data={chartData} height={250} />
          </div>
        </section>

        <section className={styles.section}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 className={styles.sectionTitle}>Próximos Clientes</h2>
            <Link href="/painel/agenda" style={{ color: 'var(--color-primary-600)', fontSize: '14px', fontWeight: 500 }}>
              Ver Agenda
            </Link>
          </div>
          
          <div className={styles.agendaList}>
            {upcomingClients.map((client, i) => (
              <div key={i} className={styles.agendaItem}>
                <span className={styles.agendaTime}>{client.time}</span>
                <div className={styles.agendaInfo}>
                  <span className={styles.clientName}>{client.name}</span>
                  <span className={styles.serviceName}>{client.service}</span>
                </div>
                <div 
                  className={`${styles.statusIndicator} ${styles[client.status]}`} 
                  title={client.status === 'confirmed' ? 'Confirmado' : 'Pendente'}
                />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
