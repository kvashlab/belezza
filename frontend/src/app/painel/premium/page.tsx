'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, ArrowRight, ShieldCheck, CreditCard, Sparkles, Info, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/stores/auth.store';
import { useUIStore } from '@/stores/ui.store';
import { api } from '@/lib/api';

export default function PremiumCheckoutPage() {
  const router = useRouter();
  const { addToast } = useUIStore();
  const { fetchMe } = useAuthStore();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // API call to simulate checkout
      await api.post('/professionals/upgrade');
      await fetchMe(); // Refresh user data to get new plan status
      
      addToast({
        type: 'success',
        title: 'Bem-vindo ao Premium! 🎉',
        message: 'Seu plano foi atualizado com sucesso. Aproveite todos os recursos ilimitados!'
      });
      
      router.push('/painel');
    } catch (error: any) {
      addToast({
        type: 'error',
        title: 'Falha no pagamento',
        message: error.response?.data?.error || 'Não foi possível processar seu pagamento.'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-8)', maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-6)', padding: 'var(--spacing-8)', background: 'linear-gradient(135deg, var(--color-gold-50), transparent)', borderRadius: 'var(--radius-2xl)', border: '1px solid var(--color-gold-100)' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-gold-100)', padding: '8px 16px', borderRadius: '999px', marginBottom: '16px', color: 'var(--color-gold-700)', fontWeight: 600, fontSize: '14px', gap: '8px' }}>
          <Sparkles size={16} /> Eleve seu negócio
        </div>
        <h1 className="heading-1 title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', fontSize: '36px', marginBottom: '16px' }}>
          Plano Premium
        </h1>
        <p className="body-text" style={{ color: 'var(--color-neutral-600)', maxWidth: '600px', margin: '0 auto', fontSize: '18px' }}>
          A melhor experiência para você e seus clientes. Gestão completa, agendamentos ilimitados e destaque na plataforma.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 'var(--spacing-8)' }} className="md-grid-1">
        
        {/* BENEFITS SECTION */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
          <div style={{ backgroundColor: 'var(--surface-card)', padding: 'var(--spacing-6)', borderRadius: 'var(--radius-2xl)', border: '1px solid var(--color-gold-200)', boxShadow: '0 10px 30px -10px rgba(212, 175, 55, 0.2)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, var(--color-gold-400), var(--color-gold-600))' }} />
            <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: 'var(--spacing-4)', color: 'var(--color-neutral-900)' }}>Resumo da Assinatura</h2>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-6)', paddingBottom: 'var(--spacing-6)', borderBottom: '1px solid var(--surface-border)' }}>
              <div>
                <strong style={{ display: 'block', fontSize: '20px', color: 'var(--color-gold-600)' }}>Belezza Pro</strong>
                <span style={{ fontSize: '14px', color: 'var(--color-neutral-500)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                  <RefreshCw size={14} /> Renovação mensal automática
                </span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '28px', fontWeight: 700, color: 'var(--color-neutral-900)' }}>R$ 49,90</span>
                <span style={{ fontSize: '14px', color: 'var(--color-neutral-500)' }}>/mês</span>
              </div>
            </div>

            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: 'var(--spacing-4)' }}>O que está incluso:</h3>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)', listStyle: 'none', padding: 0 }}>
              {[
                'Agendamentos Ilimitados mensais',
                'Gestão de Equipe (até 10 membros)',
                'Fotos Ilimitadas no Portfólio',
                'Até 3 alterações de @username por mês',
                'Cobrança de sinais (Pagamento via App)',
                'Destaque nas buscas (Selo Pro)',
                'Relatórios Financeiros Avançados'
              ].map((benefit, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{ backgroundColor: 'var(--color-gold-50)', padding: '2px', borderRadius: '50%' }}>
                    <CheckCircle2 size={18} color="var(--color-gold-600)" style={{ flexShrink: 0 }} />
                  </div>
                  <span style={{ color: 'var(--color-neutral-700)', fontSize: '15px', lineHeight: '1.4' }}>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          <div style={{ backgroundColor: 'var(--color-primary-50)', padding: 'var(--spacing-4)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-primary-100)', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
             <Info size={24} color="var(--color-primary-600)" style={{ flexShrink: 0, marginTop: '2px' }} />
             <div>
               <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-primary-800)', marginBottom: '4px' }}>Importante sobre a assinatura</h4>
               <p style={{ fontSize: '13px', color: 'var(--color-primary-700)', lineHeight: '1.5' }}>
                 Sua assinatura será renovada automaticamente todo mês. Caso o pagamento falhe em alguma tentativa de renovação, seu acesso aos recursos premium será suspenso e você retornará automaticamente ao plano básico, sem gerar dívidas adicionais.
               </p>
             </div>
          </div>
        </div>

        {/* PAYMENT SECTION */}
        <div style={{ backgroundColor: 'var(--surface-card)', padding: 'var(--spacing-8)', borderRadius: 'var(--radius-2xl)', border: '1px solid var(--surface-border)', boxShadow: 'var(--shadow-lg)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: 'var(--spacing-6)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ backgroundColor: 'var(--color-neutral-100)', padding: '8px', borderRadius: '8px' }}>
                <CreditCard size={20} color="var(--color-neutral-700)" />
              </div>
              <h2 style={{ fontSize: '22px', fontWeight: 600, color: 'var(--color-neutral-900)' }}>Pagamento</h2>
            </div>
            <p style={{ color: 'var(--color-neutral-500)', fontSize: '14px', marginLeft: '46px' }}>Aceitamos cartões de crédito e débito.</p>
          </div>

          <form onSubmit={handleCheckout} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-5)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              <label style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-neutral-800)' }}>Número do Cartão</label>
              <input 
                type="text" 
                name="cardNumber"
                placeholder="0000 0000 0000 0000" 
                value={formData.cardNumber}
                onChange={handleInputChange}
                required
                maxLength={19}
                style={{ width: '100%', padding: '14px 16px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--surface-border)', outline: 'none', fontSize: '16px', transition: 'border-color 0.2s', backgroundColor: 'var(--color-neutral-50)' }}
              />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              <label style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-neutral-800)' }}>Nome Impresso no Cartão</label>
              <input 
                type="text" 
                name="cardName"
                placeholder="NOME COMO NO CARTÃO" 
                value={formData.cardName}
                onChange={handleInputChange}
                required
                style={{ width: '100%', padding: '14px 16px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--surface-border)', outline: 'none', fontSize: '16px', transition: 'border-color 0.2s', backgroundColor: 'var(--color-neutral-50)', textTransform: 'uppercase' }}
              />
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-4)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                <label style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-neutral-800)' }}>Validade</label>
                <input 
                  type="text" 
                  name="expiryDate"
                  placeholder="MM/AA" 
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  required
                  maxLength={5}
                  style={{ width: '100%', padding: '14px 16px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--surface-border)', outline: 'none', fontSize: '16px', transition: 'border-color 0.2s', backgroundColor: 'var(--color-neutral-50)' }}
                />
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                <label style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-neutral-800)' }}>CVV</label>
                <input 
                  type="password" 
                  name="cvv"
                  placeholder="123" 
                  value={formData.cvv}
                  onChange={handleInputChange}
                  required
                  maxLength={4}
                  style={{ width: '100%', padding: '14px 16px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--surface-border)', outline: 'none', fontSize: '16px', transition: 'border-color 0.2s', backgroundColor: 'var(--color-neutral-50)' }}
                />
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--color-neutral-50)', padding: '16px', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--surface-border)', marginTop: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <ShieldCheck size={20} color="var(--color-success-600)" style={{ flexShrink: 0 }} />
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-neutral-900)', marginBottom: '4px' }}>Pagamento Seguro</h4>
                  <p style={{ fontSize: '13px', color: 'var(--color-neutral-600)', lineHeight: '1.4' }}>
                    Seus dados são criptografados e processados de forma segura. Aceitamos cartões de crédito e débito para a assinatura recorrente.
                  </p>
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              variant="primary" 
              size="lg" 
              isLoading={isProcessing}
              style={{ 
                marginTop: 'var(--spacing-2)', 
                width: '100%', 
                backgroundColor: 'var(--color-gold-600)', 
                color: 'white', 
                borderColor: 'var(--color-gold-600)',
                padding: '16px',
                fontSize: '16px',
                fontWeight: 600,
                boxShadow: '0 4px 12px rgba(212, 175, 55, 0.3)'
              }}
              rightIcon={<ArrowRight size={20} />}
            >
              Assinar Premium — R$ 49,90/mês
            </Button>
            
            <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--color-neutral-500)', marginTop: '8px' }}>
              Você pode cancelar a qualquer momento.
            </p>
          </form>
        </div>
      </div>
      
      {/* Required CSS for responsiveness */}
      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 768px) {
          .md-grid-1 {
            grid-template-columns: 1fr !important;
          }
        }
        input:focus {
          border-color: var(--color-gold-500) !important;
          box-shadow: 0 0 0 2px rgba(212, 175, 55, 0.1);
        }
      `}} />
    </div>
  );
}
