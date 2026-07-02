'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useBookingStore } from '@/stores/booking.store';
import { useAuthStore } from '@/stores/auth.store';
import { Stepper } from '@/components/ui/Stepper';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { useUIStore } from '@/stores/ui.store';
import styles from './styles.module.css';

export default function AgendarFlow() {
  const params = useParams();
  const router = useRouter();
  const username = (params.username as string).replace('%40', '').replace('@', '');
  
  const { user, role } = useAuthStore();
  const { 
    setProfessional, 
    step, setStep,
    selectedServices, addService, removeService,
    selectedTeamMember, setTeamMember,
    selectedDate, selectedTime, setDateTime,
    reset 
  } = useBookingStore();
  
  const { addToast } = useUIStore();
  
  const [profData, setProfData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    async function loadProf() {
      try {
        const res = await fetch(`http://localhost:3333/api/professionals/public/${username}`);
        if (res.ok) {
          const data = await res.json();
          setProfData(data);
          setProfessional({
            id: data.id,
            name: data.user?.name || data.businessName,
            username: data.username,
            avatar: data.avatar,
            rating: data.rating
          } as any);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    loadProf();
    return () => reset();
  }, [username, setProfessional, reset]);

  // Fetch slots whenever date or selected service changes
  useEffect(() => {
    async function fetchSlots() {
      if (!selectedDate || selectedServices.length === 0 || !profData) return;
      setIsLoadingSlots(true);
      try {
        // We fetch slots based on the first selected service duration
        const serviceId = selectedServices[0].id;
        const teamMemberParam = selectedTeamMember ? `&teamMemberId=${selectedTeamMember.id}` : '';
        const res = await fetch(`http://localhost:3333/api/appointments/slots?professionalId=${profData.id}&serviceId=${serviceId}&date=${selectedDate}${teamMemberParam}`);
        if (res.ok) {
          const data = await res.json();
          setAvailableSlots(data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoadingSlots(false);
      }
    }
    fetchSlots();
  }, [selectedDate, selectedServices, profData]);

  if (isLoading || !profData) return <div className={styles.loading}>Carregando...</div>;

  const profServices = profData.services || [];
  const totalDuration = selectedServices.reduce((acc, curr) => acc + curr.duration, 0);
  const totalPrice = selectedServices.reduce((acc, curr) => acc + curr.price, 0);

    const hasTeam = profData.teamMembers && profData.teamMembers.length > 0;
    
    const steps = [
      { id: 'servicos', label: 'Serviços' },
      ...(hasTeam ? [{ id: 'equipe', label: 'Equipe' }] : []),
      { id: 'data-hora', label: 'Data/Hora' },
      { id: 'dados', label: 'Seus Dados' },
      ...(profData.requireDeposit ? [{ id: 'pagamento', label: 'Sinal' }] : []),
      { id: 'confirmacao', label: 'Confirmação' }
    ] as any;
  
    const handleNextStepLocal = () => {
      const currentIndex = steps.findIndex((s: any) => s.id === step);
      if (currentIndex < steps.length - 1) {
        setStep(steps[currentIndex + 1].id);
      }
    };

    const handlePrevStepLocal = () => {
      const currentIndex = steps.findIndex((s: any) => s.id === step);
      if (currentIndex > 0) {
        setStep(steps[currentIndex - 1].id);
      }
    };

    const handleNext = async () => {
      if (step === 'servicos' && selectedServices.length === 0) {
        addToast({ type: 'error', title: 'Atenção', message: 'Selecione pelo menos um serviço.' });
        return;
      }
      if (step === 'equipe' && !selectedTeamMember) {
        addToast({ type: 'error', title: 'Atenção', message: 'Selecione um profissional para o atendimento.' });
        return;
      }
      if (step === 'data-hora' && (!selectedDate || !selectedTime)) {
        addToast({ type: 'error', title: 'Atenção', message: 'Selecione a data e o horário.' });
        return;
      }
      if (step === 'dados') {
        if (!user || role !== 'client') {
           addToast({ type: 'error', title: 'Login necessário', message: 'Por favor, faça login como cliente para agendar.' });
           router.push('/login');
           return;
        }
      }
      if (step === 'confirmacao') {
        await submitAppointment();
        return;
      }
      handleNextStepLocal();
    };

    const handleJoinWaitlist = async () => {
      try {
        const token = localStorage.getItem('@belezza:token');
        const res = await fetch('http://localhost:3333/api/appointments/waitlist', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}` 
          },
          body: JSON.stringify({
            professionalId: profData.id,
            date: selectedDate
          })
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || 'Erro ao entrar na fila');
        }
        addToast({ type: 'success', title: 'Fila de Espera', message: 'Você entrou na fila de espera para este dia!' });
      } catch (e: any) {
        addToast({ type: 'error', title: 'Erro', message: e.message });
      }
    };
  
    const submitAppointment = async () => {
      setIsSubmitting(true);
      try {
        const token = localStorage.getItem('@belezza:token');
        const promises = selectedServices.map(service => {
          return fetch('http://localhost:3333/api/appointments', {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}` 
            },
            body: JSON.stringify({
              professionalId: profData.id,
              serviceId: service.id,
              teamMemberId: selectedTeamMember?.id,
              dateTime: `${selectedDate}T${selectedTime}:00.000Z`,
              notes
            })
          });
        });
  
        const responses = await Promise.all(promises);
        const allOk = responses.every(r => r.ok);
  
        if (!allOk) throw new Error('Erro ao confirmar agendamento');
  
        addToast({ type: 'success', title: 'Sucesso!', message: 'Seu agendamento foi confirmado.' });
        router.push('/dashboard'); 
      } catch {
        addToast({ type: 'error', title: 'Erro', message: 'Falha ao realizar agendamento. Tente novamente.' });
      } finally {
        setIsSubmitting(false);
      }
    };
  
    const renderServicos = () => (
      <div className={styles.stepContent}>
        <h2 className={styles.stepTitle}>Selecione os serviços</h2>
        <div className={styles.servicesList}>
          {profServices.map((service: any) => {
            const isSelected = selectedServices.some(s => s.id === service.id);
            return (
              <div 
                key={service.id} 
                className={`${styles.serviceCard} ${isSelected ? styles.selected : ''}`}
                onClick={() => isSelected ? removeService(service.id) : addService(service)}
              >
                <div className={styles.serviceInfo}>
                  <h4>{service.name}</h4>
                  <p>{service.duration} min</p>
                </div>
                <div className={styles.servicePrice}>
                  R$ {service.price.toFixed(2)}
                </div>
                <div className={styles.checkbox}>
                  {isSelected && '✓'}
                </div>
              </div>
            );
          })}
          {profServices.length === 0 && <p>Nenhum serviço disponível.</p>}
        </div>
      </div>
    );

  const renderEquipe = () => (
    <div className={styles.stepContent}>
      <h2 className={styles.stepTitle}>Com quem deseja agendar?</h2>
      <div className="grid grid-cols-1 gap-4 mt-6">
        <div 
          className={`${styles.serviceCard} ${!selectedTeamMember ? styles.selected : ''}`}
          onClick={() => setTeamMember(null)}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-700">Q</div>
            <div>
              <h4 className="font-semibold text-gray-900">Qualquer profissional</h4>
              <p className="text-sm text-gray-500">O primeiro disponível</p>
            </div>
          </div>
          <div className={styles.checkbox}>
            {!selectedTeamMember && '✓'}
          </div>
        </div>

        {profData.teamMembers.map((member: any) => {
          const isSelected = selectedTeamMember?.id === member.id;
          return (
            <div 
              key={member.id} 
              className={`${styles.serviceCard} ${isSelected ? styles.selected : ''}`}
              onClick={() => setTeamMember(member)}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-700 overflow-hidden relative">
                  {member.avatar ? <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" /> : member.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{member.name}</h4>
                  <p className="text-sm text-gray-500">{member.role}</p>
                </div>
              </div>
              <div className={styles.checkbox}>
                {isSelected && '✓'}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
  
    const renderDataHora = () => {
      const today = new Date().toISOString().split('T')[0];
      
      return (
        <div className={styles.stepContent}>
          <h2 className={styles.stepTitle}>Escolha a data e horário</h2>
          <div className={styles.datePicker}>
            <Input 
              type="date" 
              label="Data" 
              value={selectedDate || ''}
              onChange={(e) => setDateTime(e.target.value, '')}
              min={today}
            />
          </div>
          
          {selectedDate && (
            <div className={styles.timeSlots}>
              <h3 className={styles.timeTitle}>Horários disponíveis:</h3>
              {isLoadingSlots ? <p>Carregando horários...</p> : (
                <div className={styles.timeGrid}>
                  {availableSlots.map(time => (
                    <button
                      key={time}
                      className={`${styles.timeSlot} ${selectedTime === time ? styles.timeSelected : ''}`}
                      onClick={() => setDateTime(selectedDate, time)}
                    >
                      {time}
                    </button>
                  ))}
                  {availableSlots.length === 0 && <p style={{ gridColumn: '1 / -1', color: 'var(--gray-500)' }}>Nenhum horário disponível para esta data.</p>}
                </div>
              )}
              
              <div style={{ marginTop: 'var(--spacing-6)', padding: 'var(--spacing-4)', backgroundColor: 'var(--color-primary-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-primary-100)' }}>
                <h4 style={{ color: 'var(--color-primary-700)', marginBottom: 'var(--spacing-2)', fontSize: '14px' }}>Não encontrou o horário ideal?</h4>
                <p style={{ color: 'var(--color-neutral-700)', fontSize: '13px', marginBottom: 'var(--spacing-3)' }}>
                  Entre na fila de espera e seja avisado caso haja alguma desistência neste dia.
                </p>
                <Button size="sm" variant="secondary" onClick={handleJoinWaitlist}>Entrar na fila de espera</Button>
              </div>
            </div>
          )}
        </div>
      );
    };

  const renderDados = () => (
    <div className={styles.stepContent}>
      <h2 className={styles.stepTitle}>Seus Dados</h2>
      {!user || (user as any).role !== 'client' ? (
        <div style={{ padding: '24px', background: 'var(--color-danger-50)', color: 'var(--color-danger-700)', borderRadius: '8px' }}>
          Você precisa estar logado como Cliente para agendar!
          <Button style={{ marginTop: 16 }} onClick={() => router.push('/login')}>Ir para o Login</Button>
        </div>
      ) : (
        <div className={styles.formGrid}>
          <Input label="Nome completo" defaultValue={user?.name || ''} readOnly />
          <Input label="E-mail" type="email" defaultValue={(user as any)?.email || ''} readOnly />
          <Select 
            label="Forma de pagamento" 
            options={[
              { value: 'pix', label: 'Pix no local' },
              { value: 'cartao', label: 'Cartão de Crédito/Débito' },
              { value: 'dinheiro', label: 'Dinheiro' }
            ]}
          />
          <Textarea 
            label="Observações (opcional)" 
            placeholder="Alguma observação para a profissional?" 
            value={notes}
            onChange={e => setNotes(e.target.value)}
          />
        </div>
      )}
    </div>
  );

  const renderPagamento = () => {
    const downPayment = totalPrice * 0.3; // 30% sinal
    return (
      <div className={styles.stepContent}>
        <h2 className={styles.stepTitle}>Garantia de Agendamento (Sinal)</h2>
        <div style={{ backgroundColor: 'var(--color-primary-50)', padding: 'var(--spacing-4)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-primary-100)', marginBottom: 'var(--spacing-4)' }}>
          <p style={{ color: 'var(--color-primary-700)', fontSize: '14px', marginBottom: '8px' }}>
            Para confirmar seu horário, solicitamos um sinal de 30% do valor total. O restante será pago no local.
          </p>
          <strong style={{ fontSize: '24px', color: 'var(--color-neutral-900)' }}>R$ {downPayment.toFixed(2)}</strong>
        </div>

        <div style={{ padding: 'var(--spacing-6)', backgroundColor: 'var(--surface-card)', border: '1px solid var(--surface-border)', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
          <div style={{ width: '150px', height: '150px', backgroundColor: 'var(--color-neutral-100)', margin: '0 auto var(--spacing-4)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: 'var(--color-neutral-500)', fontSize: '12px' }}>QR Code Pix (Simulado)</span>
          </div>
          <p style={{ fontSize: '14px', color: 'var(--color-neutral-600)', marginBottom: '16px' }}>Escaneie o QR Code ou copie o código Pix abaixo:</p>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Input readOnly value="00020126580014br.gov.bcb.pix..." style={{ flex: 1 }} />
            <Button variant="secondary" onClick={() => addToast({ type: 'success', title: 'Copiado', message: 'Código Pix copiado!' })}>Copiar</Button>
          </div>
        </div>
      </div>
    );
  };

  const renderConfirmacao = () => (
    <div className={styles.stepContent}>
      <h2 className={styles.stepTitle}>Resumo do Agendamento</h2>
      <div className={styles.summaryCard}>
        <div className={styles.summaryItem}>
          <span>Profissional:</span>
          <strong>{profData.user?.name || profData.businessName}</strong>
        </div>
        <div className={styles.summaryItem}>
          <span>Data e Hora:</span>
          <strong>
            {selectedDate && format(new Date(`${selectedDate}T12:00:00`), "dd 'de' MMMM", { locale: ptBR })} às {selectedTime}
          </strong>
        </div>
        <div className={styles.summaryDivider} />
        <h4>Serviços ({selectedServices.length})</h4>
        {selectedServices.map(s => (
          <div key={s.id} className={styles.summaryService}>
            <span>{s.name} ({s.duration} min)</span>
            <span>R$ {s.price.toFixed(2)}</span>
          </div>
        ))}
        <div className={styles.summaryDivider} />
        <div className={styles.summaryTotal}>
          <span>Total:</span>
          <strong>R$ {totalPrice.toFixed(2)}</strong>
        </div>
      </div>
      
      <p className={styles.cancelPolicy}>
        <strong>Política de cancelamento:</strong> Cancelamentos gratuitos até 24h antes do atendimento.
      </p>
    </div>
  );

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.mainCol}>
          <Stepper steps={steps} currentStepId={step} />
          
          <div className={styles.card}>
            {step === 'servicos' && renderServicos()}
            {step === 'equipe' && renderEquipe()}
            {step === 'data-hora' && renderDataHora()}
            {step === 'dados' && renderDados()}
            {step === 'pagamento' && renderPagamento()}
            {step === 'confirmacao' && renderConfirmacao()}
          </div>
        </div>

        {/* Resumo fixo na lateral para desktop */}
        <div className={styles.sideCol}>
          <div className={styles.stickySummary}>
            <h3>Seu Agendamento</h3>
            <div className={styles.profSummary}>
              <div style={{ position: 'relative', width: '48px', height: '48px', borderRadius: '50%', overflow: 'hidden' }}>
                <Image src={profData.avatar || 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=2069'} alt={profData.username} fill style={{ objectFit: 'cover' }} unoptimized />
              </div>
              <div>
                <strong>{profData.user?.name || profData.businessName}</strong>
                <p>@{profData.username}</p>
              </div>
            </div>

            {selectedTeamMember && (
              <div style={{ marginTop: 12, padding: 12, backgroundColor: '#f9fafb', borderRadius: 8, fontSize: 14 }}>
                <span className="text-gray-500">Profissional:</span> <strong className="text-gray-900">{selectedTeamMember.name}</strong>
              </div>
            )}
            
            <div className={styles.miniSummaryDetails}>
              {selectedServices.length > 0 ? (
                <>
                  <p><strong>{selectedServices.length} serviço(s) selecionado(s)</strong></p>
                  <p>Duração total: {totalDuration} min</p>
                  <div className={styles.miniTotal}>
                    <span>Total:</span>
                    <span>R$ {totalPrice.toFixed(2)}</span>
                  </div>
                </>
              ) : (
                <p className={styles.emptyText}>Nenhum serviço selecionado ainda.</p>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer Fixo */}
      <div className={styles.footer}>
        <div className={styles.footerContainer}>
          <Button variant="ghost" onClick={step === 'servicos' ? () => router.back() : handlePrevStepLocal}>
            {step === 'servicos' ? 'Cancelar' : 'Voltar'}
          </Button>
          
          <div className={styles.footerTotal}>
            <span>Total: <strong>R$ {totalPrice.toFixed(2)}</strong></span>
            <Button variant="primary" onClick={handleNext} isLoading={isSubmitting}>
              {step === 'confirmacao' ? 'Confirmar Agendamento' : 'Avançar'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
