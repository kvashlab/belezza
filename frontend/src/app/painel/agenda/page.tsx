'use client';
import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, User, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function AgendaPage() {
  const [currentDate] = useState(new Date());

  const formattedDate = new Intl.DateTimeFormat('pt-BR', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long' 
  }).format(currentDate);

  // Mock schedule
  const schedule = [
    { time: '09:00', status: 'available', client: null, service: null },
    { time: '10:00', status: 'busy', client: 'Mariana Costa', service: 'Coloração + Corte', type: 'confirmed' },
    { time: '11:00', status: 'busy', client: 'Mariana Costa', service: 'Coloração + Corte', type: 'confirmed' },
    { time: '12:00', status: 'available', client: null, service: null },
    { time: '13:00', status: 'busy', client: 'Almoço', service: 'Bloqueio', type: 'blocked' },
    { time: '14:00', status: 'busy', client: 'Ana Clara', service: 'Corte e Escova', type: 'confirmed' },
    { time: '15:30', status: 'busy', client: 'Juliana Silva', service: 'Coloração', type: 'confirmed' },
    { time: '17:00', status: 'busy', client: 'Marcos Paulo', service: 'Corte Masculino', type: 'pending' },
    { time: '18:00', status: 'available', client: null, service: null },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--spacing-4)' }}>
        <div>
          <h1 className="heading-2" style={{ color: 'var(--color-neutral-900)' }}>Minha Agenda</h1>
          <p className="body-text" style={{ color: 'var(--color-neutral-500)', textTransform: 'capitalize' }}>
            {formattedDate}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--spacing-3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', backgroundColor: 'var(--surface-card)', border: '1px solid var(--surface-border)', borderRadius: 'var(--radius-md)', padding: 'var(--spacing-1)' }}>
            <button style={{ padding: 'var(--spacing-2)', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}><ChevronLeft size={20} /></button>
            <span style={{ padding: '0 var(--spacing-4)', fontWeight: 500, fontSize: '14px' }}>Hoje</span>
            <button style={{ padding: 'var(--spacing-2)', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}><ChevronRight size={20} /></button>
          </div>
          <Button variant="primary" leftIcon={<Plus size={18} />}>Novo</Button>
        </div>
      </div>
      
      <div style={{ backgroundColor: 'var(--surface-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--surface-border)', overflow: 'hidden' }}>
        <div style={{ display: 'flex', borderBottom: '1px solid var(--surface-border)', padding: 'var(--spacing-4) var(--spacing-6)', backgroundColor: 'var(--surface-main)' }}>
          <div style={{ width: '80px', fontWeight: 600, color: 'var(--color-neutral-500)', fontSize: '14px' }}>Horário</div>
          <div style={{ flex: 1, fontWeight: 600, color: 'var(--color-neutral-500)', fontSize: '14px' }}>Agendamento</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {schedule.map((slot, i) => (
            <div key={i} style={{ 
              display: 'flex', 
              borderBottom: '1px solid var(--surface-border)', 
              minHeight: '80px',
              backgroundColor: slot.type === 'blocked' ? 'var(--surface-main)' : 'transparent'
            }}>
              <div style={{ 
                width: '80px', 
                padding: 'var(--spacing-4) var(--spacing-6)', 
                borderRight: '1px solid var(--surface-border)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                color: 'var(--color-neutral-700)',
                fontWeight: 500
              }}>
                {slot.time}
              </div>
              <div style={{ flex: 1, padding: 'var(--spacing-3)' }}>
                {slot.status === 'available' ? (
                  <div style={{ 
                    height: '100%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    color: 'var(--color-neutral-400)',
                    fontSize: '14px',
                    cursor: 'pointer',
                    padding: '0 var(--spacing-3)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px dashed transparent',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--color-primary-300)'; e.currentTarget.style.color = 'var(--color-primary-600)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.color = 'var(--color-neutral-400)'; }}
                  >
                    + Adicionar agendamento
                  </div>
                ) : (
                  <div style={{ 
                    height: '100%', 
                    backgroundColor: slot.type === 'confirmed' ? 'var(--color-primary-50)' : slot.type === 'pending' ? 'rgba(224, 160, 46, 0.1)' : 'var(--color-neutral-200)',
                    borderLeft: `4px solid ${slot.type === 'confirmed' ? 'var(--color-primary-500)' : slot.type === 'pending' ? 'var(--color-warning)' : 'var(--color-neutral-500)'}`,
                    borderRadius: '4px',
                    padding: 'var(--spacing-3) var(--spacing-4)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                  }}>
                    <strong style={{ color: 'var(--color-neutral-900)', fontSize: '15px' }}>{slot.client}</strong>
                    {slot.service && <span style={{ color: 'var(--color-neutral-600)', fontSize: '13px' }}>{slot.service}</span>}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
