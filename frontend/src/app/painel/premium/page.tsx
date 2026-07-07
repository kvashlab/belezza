'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, ArrowRight, ShieldCheck, CreditCard, Sparkles } from 'lucide-react';
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-8)', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-4)' }}>
        <h1 className="heading-1 title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          Plano Premium <Sparkles color="var(--color-gold-500)" size={32} />
        </h1>
        <p className="body-text" style={{ color: 'var(--color-neutral-500)' }}>
          Eleve seu negócio ao próximo nível com a melhor experiência para você e seus clientes.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-8)' }} className="md-grid-1">
        
        {/* BENEFITS SECTION */}
        <div style={{ backgroundColor: 'var(--surface-card)', padding: 'var(--spacing-6)', borderRadius: 'var(--radius-2xl)', border: '1px solid var(--color-gold-200)', boxShadow: 'var(--shadow-md)' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: 'var(--spacing-4)', color: 'var(--color-neutral-900)' }}>Resumo da Assinatura</h2>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-6)', paddingBottom: 'var(--spacing-6)', borderBottom: '1px solid var(--surface-border)' }}>
            <div>
              <strong style={{ display: 'block', fontSize: '18px', color: 'var(--color-gold-600)' }}>Belezza Pro</strong>
              <span style={{ fontSize: '14px', color: 'var(--color-neutral-500)' }}>Assinatura Mensal</span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-neutral-900)' }}>R$ 49,90</span>
              <span style={{ fontSize: '14px', color: 'var(--color-neutral-500)' }}>/mês</span>
            </div>
          </div>

          <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: 'var(--spacing-4)' }}>O que está incluso:</h3>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)', listStyle: 'none', padding: 0 }}>
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
                <CheckCircle2 size={20} color="var(--color-gold-500)" style={{ flexShrink: 0 }} />
                <span style={{ color: 'var(--color-neutral-700)', fontSize: '15px' }}>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* PAYMENT SECTION */}
        <div style={{ backgroundColor: 'var(--surface-card)', padding: 'var(--spacing-6)', borderRadius: 'var(--radius-2xl)', border: '1px solid var(--surface-border)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--spacing-6)' }}>
            <CreditCard size={24} color="var(--color-neutral-700)" />
            <h2 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--color-neutral-900)' }}>Dados de Pagamento</h2>
          </div>

          <form onSubmit={handleCheckout} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              <label style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-neutral-900)' }}>Número do Cartão</label>
              <input 
                type="text" 
                name="cardNumber"
                placeholder="0000 0000 0000 0000" 
                value={formData.cardNumber}
                onChange={handleInputChange}
                required
                maxLength={19}
                style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--surface-border)', outline: 'none', fontSize: '15px' }}
              />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              <label style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-neutral-900)' }}>Nome Impresso no Cartão</label>
              <input 
                type="text" 
                name="cardName"
                placeholder="NOME COMO NO CARTÃO" 
                value={formData.cardName}
                onChange={handleInputChange}
                required
                style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--surface-border)', outline: 'none', fontSize: '15px' }}
              />
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-4)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                <label style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-neutral-900)' }}>Validade</label>
                <input 
                  type="text" 
                  name="expiryDate"
                  placeholder="MM/AA" 
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  required
                  maxLength={5}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--surface-border)', outline: 'none', fontSize: '15px' }}
                />
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                <label style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-neutral-900)' }}>CVV</label>
                <input 
                  type="password" 
                  name="cvv"
                  placeholder="123" 
                  value={formData.cvv}
                  onChange={handleInputChange}
                  required
                  maxLength={4}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--surface-border)', outline: 'none', fontSize: '15px' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: 'var(--spacing-4)', color: 'var(--color-neutral-500)', fontSize: '13px' }}>
              <ShieldCheck size={16} color="var(--color-success-500)" />
              <span>Pagamento 100% seguro e criptografado. Sujeito aos termos de serviço.</span>
            </div>

            <Button 
              type="submit" 
              variant="primary" 
              size="lg" 
              isLoading={isProcessing}
              style={{ marginTop: 'var(--spacing-4)', width: '100%', backgroundColor: 'var(--color-gold-600)', color: 'white', borderColor: 'var(--color-gold-600)' }}
              rightIcon={<ArrowRight size={20} />}
            >
              Finalizar Assinatura — R$ 49,90
            </Button>
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
      `}} />
    </div>
  );
}
