'use client';
import React, { useEffect } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useBookingStore } from '@/stores/booking.store';
import { professionalsMock } from '@/mocks/professionals.mock';
import { servicesMock } from '@/mocks/services.mock';
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
  
  const { 
    professional, setProfessional, 
    step, nextStep, previousStep,
    selectedServices, addService, removeService,
    selectedDate, selectedTime, setDateTime,
    reset 
  } = useBookingStore();
  
  const { addToast } = useUIStore();

  useEffect(() => {
    const prof = professionalsMock.find(p => p.username === username);
    if (prof) setProfessional(prof);
    return () => reset(); // Cleanup on unmount
  }, [username, setProfessional, reset]);

  if (!professional) return <div className={styles.loading}>Carregando...</div>;

  const profServices = servicesMock.filter(s => s.professionalId === professional.id);
  const totalDuration = selectedServices.reduce((acc, curr) => acc + curr.duration, 0);
  const totalPrice = selectedServices.reduce((acc, curr) => acc + curr.price, 0);

  const steps = [
    { id: 'servicos', label: 'Serviços' },
    { id: 'data-hora', label: 'Data e Hora' },
    { id: 'dados', label: 'Seus Dados' },
    { id: 'confirmacao', label: 'Confirmação' }
  ];

  const handleNext = () => {
    if (step === 'servicos' && selectedServices.length === 0) {
      addToast({ type: 'error', title: 'Atenção', message: 'Selecione pelo menos um serviço.' });
      return;
    }
    if (step === 'data-hora' && (!selectedDate || !selectedTime)) {
      addToast({ type: 'error', title: 'Atenção', message: 'Selecione a data e o horário.' });
      return;
    }
    if (step === 'confirmacao') {
      addToast({ type: 'success', title: 'Sucesso!', message: 'Seu agendamento foi confirmado.' });
      router.push('/meus-agendamentos');
      return;
    }
    nextStep();
  };

  const renderServicos = () => (
    <div className={styles.stepContent}>
      <h2 className={styles.stepTitle}>Selecione os serviços</h2>
      <div className={styles.servicesList}>
        {profServices.map(service => {
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
      </div>
    </div>
  );

  const renderDataHora = () => {
    // Simulando horários disponíveis para o dia de hoje e amanhã
    const times = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];
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
            <div className={styles.timeGrid}>
              {times.map(time => (
                <button
                  key={time}
                  className={`${styles.timeSlot} ${selectedTime === time ? styles.timeSelected : ''}`}
                  onClick={() => setDateTime(selectedDate, time)}
                >
                  {time}
                </button>
              ))}
            </div>
            
            <div style={{ marginTop: 'var(--spacing-6)', padding: 'var(--spacing-4)', backgroundColor: 'var(--color-primary-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-primary-100)' }}>
              <h4 style={{ color: 'var(--color-primary-700)', marginBottom: 'var(--spacing-2)', fontSize: '14px' }}>Não encontrou o horário ideal?</h4>
              <p style={{ color: 'var(--color-neutral-700)', fontSize: '13px', marginBottom: 'var(--spacing-3)' }}>
                Entre na fila de espera e seja avisado caso haja alguma desistência neste dia.
              </p>
              <Button size="sm" variant="secondary" onClick={() => {
                addToast({ type: 'success', title: 'Fila de Espera', message: 'Você entrou na fila de espera para este dia!' });
              }}>Entrar na fila de espera</Button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderDados = () => (
    <div className={styles.stepContent}>
      <h2 className={styles.stepTitle}>Seus Dados</h2>
      <div className={styles.formGrid}>
        <Input label="Nome completo" placeholder="Ex: Maria Silva" />
        <Input label="Telefone / WhatsApp" placeholder="(11) 99999-9999" />
        <Input label="E-mail" type="email" placeholder="maria@exemplo.com" />
        <Select 
          label="Forma de pagamento" 
          options={[
            { value: 'pix', label: 'Pix no local' },
            { value: 'cartao', label: 'Cartão de Crédito/Débito' },
            { value: 'dinheiro', label: 'Dinheiro' }
          ]}
        />
        <Textarea label="Observações (opcional)" placeholder="Alguma observação para a profissional?" />
      </div>
    </div>
  );

  const renderConfirmacao = () => (
    <div className={styles.stepContent}>
      <h2 className={styles.stepTitle}>Resumo do Agendamento</h2>
      <div className={styles.summaryCard}>
        <div className={styles.summaryItem}>
          <span>Profissional:</span>
          <strong>{professional.name}</strong>
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
            {step === 'data-hora' && renderDataHora()}
            {step === 'dados' && renderDados()}
            {step === 'confirmacao' && renderConfirmacao()}
          </div>
        </div>

        {/* Resumo fixo na lateral para desktop */}
        <div className={styles.sideCol}>
          <div className={styles.stickySummary}>
            <h3>Seu Agendamento</h3>
            <div className={styles.profSummary}>
              <div style={{ position: 'relative', width: '48px', height: '48px', borderRadius: '50%', overflow: 'hidden' }}>
                <Image src={professional.avatar} alt={professional.name} fill style={{ objectFit: 'cover' }} unoptimized />
              </div>
              <div>
                <strong>{professional.name}</strong>
                <p>@{professional.username}</p>
              </div>
            </div>
            
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
          <Button variant="ghost" onClick={step === 'servicos' ? () => router.back() : previousStep}>
            {step === 'servicos' ? 'Cancelar' : 'Voltar'}
          </Button>
          
          <div className={styles.footerTotal}>
            <span>Total: <strong>R$ {totalPrice.toFixed(2)}</strong></span>
            <Button variant="primary" onClick={handleNext}>
              {step === 'confirmacao' ? 'Confirmar Agendamento' : 'Avançar'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
