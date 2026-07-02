'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth.store';
import { Calendar, Search, Star, Sparkles } from 'lucide-react';
import { AppointmentCard } from '@/components/cliente/AppointmentCard';
import { Button } from '@/components/ui/Button';
import { format, isAfter } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useUIStore } from '@/stores/ui.store';
import styles from './styles.module.css';

export default function ClientDashboard() {
  const { user } = useAuthStore();
  const router = useRouter();
  const { addToast } = useUIStore();
  
  const [appointments, setAppointments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const firstName = user?.name?.split(' ')[0] || 'Cliente';

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem('@belezza:token');
      const res = await fetch('http://localhost:3333/api/appointments/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setAppointments(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const token = localStorage.getItem('@belezza:token');
      const res = await fetch(`http://localhost:3333/api/appointments/${id}/status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        addToast({ type: 'success', title: 'Sucesso', message: 'Status atualizado!' });
        fetchAppointments();
      }
    } catch {
      addToast({ type: 'error', title: 'Erro', message: 'Falha ao atualizar status.' });
    }
  };

  const handleCancel = (id: string) => updateStatus(id, 'CANCELLED');
  const handleRebook = (username: string) => router.push(`/@${username}/agendar`);

  const now = new Date();
  
  const upcomingAppointments = appointments
    .filter(a => isAfter(new Date(a.date), now) && a.status !== 'CANCELLED')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const nextApptData = upcomingAppointments[0];
  
  let nextAppointment = null;
  if (nextApptData) {
    const d = new Date(nextApptData.date);
    nextAppointment = {
      id: nextApptData.id,
      professionalName: nextApptData.professional?.businessName || nextApptData.professional?.user?.name || 'Profissional',
      username: nextApptData.professional?.username,
      serviceName: nextApptData.service?.name || 'Serviço',
      date: format(d, "dd 'de' MMMM", { locale: ptBR }),
      time: format(d, 'HH:mm'),
      price: `R$ ${nextApptData.price.toFixed(2)}`,
      location: nextApptData.professional?.city ? `${nextApptData.professional.city}` : 'Local',
      status: nextApptData.status.toLowerCase()
    };
  }

  return (
    <div className={styles.dashboard}>
      <section className={styles.welcomeSection}>
        <h1 className="heading-1 title">Olá, {firstName}! ✨</h1>
        <p className={styles.subtitle}>Encontre os melhores profissionais de beleza e agende seu próximo horário.</p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Acesso Rápido</h2>
        <div className={styles.quickActions}>
          <div className={styles.actionCard} onClick={() => router.push('/explorar')}>
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
          
          {isLoading ? (
            <div style={{ padding: '24px', textAlign: 'center', color: 'var(--color-neutral-500)' }}>Carregando...</div>
          ) : nextAppointment ? (
            <AppointmentCard 
              {...nextAppointment} 
              onCancel={() => handleCancel(nextAppointment.id)}
              onRebook={() => handleRebook(nextAppointment.username)}
            />
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyStateIcon}>
                <Calendar size={32} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-neutral-900)' }}>Nenhum agendamento</h3>
                <p>Você não tem horários marcados no momento.</p>
              </div>
              <Button onClick={() => router.push('/explorar')}>Encontrar Profissional</Button>
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
            <Button variant="secondary" onClick={() => router.push('/explorar')}>Explorar</Button>
          </div>
        </section>
      </div>
    </div>
  );
}
