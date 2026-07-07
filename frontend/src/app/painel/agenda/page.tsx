'use client';
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { format, addDays, subDays, isSameDay, startOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useUIStore } from '@/stores/ui.store';
import { api } from '@/lib/api';
import { MiniCalendar } from '@/components/ui/MiniCalendar';
import { useAuthStore } from '@/stores/auth.store';

export default function AgendaPage() {
  const { user } = useAuthStore();
  const professionalId = (user as any)?.professionalProfile?.id;
  const [currentDate, setCurrentDate] = useState(startOfDay(new Date()));
  const [appointments, setAppointments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addToast } = useUIStore();
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [services, setServices] = useState<any[]>([]);
  const [modalTime, setModalTime] = useState<string>('09:00');
  const [modalClientName, setModalClientName] = useState('');
  const [modalServiceId, setModalServiceId] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const formattedDate = format(currentDate, "EEEE, d 'de' MMMM", { locale: ptBR });

  useEffect(() => {
    fetchAppointments();
  }, [currentDate]);

  const fetchAppointments = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/appointments/me');
      setAppointments(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await api.get('/professionals/services');
      setServices(response.data);
      if (response.data.length > 0) {
        setModalServiceId(response.data[0].id);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpenModal = (time?: string) => {
    if (time) setModalTime(time);
    fetchServices();
    setIsModalOpen(true);
  };

  const handleSaveAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!professionalId || !modalServiceId || !modalClientName || !modalTime) {
      return addToast({ type: 'error', title: 'Erro', message: 'Preencha todos os campos obrigatórios.' });
    }
    
    setIsSaving(true);
    try {
      const dateStr = format(currentDate, 'yyyy-MM-dd');
      const dateTime = `${dateStr}T${modalTime}:00`;
      
      await api.post('/appointments', {
        professionalId,
        serviceId: modalServiceId,
        dateTime,
        clientName: modalClientName
      });
      
      addToast({ type: 'success', title: 'Sucesso', message: 'Agendamento criado!' });
      setIsModalOpen(false);
      setModalClientName('');
      fetchAppointments();
    } catch (error: any) {
      addToast({ type: 'error', title: 'Erro', message: error.response?.data?.error || 'Falha ao criar agendamento' });
    } finally {
      setIsSaving(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await api.put(`/appointments/${id}/status`, { status });
      addToast({ type: 'success', title: 'Sucesso', message: 'Status atualizado!' });
      fetchAppointments();
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
          client: appt.client?.user?.name || appt.clientName || 'Manual',
          service: appt.service?.name,
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
      const dateStr = format(currentDate, 'yyyy-MM-dd');
      const response = await api.get(`/appointments/waitlist?date=${dateStr}`);
      setWaitlist(response.data);
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
          <Button variant="primary" leftIcon={<Plus size={18} />} onClick={() => handleOpenModal()}>Novo</Button>
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
                    onClick={() => handleOpenModal(slot.time)}
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

      {/* Waitlist & Calendar Panel */}
      <div style={{ width: '300px', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
        <MiniCalendar value={currentDate} onChange={setCurrentDate} />
        
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
    
      {/* NOVO AGENDAMENTO MODAL */}
      {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex',
          alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)'
        }}>
          <div style={{
            backgroundColor: 'var(--surface-card)', padding: '32px', borderRadius: '16px',
            width: '90%', maxWidth: '400px', position: 'relative', boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
          }}>
            <button onClick={() => setIsModalOpen(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: 'var(--color-neutral-400)' }}>&times;</button>
            <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '24px', color: 'var(--color-neutral-900)' }}>Novo Agendamento</h2>
            <form onSubmit={handleSaveAppointment} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500, color: 'var(--color-neutral-700)' }}>Nome do Cliente</label>
                <input 
                  type="text" 
                  value={modalClientName}
                  onChange={e => setModalClientName(e.target.value)}
                  placeholder="Ex: Maria Silva"
                  required
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--surface-border)', outline: 'none' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500, color: 'var(--color-neutral-700)' }}>Serviço</label>
                <select 
                  value={modalServiceId}
                  onChange={e => setModalServiceId(e.target.value)}
                  required
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--surface-border)', outline: 'none', backgroundColor: 'var(--surface-main)' }}
                >
                  {services.length === 0 && <option value="">Sem serviços cadastrados</option>}
                  {services.map(s => <option key={s.id} value={s.id}>{s.name} - R$ {s.price}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500, color: 'var(--color-neutral-700)' }}>Data</label>
                  <input type="text" value={format(currentDate, 'dd/MM/yyyy')} disabled style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--surface-border)', backgroundColor: 'var(--surface-main)', color: 'var(--color-neutral-500)' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500, color: 'var(--color-neutral-700)' }}>Horário</label>
                  <input type="time" value={modalTime} onChange={e => setModalTime(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--surface-border)' }} />
                </div>
              </div>
              
              <Button type="submit" variant="primary" style={{ marginTop: '16px' }} isLoading={isSaving}>Salvar Agendamento</Button>
            </form>
          </div>
        </div>
      )}
    </div>
}
