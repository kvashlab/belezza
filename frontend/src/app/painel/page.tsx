'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Calendar, DollarSign, Star, Users, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { SimpleBarChart } from '@/components/ui/SimpleBarChart';
import { useAuthStore } from '@/stores/auth.store';
import { format } from 'date-fns';
import styles from './styles.module.css';

export default function PainelDashboard() {
  const { user } = useAuthStore();
  const [metricsData, setMetricsData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const token = localStorage.getItem('@belezza:token');
        const res = await fetch('http://localhost:3333/api/professionals/me/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setMetricsData(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchDashboardData();
  }, []);

  const upcomingAppointments = metricsData?.upcomingAppointments || [];
  const chartData = metricsData?.chartData || [];

  const metrics = [
    { title: 'Agendamentos Hoje', value: isLoading ? '-' : (metricsData?.todaysAppointmentsCount || '0'), icon: Calendar, color: 'var(--color-info)' },
    { title: 'Faturamento (Hoje)', value: isLoading ? '-' : `R$ ${(metricsData?.revenueToday || 0).toFixed(2)}`, icon: DollarSign, color: 'var(--color-success)' },
    { title: 'Nota Média', value: '4.8', icon: Star, color: 'var(--color-gold-500)' },
    { title: 'Novos Clientes', value: '12', icon: Users, color: 'var(--color-primary-500)' },
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
            {isLoading ? (
              <p style={{ padding: '24px', textAlign: 'center', color: 'var(--color-neutral-500)' }}>Carregando...</p>
            ) : upcomingAppointments.length === 0 ? (
              <p style={{ padding: '24px', textAlign: 'center', color: 'var(--color-neutral-500)' }}>Sem agendamentos futuros.</p>
            ) : (
              upcomingAppointments.map((appt: any, i: number) => (
                <div key={i} className={styles.agendaItem}>
                  <span className={styles.agendaTime}>{format(new Date(appt.date), 'dd/MM HH:mm')}</span>
                  <div className={styles.agendaInfo}>
                    <span className={styles.clientName}>{appt.client?.user?.name || 'Cliente'}</span>
                    <span className={styles.serviceName}>{appt.service?.name}</span>
                  </div>
                  <div 
                    className={`${styles.statusIndicator} ${styles[appt.status.toLowerCase()]}`} 
                    title={appt.status}
                    style={{
                      backgroundColor: appt.status === 'CONFIRMED' ? 'var(--color-success-500)' : 'var(--color-warning)'
                    }}
                  />
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
