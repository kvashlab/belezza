'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Calendar, DollarSign, Star, Users, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { SimpleBarChart } from '@/components/ui/SimpleBarChart';
import { useAuthStore } from '@/stores/auth.store';
import { api } from '@/lib/api';
import { format } from 'date-fns';
import styles from './styles.module.css';

export default function PainelDashboard() {
  const { user } = useAuthStore();
  const [metricsData, setMetricsData] = useState<any>(null);
  const [profileData, setProfileData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showPremiumPopup, setShowPremiumPopup] = useState(false); // Initially false, evaluated in useEffect
  
  useEffect(() => {
    // Check session storage so it only shows once per login session
    if (!sessionStorage.getItem('@belezza:premiumPopupShown')) {
      setShowPremiumPopup(true);
    }

    async function fetchDashboardData() {
      try {
        const [metricsResponse, profileResponse] = await Promise.all([
          api.get('/professionals/me/dashboard'),
          api.get('/professionals/me')
        ]);
        setMetricsData(metricsResponse.data);
        setProfileData(profileResponse.data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchDashboardData();
  }, []);

  const handleClosePopup = () => {
    setShowPremiumPopup(false);
    sessionStorage.setItem('@belezza:premiumPopupShown', 'true');
  };

  const upcomingAppointments = metricsData?.upcomingAppointments || [];
  const chartData = metricsData?.chartData || [];

  const metrics = [
    { title: 'Agendamentos Hoje', value: isLoading ? '-' : (metricsData?.todaysAppointmentsCount || '0'), icon: Calendar, color: 'var(--color-info)' },
    { title: 'Faturamento (Hoje)', value: isLoading ? '-' : `R$ ${(metricsData?.revenueToday || 0).toFixed(2)}`, icon: DollarSign, color: 'var(--color-success)' },
    { title: 'Nota Média', value: isLoading ? '-' : (metricsData?.averageRating || '5.0'), icon: Star, color: 'var(--color-gold-500)' },
    { title: 'Novos Clientes', value: isLoading ? '-' : (metricsData?.newClients || '0'), icon: Users, color: 'var(--color-primary-500)' },
  ];

  return (
    <div className={styles.dashboard}>
      {/* POPUP PLANO PREMIUM */}
      {!isLoading && profileData?.plan === 'FREE' && showPremiumPopup && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          backdropFilter: 'blur(4px)'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '32px',
            maxWidth: '500px',
            width: '90%',
            textAlign: 'center',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            position: 'relative'
          }}>
            <button 
              onClick={handleClosePopup}
              style={{
                position: 'absolute', top: '16px', right: '16px',
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: '24px', color: 'var(--color-neutral-400)'
              }}
            >
              &times;
            </button>
            <div style={{
              background: 'linear-gradient(135deg, var(--color-gold-400) 0%, var(--color-gold-600) 100%)',
              width: '64px', height: '64px', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 24px', color: 'white'
            }}>
              <Star size={32} fill="currentColor" />
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', color: 'var(--color-neutral-900)' }}>
              Eleve seu negócio com o Premium! 🚀
            </h2>
            <p style={{ fontSize: '16px', color: 'var(--color-neutral-600)', marginBottom: '24px', lineHeight: '1.5' }}>
              Reduza faltas com lembretes automáticos pelo WhatsApp, receba pagamentos antecipados e desbloqueie agendamentos ilimitados.
            </p>
            <Button variant="primary" size="lg" style={{ width: '100%', background: 'var(--color-gold-500)', borderColor: 'var(--color-gold-500)', color: 'white' }} onClick={() => router.push('/painel/premium')}>
              Ativar Plano Premium (14 dias grátis)
            </Button>
            <button 
              onClick={handleClosePopup}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                marginTop: '16px', color: 'var(--color-neutral-500)', fontWeight: 500, fontSize: '14px'
              }}
            >
              Talvez mais tarde
            </button>
          </div>
        </div>
      )}

      <header className={styles.header}>
        <div>
          <h1 className="heading-1 title">Olá, {((user as any)?.professionalProfile?.businessName || user?.name)?.split(' ')[0] || 'Profissional'} ✨</h1>
          <p className={styles.subtitle}>Aqui está o resumo do seu negócio hoje.</p>
        </div>
        <Link href="/painel/agenda">
          <Button variant="primary" leftIcon={<Plus size={18} />}>Novo Agendamento</Button>
        </Link>
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
                    <span className={styles.clientName}>{appt.client?.user?.name || appt.clientName || 'Cliente Manual'}</span>
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
