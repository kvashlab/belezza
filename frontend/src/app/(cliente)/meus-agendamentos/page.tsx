'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { Tabs } from '@/components/ui/Tabs';
import { AppointmentCard } from '@/components/cliente/AppointmentCard';

// Mock data
const mockAppointments = {
  upcoming: [
    {
      id: '1',
      professionalName: 'Ana Clara',
      serviceName: 'Corte e Escova',
      date: '15 de Agosto',
      time: '14:00',
      price: 'R$ 120,00',
      location: 'Studio Bela - Centro',
      status: 'confirmed' as const
    },
    {
      id: '2',
      professionalName: 'Bruna Nails',
      serviceName: 'Manicure e Pedicure',
      date: '20 de Agosto',
      time: '10:30',
      price: 'R$ 60,00',
      location: 'Shopping Cidade',
      status: 'pending' as const
    }
  ],
  history: [
    {
      id: '3',
      professionalName: 'Carlos Barber',
      serviceName: 'Corte Degradê',
      date: '01 de Agosto',
      time: '18:00',
      price: 'R$ 45,00',
      location: 'Barbearia Vintage',
      status: 'completed' as const
    },
    {
      id: '4',
      professionalName: 'Ana Clara',
      serviceName: 'Hidratação',
      date: '10 de Julho',
      time: '15:00',
      price: 'R$ 90,00',
      location: 'Studio Bela - Centro',
      status: 'cancelled' as const
    }
  ]
};

export default function MeusAgendamentosPage() {
  const router = useRouter();

  const handleCancel = (id: string) => alert(`Cancelar agendamento ${id}`);
  const handleReschedule = (id: string) => alert(`Reagendar agendamento ${id}`);
  const handleReview = (id: string) => alert(`Avaliar agendamento ${id}`);
  const handleRebook = (id: string) => alert(`Agendar novamente ${id}`);

  const renderGrid = (items: typeof mockAppointments.upcoming) => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--spacing-6)' }}>
      {items.map(item => (
        <AppointmentCard 
          key={item.id} 
          {...item} 
          onCancel={handleCancel}
          onReschedule={handleReschedule}
          onReview={handleReview}
          onRebook={handleRebook}
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
      
      <Tabs 
        items={[
          {
            id: 'upcoming',
            label: 'Próximos',
            content: mockAppointments.upcoming.length > 0 ? (
              renderGrid(mockAppointments.upcoming)
            ) : (
              <div style={{ padding: 'var(--spacing-8)', textAlign: 'center', backgroundColor: 'var(--surface-card)', borderRadius: 'var(--radius-lg)' }}>
                Nenhum agendamento futuro.
              </div>
            )
          },
          {
            id: 'history',
            label: 'Histórico',
            content: mockAppointments.history.length > 0 ? (
              renderGrid(mockAppointments.history)
            ) : (
              <div style={{ padding: 'var(--spacing-8)', textAlign: 'center', backgroundColor: 'var(--surface-card)', borderRadius: 'var(--radius-lg)' }}>
                Nenhum histórico de agendamento.
              </div>
            )
          }
        ]}
      />
    </div>
  );
}
