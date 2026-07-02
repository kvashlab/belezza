'use client';
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { format, addDays, subDays, isSameDay, startOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useUIStore } from '@/stores/ui.store';

export default function AgendaPage() {
  const [currentDate, setCurrentDate] = useState(startOfDay(new Date()));
  const [appointments, setAppointments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addToast } = useUIStore();

  const formattedDate = format(currentDate, "EEEE, d 'de' MMMM", { locale: ptBR });

  useEffect(() => {
    fetchAppointments();
  }, [currentDate]);

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

  // Build schedule list for the current date
  const generateSchedule = () => {
    const slots = [];
    // From 08:00 to 20:00
    for (let hour = 8; hour <= 20; hour++) {
      const timeString = `${hour.toString().padStart(2, '0')}:00`;
      
      // Find appointment in this slot
      const appt = appointments.find(a => {
        const aDate = new Date(a.date);
        return isSameDay(aDate, currentDate) && aDate.getHours() === hour;
      });

      if (appt) {
        slots.push({
          time: timeString,
          status: 'busy',
          client: appt.client.user.name,
          service: appt.service.name,
          type: appt.status.toLowerCase(), // pending, confirmed, cancelled, completed
          id: appt.id
        });
      } else {
        slots.push({ time: timeString, status: 'available', client: null, service: null, type: null, id: null });
      }
    }
    return slots;
  };

  const schedule = generateSchedule();

  const [waitlist, setWaitlist] = useState<any[]>([]);

  useEffect(() => {
    fetchWaitlist();
  }, [currentDate]);

  const fetchWaitlist = async () => {
    try {
      const token = localStorage.getItem('@belezza:token');
      const dateStr = format(currentDate, 'yyyy-MM-dd');
      const res = await fetch(`http://localhost:3333/api/appointments/waitlist?date=${dateStr}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setWaitlist(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ display: 'flex', gap: 'var(--spacing-6)' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--spacing-4)' }}>
        <div>
          <h1 className="heading-2" style={{ color: 'var(--color-neutral-900)' }}>Minha Agenda</h1>
          <p className="body-text" style={{ color: 'var(--color-neutral-500)', textTransform: 'capitalize' }}>
            {formattedDate}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--spacing-3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', backgroundColor: 'var(--surface-card)', border: '1px solid var(--surface-border)', borderRadius: 'var(--radius-md)', padding: 'var(--spacing-1)' }}>
            <button onClick={() => setCurrentDate(d => subDays(d, 1))} style={{ padding: 'var(--spacing-2)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', background: 'none', border: 'none' }}><ChevronLeft size={20} /></button>
            <span style={{ padding: '0 var(--spacing-4)', fontWeight: 500, fontSize: '14px' }}>
              {isSameDay(currentDate, new Date()) ? 'Hoje' : format(currentDate, 'dd/MM')}
            </span>
            <button onClick={() => setCurrentDate(d => addDays(d, 1))} style={{ padding: 'var(--spacing-2)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', background: 'none', border: 'none' }}><ChevronRight size={20} /></button>
          </div>
          <Button variant="primary" leftIcon={<Plus size={18} />}>Novo</Button>
        </div>
      </div>
      
      <div style={{ backgroundColor: 'var(--surface-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--surface-border)', overflow: 'hidden' }}>
        <div style={{ display: 'flex', borderBottom: '1px solid var(--surface-border)', padding: 'var(--spacing-4) var(--spacing-6)', backgroundColor: 'var(--surface-main)' }}>
          <div style={{ width: '80px', fontWeight: 600, color: 'var(--color-neutral-500)', fontSize: '14px' }}>Horário</div>
          <div style={{ flex: 1, fontWeight: 600, color: 'var(--color-neutral-500)', fontSize: '14px' }}>Agendamento</div>
        </div>

        {isLoading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-neutral-500)' }}>Carregando agenda...</div>
        ) : (
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
                      backgroundColor: slot.type === 'confirmed' ? 'var(--color-primary-50)' : slot.type === 'pending' ? 'rgba(224, 160, 46, 0.1)' : slot.type === 'cancelled' ? 'var(--color-danger-50)' : 'var(--color-success-50)',
                      borderLeft: `4px solid ${slot.type === 'confirmed' ? 'var(--color-primary-500)' : slot.type === 'pending' ? 'var(--color-warning)' : slot.type === 'cancelled' ? 'var(--color-danger-500)' : 'var(--color-success-500)'}`,
                      borderRadius: '4px',
                      padding: 'var(--spacing-3) var(--spacing-4)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <strong style={{ color: 'var(--color-neutral-900)', fontSize: '15px', textDecoration: slot.type === 'cancelled' ? 'line-through' : 'none' }}>{slot.client}</strong>
                        {slot.service && <span style={{ color: 'var(--color-neutral-600)', fontSize: '13px' }}>{slot.service}</span>}
                      </div>
                      
                      {slot.type === 'pending' && (
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <Button size="sm" variant="secondary" onClick={() => updateStatus(slot.id, 'CANCELLED')} leftIcon={<XCircle size={16} />}>Cancelar</Button>
                          <Button size="sm" onClick={() => updateStatus(slot.id, 'CONFIRMED')} leftIcon={<CheckCircle size={16} />}>Confirmar</Button>
                        </div>
                      )}
                      {slot.type === 'confirmed' && (
                        <Button size="sm" variant="secondary" onClick={() => updateStatus(slot.id, 'COMPLETED')} leftIcon={<CheckCircle size={16} />}>Concluir</Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      </div>

      {/* Waitlist Panel */}
      <div style={{ width: '300px', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
        <div style={{ backgroundColor: 'var(--surface-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--surface-border)', padding: 'var(--spacing-4)' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: 'var(--spacing-4)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            Fila de Espera 
            <span style={{ backgroundColor: 'var(--color-primary-100)', color: 'var(--color-primary-700)', padding: '2px 8px', borderRadius: '12px', fontSize: '12px' }}>
              {waitlist.length}
            </span>
          </h3>
          
          {waitlist.length === 0 ? (
            <p style={{ color: 'var(--color-neutral-500)', fontSize: '14px', textAlign: 'center', padding: 'var(--spacing-4) 0' }}>
              Nenhum cliente na fila para este dia.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
              {waitlist.map(w => (
                <div key={w.id} style={{ padding: 'var(--spacing-3)', border: '1px solid var(--surface-border)', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <strong style={{ fontSize: '14px', color: 'var(--color-neutral-900)' }}>{w.client.user.name}</strong>
                  <span style={{ fontSize: '12px', color: 'var(--color-neutral-500)' }}>{w.client.user.phone || 'Sem telefone'}</span>
                  <Button size="sm" variant="secondary" style={{ marginTop: '8px' }}>Avisar Vaga</Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
