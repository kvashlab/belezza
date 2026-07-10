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
  const [customSlots, setCustomSlots] = useState<any[]>([]);
  const [showAllHours, setShowAllHours] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { addToast } = useUIStore();
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [services, setServices] = useState<any[]>([]);
  const [modalTime, setModalTime] = useState<string>('09:00');
  const [modalClientName, setModalClientName] = useState('');
  const [modalServiceId, setModalServiceId] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveAsClient, setSaveAsClient] = useState(false);
  const [clientsList, setClientsList] = useState<any[]>([]);
  const [modalTab, setModalTab] = useState<'appointment' | 'custom'>('appointment');
  const [customPermanent, setCustomPermanent] = useState(false);

  const formattedDate = format(currentDate, "EEEE, d 'de' MMMM", { locale: ptBR });

  useEffect(() => {
    fetchAppointments();
    fetchClients();
    fetchCustomSlots();
  }, [currentDate]);

  const fetchClients = async () => {
    try {
      const response = await api.get('/professionals/clients');
      setClientsList(response.data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchCustomSlots = async () => {
    try {
      const response = await api.get('/professionals/custom-slots');
      setCustomSlots(response.data);
    } catch (e) {
      console.error(e);
    }
  };

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
    
    if (!professionalId) {
      return addToast({ 
        type: 'error', 
        title: 'Erro', 
        message: 'Perfil profissional não carregado. Recarregue a página e tente novamente.' 
      });
    }
    if (!modalServiceId || !modalClientName || !modalTime) {
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

      if (saveAsClient) {
        try {
          await api.post('/professionals/customers', { name: modalClientName });
          fetchClients();
        } catch (e) {
          console.error("Falha ao salvar cliente", e);
        }
      }
      
      addToast({ type: 'success', title: 'Sucesso', message: 'Agendamento criado!' });
      setIsModalOpen(false);
      setModalClientName('');
      setSaveAsClient(false);
      fetchAppointments();
    } catch (error: any) {
      addToast({ type: 'error', title: 'Erro', message: error.response?.data?.error || 'Falha ao criar agendamento' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveCustomSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalTime) return addToast({ type: 'error', title: 'Erro', message: 'Preencha o horário.' });
    setIsSaving(true);
    try {
      const dateStr = customPermanent ? undefined : format(currentDate, 'yyyy-MM-dd');
      await api.post('/professionals/custom-slots', { time: modalTime, date: dateStr });
      addToast({ type: 'success', title: 'Sucesso', message: 'Horário personalizado criado!' });
      setIsModalOpen(false);
      fetchCustomSlots();
    } catch (error: any) {
      addToast({ type: 'error', title: 'Erro', message: error.response?.data?.error || 'Falha ao criar horário' });
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
    const now = new Date();
    const isToday = isSameDay(currentDate, now);
    
    // Build set of times
    const times = new Set<string>();
    
    // Add 30min grid
    for (let hour = 8; hour <= 20; hour++) {
      times.add(`${hour.toString().padStart(2, '0')}:00`);
      if (hour !== 20) {
        times.add(`${hour.toString().padStart(2, '0')}:30`);
      }
    }

    // Add custom slots that apply today
    customSlots.forEach(cs => {
      if (!cs.date || isSameDay(new Date(cs.date), currentDate)) {
        times.add(cs.time);
      }
    });

    // Add appointment times that might be off-grid
    appointments.forEach(appt => {
      const aDate = new Date(appt.date);
      if (isSameDay(aDate, currentDate)) {
        const timeStr = format(aDate, 'HH:mm');
        times.add(timeStr);
      }
    });

    const sortedTimes = Array.from(times).sort();

    let nextAvailableFound = false;

    for (const timeString of sortedTimes) {
      // Find appointment in this slot
      const appt = appointments.find(a => {
        const aDate = new Date(a.date);
        return isSameDay(aDate, currentDate) && format(aDate, 'HH:mm') === timeString;
      });

      const [hh, mm] = timeString.split(':').map(Number);
      const slotDate = new Date(currentDate);
      slotDate.setHours(hh, mm, 0, 0);
      
      const isPast = slotDate < now;
      
      let isOngoing = false;
      if (appt && isToday && slotDate <= now) {
         const endSlotDate = new Date(slotDate.getTime() + ((appt.service?.duration || 30) * 60000));
         if (endSlotDate > now) {
            isOngoing = true;
         }
      }

      if (appt) {
        slots.push({
          time: timeString,
          status: 'busy',
          client: appt.client?.user?.name || appt.clientName || 'Manual',
          service: appt.service?.name,
          type: appt.status.toLowerCase(), // pending, confirmed, cancelled, completed
          id: appt.id,
          isPast: !isOngoing && isPast,
          isOngoing
        });
      } else {
        let isNextAvailable = false;
        if (isToday && !isPast && !nextAvailableFound) {
          isNextAvailable = true;
          nextAvailableFound = true;
        }
        slots.push({ 
           time: timeString, 
           status: isPast ? 'past' : 'available', 
           client: null, 
           service: null, 
           type: null, 
           id: null, 
           isPast, 
           isNextAvailable 
        });
      }
    }
    return slots;
  };

  const schedule = generateSchedule();
  const visibleSchedule = showAllHours ? schedule : schedule.filter(s => !s.isPast || s.status === 'busy' || s.isOngoing);

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
    <>
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
            {visibleSchedule.map((slot, i) => (
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
                  color: slot.isOngoing ? 'var(--color-primary-600)' : (slot.isPast ? 'var(--color-neutral-400)' : 'var(--color-neutral-700)'),
                  fontWeight: slot.isOngoing ? 700 : 500,
                  backgroundColor: slot.isOngoing ? 'var(--color-primary-50)' : 'transparent'
                }}>
                  {slot.time}
                  {slot.isOngoing && <span style={{ fontSize: '10px', color: 'var(--color-primary-500)', marginTop: '4px' }}>Agora</span>}
                </div>
                <div style={{ flex: 1, padding: 'var(--spacing-3)' }}>
                  {slot.status === 'available' ? (
                    <div style={{ 
                      height: '100%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      color: slot.isNextAvailable ? 'var(--color-primary-600)' : 'var(--color-neutral-400)',
                      backgroundColor: slot.isNextAvailable ? 'rgba(var(--color-primary-50-rgb), 0.5)' : 'transparent',
                      fontSize: '14px',
                      fontWeight: slot.isNextAvailable ? 500 : 400,
                      cursor: 'pointer',
                      padding: '0 var(--spacing-3)',
                      borderRadius: 'var(--radius-md)',
                      border: slot.isNextAvailable ? '1px dashed var(--color-primary-300)' : '1px dashed transparent',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--color-primary-400)'; e.currentTarget.style.color = 'var(--color-primary-700)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = slot.isNextAvailable ? 'var(--color-primary-300)' : 'transparent'; e.currentTarget.style.color = slot.isNextAvailable ? 'var(--color-primary-600)' : 'var(--color-neutral-400)'; }}
                    onClick={() => handleOpenModal(slot.time)}
                    >
                      {slot.isNextAvailable ? '+ Agendar Próximo Horário' : '+ Adicionar agendamento'}
                    </div>
                  ) : slot.status === 'past' ? (
                    <div style={{ 
                      height: '100%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      color: 'var(--color-neutral-300)',
                      fontSize: '14px',
                      padding: '0 var(--spacing-3)',
                    }}>
                      Horário Indisponível
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
                      alignItems: 'center',
                      opacity: (slot.isPast && !slot.isOngoing) ? 0.6 : 1
                    }}>
                      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <strong style={{ color: 'var(--color-neutral-900)', fontSize: '15px', textDecoration: slot.type === 'cancelled' ? 'line-through' : 'none' }}>{slot.client}</strong>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {slot.service && <span style={{ color: 'var(--color-neutral-600)', fontSize: '13px' }}>{slot.service}</span>}
                          {slot.type === 'completed' && <span style={{ backgroundColor: 'var(--color-success-100)', color: 'var(--color-success-700)', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>Concluído</span>}
                          {slot.type === 'cancelled' && <span style={{ backgroundColor: 'var(--color-danger-100)', color: 'var(--color-danger-700)', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>Cancelado</span>}
                        </div>
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
            
            {schedule.some(s => s.isPast && s.status !== 'busy' && !s.isOngoing) && (
              <div style={{ padding: 'var(--spacing-4)', textAlign: 'center' }}>
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => setShowAllHours(!showAllHours)}
                >
                  {showAllHours ? 'Ocultar horários passados' : 'Ver todos os horários'}
                </Button>
              </div>
            )}
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
                  <Button 
                    size="sm" 
                    variant="secondary" 
                    style={{ marginTop: '8px' }}
                    onClick={() => {
                      const phone = w.client.user.phone;
                      if (phone) {
                        const cleanPhone = phone.replace(/\D/g, '');
                        const msg = encodeURIComponent(`Olá ${w.client.user.name}! Um horário abriu na sua agenda. Deseja agendar?`);
                        window.open(`https://wa.me/55${cleanPhone}?text=${msg}`, '_blank');
                      } else {
                        addToast({ type: 'error', title: 'Sem telefone', message: 'Este cliente não tem telefone cadastrado.' });
                      }
                    }}
                  >Avisar Vaga</Button>
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
            backgroundColor: 'var(--surface-card)', padding: '0', borderRadius: '16px',
            width: '90%', maxWidth: '400px', position: 'relative', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', overflow: 'hidden'
          }}>
            <div style={{ display: 'flex', borderBottom: '1px solid var(--surface-border)' }}>
               <button 
                  onClick={() => setModalTab('appointment')} 
                  style={{ flex: 1, padding: '16px', background: modalTab === 'appointment' ? 'var(--surface-main)' : 'transparent', border: 'none', borderBottom: modalTab === 'appointment' ? '2px solid var(--color-primary-500)' : '2px solid transparent', fontWeight: 600, color: modalTab === 'appointment' ? 'var(--color-primary-700)' : 'var(--color-neutral-500)', cursor: 'pointer' }}
               >Agendamento</button>
               <button 
                  onClick={() => setModalTab('custom')} 
                  style={{ flex: 1, padding: '16px', background: modalTab === 'custom' ? 'var(--surface-main)' : 'transparent', border: 'none', borderBottom: modalTab === 'custom' ? '2px solid var(--color-primary-500)' : '2px solid transparent', fontWeight: 600, color: modalTab === 'custom' ? 'var(--color-primary-700)' : 'var(--color-neutral-500)', cursor: 'pointer' }}
               >Horário Extra</button>
            </div>
            
            <button onClick={() => setIsModalOpen(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: 'var(--color-neutral-400)' }}>&times;</button>
            
            <div style={{ padding: '24px' }}>
            {modalTab === 'appointment' ? (
            <form onSubmit={handleSaveAppointment} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500, color: 'var(--color-neutral-700)' }}>Nome do Cliente</label>
                <input 
                  type="text" 
                  list="clients-list"
                  value={modalClientName}
                  onChange={e => setModalClientName(e.target.value)}
                  placeholder="Ex: Maria Silva"
                  required
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--surface-border)', outline: 'none' }}
                />
                <datalist id="clients-list">
                  {clientsList.map((c, i) => (
                    <option key={c.id || i} value={c.name} />
                  ))}
                </datalist>

                <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input 
                    type="checkbox" 
                    id="saveAsClient"
                    checked={saveAsClient}
                    onChange={(e) => setSaveAsClient(e.target.checked)}
                    style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                  />
                  <label htmlFor="saveAsClient" style={{ fontSize: '13px', color: 'var(--color-neutral-600)', cursor: 'pointer' }}>
                    Salvar na minha lista de clientes
                  </label>
                </div>
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
            ) : (
            <form onSubmit={handleSaveCustomSlot} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <p style={{ fontSize: '13px', color: 'var(--color-neutral-500)', marginBottom: '8px' }}>
                Crie um horário quebrado (ex: 09:15) ou um horário fora da sua grade padrão para atender uma exceção.
              </p>
              
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500, color: 'var(--color-neutral-700)' }}>Data Base</label>
                  <input type="text" value={format(currentDate, 'dd/MM/yyyy')} disabled style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--surface-border)', backgroundColor: 'var(--surface-main)', color: 'var(--color-neutral-500)' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500, color: 'var(--color-neutral-700)' }}>Horário Específico</label>
                  <input type="time" value={modalTime} onChange={e => setModalTime(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--surface-border)' }} />
                </div>
              </div>
              
              <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input 
                  type="checkbox" 
                  id="customPermanent"
                  checked={customPermanent}
                  onChange={(e) => setCustomPermanent(e.target.checked)}
                  style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: 'var(--color-primary-600)' }}
                />
                <label htmlFor="customPermanent" style={{ fontSize: '13px', color: 'var(--color-neutral-700)', cursor: 'pointer' }}>
                  <strong style={{ display: 'block' }}>Tornar Permanente</strong>
                  <span style={{ color: 'var(--color-neutral-500)' }}>Aplicar esse horário para todos os dias disponíveis.</span>
                </label>
              </div>

              <Button type="submit" variant="primary" style={{ marginTop: '16px' }} isLoading={isSaving}>Criar Horário Extra</Button>
            </form>
            )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
