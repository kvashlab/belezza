'use client';
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth.store';
import { Calendar, Search, Star, Sparkles } from 'lucide-react';
import { AppointmentCard } from '@/components/cliente/AppointmentCard';
import { Button } from '@/components/ui/Button';
import styles from './styles.module.css';

export default function ClientDashboard() {
  const { user } = useAuthStore();
  const router = useRouter();

  const firstName = user?.name?.split(' ')[0] || 'Cliente';

  // Mock data for next appointment
  const nextAppointment = {
    id: '1',
    professionalName: 'Ana Clara',
    serviceName: 'Corte e Escova',
    date: 'Amanhã, 14:00',
    time: '14:00',
    price: 'R$ 120,00',
    location: 'Studio Bela - Centro',
    status: 'confirmed' as const
  };

  return (
    <div className={styles.dashboard}>
      <section className={styles.welcomeSection}>
        <h1 className="heading-1 title">Olá, {firstName}! ✨</h1>
        <p className={styles.subtitle}>Encontre os melhores profissionais de beleza e agende seu próximo horário.</p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Acesso Rápido</h2>
        <div className={styles.quickActions}>
          <div className={styles.actionCard} onClick={() => router.push('/')}>
            <Search size={24} className={styles.actionIcon} />
            <span className={styles.actionText}>Buscar Profissionais</span>
          </div>
          <div className={styles.actionCard} onClick={() => router.push('/favoritos')}>
            <Star size={24} className={styles.actionIcon} />
            <span className={styles.actionText}>Meus Favoritos</span>
          </div>
          <div className={styles.actionCard} onClick={() => router.push('/meus-agendamentos')}>
            <Calendar size={24} className={styles.actionIcon} />
            <span className={styles.actionText}>Ver Histórico</span>
          </div>
        </div>
      </section>

      <div className={styles.grid}>
        <section className={styles.section}>
          <div className={styles.sectionTitle}>
            <span>Próximo Agendamento</span>
            <Link href="/meus-agendamentos" className={styles.viewAll}>Ver todos</Link>
          </div>
          
          {nextAppointment ? (
            <AppointmentCard {...nextAppointment} />
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyStateIcon}>
                <Calendar size={32} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-neutral-900)' }}>Nenhum agendamento</h3>
                <p>Você não tem horários marcados no momento.</p>
              </div>
              <Button onClick={() => router.push('/')}>Encontrar Profissional</Button>
            </div>
          )}
        </section>

        <section className={styles.section}>
          <div className={styles.sectionTitle}>
            <span>Recomendados para Você</span>
          </div>
          
          <div className={styles.emptyState}>
            <div className={styles.emptyStateIcon} style={{ backgroundColor: 'rgba(201, 161, 92, 0.15)', color: 'var(--color-gold-600)' }}>
              <Sparkles size={32} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--spacing-2)' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-neutral-900)' }}>Explorar Novidades</h3>
              <p>Descubra os melhores profissionais da sua região.</p>
            </div>
            <Button variant="secondary" onClick={() => router.push('/')}>Explorar</Button>
          </div>
        </section>
      </div>
    </div>
  );
}
