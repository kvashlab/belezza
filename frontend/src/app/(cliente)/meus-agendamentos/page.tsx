'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Tabs } from '@/components/ui/Tabs';
import { AppointmentCard } from '@/components/cliente/AppointmentCard';
import { ReviewModal } from '@/components/cliente/ReviewModal';
import { format, isAfter, isBefore } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useUIStore } from '@/stores/ui.store';

export default function MeusAgendamentosPage() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewAppointmentId, setReviewAppointmentId] = useState<string | null>(null);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const { addToast } = useUIStore();

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setIsLoading(true);
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
  const handleReschedule = (id: string) => alert(`Reagendar agendamento ${id}`);
  
  const handleReviewClick = (id: string) => {
    setReviewAppointmentId(id);
    setIsReviewModalOpen(true);
  };

  const handleReviewSubmit = async (rating: number, comment: string) => {
    if (!reviewAppointmentId) return;
    setIsSubmittingReview(true);
    try {
      const token = localStorage.getItem('@belezza:token');
      const res = await fetch('http://localhost:3333/api/reviews', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({
          appointmentId: reviewAppointmentId,
          rating,
          comment
        })
      });
      if (res.ok) {
        addToast({ type: 'success', title: 'Avaliação enviada!', message: 'Obrigado pelo seu feedback.' });
        setIsReviewModalOpen(false);
        fetchAppointments(); // Refresh to show as "Avaliado"
      } else {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Falha ao enviar avaliação');
      }
    } catch (error: any) {
      addToast({ type: 'error', title: 'Erro', message: error.message });
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleRebook = (username: string) => router.push(`/@${username}/agendar`);

  const now = new Date();
  
  // Format appointments for the cards
  const formattedAppointments = appointments.map(a => {
    const d = new Date(a.date);
    return {
      id: a.id,
      professionalName: a.professional?.businessName || a.professional?.user?.name || 'Profissional',
      username: a.professional?.username,
      serviceName: a.service?.name || 'Serviço',
      date: format(d, "dd 'de' MMMM", { locale: ptBR }),
      time: format(d, 'HH:mm'),
      price: `R$ ${a.price.toFixed(2)}`,
      location: a.professional?.city ? `${a.professional.city}` : 'Local',
      status: a.status.toLowerCase(), // PENDING -> pending
      rawDate: d,
      hasReview: !!a.review
    };
  });

  const upcoming = formattedAppointments.filter(a => isAfter(a.rawDate, now) && a.status !== 'cancelled');
  const history = formattedAppointments.filter(a => isBefore(a.rawDate, now) || a.status === 'cancelled' || a.status === 'completed');

  const renderGrid = (items: any[]) => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--spacing-6)' }}>
      {items.map(item => (
        <AppointmentCard 
          key={item.id} 
          {...item} 
          onCancel={() => handleCancel(item.id)}
          onReschedule={() => handleReschedule(item.id)}
          onReview={() => handleReviewClick(item.id)}
          onRebook={() => handleRebook(item.username)}
        />
      ))}
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
      <div>
        <h1 className="heading-2" style={{ color: 'var(--color-neutral-900)' }}>Meus Agendamentos</h1>
        <p className="body-text" style={{ color: 'var(--color-neutral-500)' }}>Gerencie e acompanhe todos os seus serviços.</p>
      </div>
      
      {isLoading ? (
        <div style={{ padding: 'var(--spacing-8)', textAlign: 'center' }}>Carregando agendamentos...</div>
      ) : (
        <Tabs 
          items={[
            {
              id: 'upcoming',
              label: 'Próximos',
              content: upcoming.length > 0 ? (
                renderGrid(upcoming)
              ) : (
                <div style={{ padding: 'var(--spacing-8)', textAlign: 'center', backgroundColor: 'var(--surface-card)', borderRadius: 'var(--radius-lg)' }}>
                  Nenhum agendamento futuro.
                </div>
              )
            },
            {
              id: 'history',
              label: 'Histórico',
              content: history.length > 0 ? (
                renderGrid(history)
              ) : (
                <div style={{ padding: 'var(--spacing-8)', textAlign: 'center', backgroundColor: 'var(--surface-card)', borderRadius: 'var(--radius-lg)' }}>
                  Nenhum histórico de agendamento.
                </div>
              )
            }
          ]}
        />
      )}

      <ReviewModal 
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onSubmit={handleReviewSubmit}
        isSubmitting={isSubmittingReview}
      />
    </div>
  );
}
