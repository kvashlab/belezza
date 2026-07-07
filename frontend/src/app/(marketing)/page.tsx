'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Scissors, Sparkles, Smile, Droplets, Calendar, BarChart, Smartphone, Star, CheckCircle2, ChevronDown, Bell, Zap, Clock, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/stores/auth.store';
import styles from './styles.module.css';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeInteractive, setActiveInteractive] = useState<number>(0);
  const [isAnnual, setIsAnnual] = useState(true);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/explorar?q=${encodeURIComponent(searchQuery)}`);
  };

  const categories = [
    { name: 'Cabelo', icon: Scissors, image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=300&auto=format&fit=crop' },
    { name: 'Unhas', icon: Sparkles, image: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=300&auto=format&fit=crop' },
    { name: 'Estética', icon: Smile, image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=300&auto=format&fit=crop' },
    { name: 'Maquiagem', icon: Droplets, image: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?q=80&w=300&auto=format&fit=crop' },
  ];

  const faqs = [
    { q: "Preciso baixar algum aplicativo para usar?", a: "Não! A Belezza funciona 100% no navegador (celular ou computador). Seus clientes não precisam baixar nada para agendar com você." },
    { q: "Como eu recebo os pagamentos dos clientes?", a: "No plano Premium, você pode cobrar um sinal (ex: 30%) no momento do agendamento via Pix ou Cartão para evitar faltas. O valor vai direto para sua conta." },
    { q: "O plano grátis tem limite de agendamentos?", a: "Sim, o plano gratuito permite até 50 agendamentos por mês e não inclui os lembretes automáticos por WhatsApp." }
  ];

  const interactives = [
    { q: "E se a cliente esquecer o horário?", a: "A Belezza envia um lembrete automático via WhatsApp 24h e 2h antes do agendamento. Nossas métricas mostram uma redução de 80% nas faltas." },
    { q: "Posso cobrar um adiantamento?", a: "Sim. Configure o pagamento de um sinal (ex: 30%) para reservar o horário. O valor cai direto na sua conta, protegendo seu faturamento." },
    { q: "Como gerenciar múltiplos profissionais?", a: "O painel permite adicionar vários colaboradores, cada um com sua própria agenda, horários de pausa e divisão de comissões, tudo em um só lugar." }
  ];

  const searchSuggestions = ['Manicure', 'Lash Designer', 'Maquiagem', 'Corte Feminino', 'Limpeza de Pele'];

  return (
    <div className={styles.page}>
      
      {/* 1. HERO SECTION */}
      <section className={styles.hero} id="hero">
        <div className={styles.heroGlow}></div>
        <div className={styles.heroContainer}>
          <div className={styles.heroText}>
            <div className={styles.heroBadge}>
              <Sparkles size={14} className={styles.badgeIcon} />
              <span>A plataforma nº1 para profissionais da beleza</span>
            </div>
            
            <h1 className={styles.heroTitle}>
              Conecte seu talento a <br/> mais clientes{' '}
              <span className={styles.relativeWrap}>
                sem esforço.
                <svg className={styles.titleUnderline} viewBox="0 0 286 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2.61668 18.2711C91.9566 5.86433 189.923 2.15557 283.479 2.01257" stroke="var(--color-primary-500)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </h1>
            
            <p className={styles.heroSubtitle}>
              Veja como é fácil automatizar sua agenda, enviar lembretes por WhatsApp e acabar de vez com as faltas dos clientes.
            </p>
            
            <div className={styles.heroCtas}>
              <Link href="/cadastro">
                <Button size="lg" className={styles.btnPrimary}>Começar grátis</Button>
              </Link>
              <Link href="/explorar">
                <Button variant="secondary" size="lg" className={styles.btnSecondary}>Sou cliente</Button>
              </Link>
            </div>
          </div>
          
          <div className={styles.heroVisual}>
            <div className={styles.mockupWrapper}>
              <img src="/mockup.png" alt="Belezza App Mockup" className={styles.mockupImage} />
              
              <div className={`${styles.glassCard} ${styles.floatLeft}`}>
                <div className={styles.gcIcon} style={{ background: '#E8F5E9', color: '#4CAF50' }}><CheckCircle2 size={18} /></div>
                <div className={styles.gcText}>
                  <strong>Agendamento Pix</strong>
                  <span className={styles.gcPositive}>+ R$ 120,00</span>
                </div>
              </div>
              
              <div className={`${styles.glassCard} ${styles.floatRight}`}>
                <div className={styles.gcIcon} style={{ background: '#E3F2FD', color: '#2196F3' }}><Bell size={18} /></div>
                <div className={styles.gcText}>
                  <strong>Lembrete enviado</strong>
                  <span>Cliente confirmou!</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SOCIAL PROOF */}
      <section className={styles.socialProof}>
        <div className={styles.spContainer}>
          <div className={styles.spItem}>
            <div className={styles.spNumber}>+10k</div>
            <div className={styles.spLabel}>Agendamentos mensais</div>
          </div>
          <div className={styles.spDivider}></div>
          <div className={styles.spItem}>
            <div className={styles.spNumber}>+5k</div>
            <div className={styles.spLabel}>Profissionais ativos</div>
          </div>
          <div className={styles.spDivider}></div>
          <div className={styles.spItem}>
            <div className={styles.stars}>
              {[1,2,3,4,5].map(i => <Star key={i} size={18} fill="#FFB800" color="#FFB800" />)}
            </div>
            <div className={styles.spLabel}>4.9/5 Avaliação média</div>
          </div>
        </div>
      </section>

      {/* 3. BENTO GRID FEATURES (Recursos) */}
      <section className={styles.sectionFeatures} id="recursos">
        <div className={styles.sectionHeader}>
          <h2>A solução completa para o seu negócio</h2>
          <p>Tudo o que você precisa para crescer, em um único painel inteligente.</p>
        </div>

        <div className={styles.bentoGrid}>
          {/* Card 1: Agenda 24/7 */}
          <div className={`${styles.bentoCard} ${styles.bentoLarge}`}>
            <div className={styles.bentoContent}>
              <div className={styles.bentoIcon}><Calendar size={24} /></div>
              <h3>Agenda Inteligente 24/7</h3>
              <p>Receba agendamentos até quando estiver dormindo ou ocupada atendendo. Seu link exclusivo trabalha por você.</p>
            </div>
            <div className={styles.bentoVisualArea}>
              <div className={styles.mockupMiniCard}>
                <div className={styles.mcHeader}>Hoje, 14:00</div>
                <div className={styles.mcBody}>
                  <div className={styles.mcAvatar}>A</div>
                  <div>
                    <strong>Amanda Silva</strong>
                    <span>Extensão de Cílios</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: WhatsApp */}
          <div className={`${styles.bentoCard} ${styles.bentoMedium} ${styles.bentoBlue}`}>
            <div className={styles.bentoContent}>
              <div className={styles.bentoIcon} style={{ background: 'rgba(255,255,255,0.2)', color: '#fff' }}><Smartphone size={24} /></div>
              <h3>Lembretes no WhatsApp</h3>
              <p>Acabe com as faltas. O sistema avisa seus clientes automaticamente.</p>
            </div>
          </div>

          {/* Card 3: Analytics */}
          <div className={`${styles.bentoCard} ${styles.bentoMedium}`}>
            <div className={styles.bentoContent}>
              <div className={styles.bentoIcon}><BarChart size={24} /></div>
              <h3>Belezza Analytics</h3>
              <p>Acompanhe seu faturamento, clientes novos e ticket médio.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. INTERACTIVE SECTION (Como a Belezza te ajuda?) */}
      <section className={styles.sectionInteractive} id="funciona">
        <div className={styles.sectionHeader}>
          <div className={styles.tagLabel}><Zap size={14} /> COMO FUNCIONA</div>
          <h2>Converse com a Belezza e veja como resolvemos seus problemas.</h2>
        </div>

        <div className={styles.interactiveContainer}>
          <div className={styles.interactiveQuestions}>
            {interactives.map((item, idx) => (
              <button 
                key={idx}
                className={`${styles.iqButton} ${activeInteractive === idx ? styles.iqActive : ''}`}
                onClick={() => setActiveInteractive(idx)}
              >
                {item.q}
              </button>
            ))}
          </div>
          <div className={styles.interactiveAnswer}>
            <div className={styles.iaHeader}>
              <img src="/favicon.ico" alt="Belezza Logo" className={styles.iaAvatar} />
              <strong>Belezza Responde</strong>
            </div>
            <div className={styles.iaBody}>
              <p>{interactives[activeInteractive].a}</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* 4.5 SEÇÃO CLIENTES (Explorar) */}
      <section className={styles.sectionClients}>
        <div className={styles.clientsContainer}>
          <div className={styles.clientsText}>
            <h2>Procurando um profissional?</h2>
            <p>Descubra os melhores especialistas em beleza perto de você e agende em segundos.</p>
            <Link href="/explorar">
              <Button size="lg" className={styles.btnPrimary}>Explorar profissionais</Button>
            </Link>
          </div>
          <div className={styles.categoriesVisualGrid}>
            {categories.map((cat, i) => (
              <Link href={`/explorar?categoria=${cat.name.toLowerCase()}`} key={i} className={styles.catVisualCard}>
                <img src={cat.image} alt={cat.name} className={styles.catImage} />
                <div className={styles.catOverlay}>
                  <cat.icon size={24} />
                  <span>{cat.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. PRICING */}
      <section className={styles.sectionPricing} id="precos">
        <div className={styles.sectionHeader}>
          <h2>Preços justos para o seu crescimento</h2>
          <p>Comece grátis, faça upgrade quando estiver pronto para escalar.</p>
          
          <div className={styles.billingToggle}>
            <span className={!isAnnual ? styles.activeToggleText : ''}>Mensal</span>
            <button className={`${styles.toggleSwitch} ${isAnnual ? styles.toggleOn : ''}`} onClick={() => setIsAnnual(!isAnnual)}>
              <div className={styles.toggleKnob}></div>
            </button>
            <span className={isAnnual ? styles.activeToggleText : ''}>Anual <span className={styles.discountBadge}>Economize 20%</span></span>
          </div>
        </div>

        <div className={styles.pricingGrid}>
          {/* Free Plan */}
          <div className={styles.pricingCard}>
            <h3>Básico</h3>
            <p className={styles.pricingDesc}>Ideal para quem está começando agora.</p>
            <div className={styles.price}>
              <span className={styles.currency}>R$</span> 0 <span className={styles.period}>/mês</span>
            </div>
            <Link href="/cadastro" style={{width: '100%', display: 'block', margin: '24px 0'}}>
              <Button variant="secondary" size="lg" className={styles.btnSecondary} style={{width: '100%'}}>Criar conta grátis</Button>
            </Link>
            <ul className={styles.pricingFeatures}>
              <li><CheckCircle2 size={18} className={styles.iconCheck} /> Link próprio de agendamento</li>
              <li><CheckCircle2 size={18} className={styles.iconCheck} /> Até 50 agendamentos/mês</li>
              <li><CheckCircle2 size={18} className={styles.iconCheck} /> Portfólio com 10 fotos</li>
            </ul>
          </div>

          {/* Pro Plan */}
          <div className={`${styles.pricingCard} ${styles.pricingPro}`}>
            <div className={styles.proBadge}>Mais Escolhido</div>
            <h3>Premium</h3>
            <p className={styles.pricingDesc}>Para profissionais que querem escalar.</p>
            <div className={styles.price}>
              <span className={styles.currency}>R$</span> {isAnnual ? '39,90' : '49,90'} <span className={styles.period}>/mês</span>
            </div>
            <div style={{width: '100%', display: 'block', margin: '24px 0'}} onClick={() => {
              if (isAuthenticated) {
                router.push('/painel/premium');
              } else {
                router.push('/cadastro');
              }
            }}>
              <Button variant="primary" size="lg" className={styles.btnPrimary} style={{width: '100%'}}>Teste grátis por 14 dias</Button>
            </div>
            <ul className={styles.pricingFeatures}>
              <li><CheckCircle2 size={18} className={styles.iconCheck} /> Agendamentos Ilimitados</li>
              <li><CheckCircle2 size={18} className={styles.iconCheck} /> Lembretes WhatsApp 24h/2h</li>
              <li><CheckCircle2 size={18} className={styles.iconCheck} /> Recebimento de sinal (Pix/Cartão)</li>
              <li><CheckCircle2 size={18} className={styles.iconCheck} /> Múltiplos colaboradores</li>
              <li><CheckCircle2 size={18} className={styles.iconCheck} /> Belezza Analytics Avançado</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 6. FAQ */}
      <section className={styles.sectionFaq} id="faq">
        <div className={styles.sectionHeader}>
          <h2>Dúvidas Frequentes</h2>
          <p>Tudo o que você precisa saber sobre a Belezza.</p>
        </div>
        
        <div className={styles.faqContainer}>
          {faqs.map((faq, idx) => (
            <div 
              key={idx} 
              className={`${styles.faqItem} ${openFaq === idx ? styles.faqOpen : ''}`} 
              onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
            >
              <div className={styles.faqQuestion}>
                {faq.q}
                <div className={styles.faqIconWrapper}>
                  <ChevronDown size={20} className={styles.faqIcon} />
                </div>
              </div>
              <div className={styles.faqAnswer}>
                <p>{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. BOTTOM CTA */}
      <section className={styles.sectionBottomCta}>
        <div className={styles.bcContent}>
          <h2>Pronta para transformar seu negócio?</h2>
          <p>Junte-se a milhares de profissionais que já modernizaram suas agendas.</p>
          <div className={styles.bcActions}>
            <Link href="/cadastro">
              <Button size="lg" className={styles.btnPrimaryWhite}>Começar meus 14 dias grátis</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
