'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Scissors, Sparkles, Smile, Droplets, Calendar, BarChart, Smartphone, Star, CheckCircle2, ChevronDown, Bell } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import styles from './styles.module.css';

export default function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/explorar?q=${encodeURIComponent(searchQuery)}`);
  };

  const categories = [
    { name: 'Cabelo', icon: Scissors, color: 'var(--color-cabelo)', image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=300&auto=format&fit=crop' },
    { name: 'Unhas', icon: Sparkles, color: 'var(--color-unhas)', image: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=300&auto=format&fit=crop' },
    { name: 'Estética', icon: Smile, color: 'var(--color-estetica)', image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=300&auto=format&fit=crop' },
    { name: 'Maquiagem', icon: Droplets, color: 'var(--color-maquiagem)', image: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?q=80&w=300&auto=format&fit=crop' },
  ];

  const faqs = [
    { q: "Preciso baixar algum aplicativo para usar?", a: "Não! A Belezza funciona 100% no navegador (celular ou computador). Seus clientes não precisam baixar nada para agendar com você." },
    { q: "Como eu recebo os pagamentos dos clientes?", a: "No plano Premium, você pode cobrar um sinal (ex: 30%) no momento do agendamento via Pix ou Cartão para evitar faltas. O valor vai direto para sua conta." },
    { q: "O plano grátis tem limite de agendamentos?", a: "Sim, o plano gratuito permite até 50 agendamentos por mês e não inclui os lembretes automáticos por WhatsApp." }
  ];

  const searchSuggestions = ['Manicure', 'Lash Designer', 'Maquiagem', 'Corte Feminino', 'Limpeza de Pele'];

  return (
    <div className={styles.page}>
      
      {/* 1. HERO SECTION B2B & B2C */}
      <section className={styles.hero}>
        <div className={styles.heroContainer}>
          <div className={styles.heroText}>
            <div className={styles.heroBadge}>
              <Sparkles size={16} /> A plataforma nº1 para profissionais da beleza
            </div>
            <h1 className={styles.heroTitle}>
              Conecte seu talento a <span className={styles.textGradient}>mais clientes</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Organize sua agenda, acabe com as faltas através de lembretes automáticos via WhatsApp e receba agendamentos 24h por dia.
            </p>
            <div className={styles.heroCtas}>
              <Link href="/cadastro">
                <Button size="lg" className={styles.heroBtnPrimary}>Criar minha página grátis</Button>
              </Link>
              <Link href="/explorar">
                <Button variant="secondary" size="lg" className={styles.heroBtnSecondary}>Buscar profissionais</Button>
              </Link>
            </div>
          </div>
          
          <div className={styles.heroVisual}>
            <div className={styles.mockupWrapper}>
              <img src="https://images.unsplash.com/photo-1521590832167-7bfcbaa6362d?q=80&w=800&auto=format&fit=crop" alt="Belezza App" className={styles.mockupImage} />
              <div className={`${styles.floatingCard} ${styles.float1}`}>
                <div className={styles.fcIcon} style={{ background: 'var(--color-success-50)', color: 'var(--color-success)' }}><CheckCircle2 size={20} /></div>
                <div>
                  <strong>Novo Agendamento!</strong>
                  <span>Hoje às 14:30 - R$ 120,00</span>
                </div>
              </div>
              <div className={`${styles.floatingCard} ${styles.float2}`}>
                <div className={styles.fcIcon} style={{ background: 'rgba(255, 59, 48, 0.1)', color: '#FF3B30' }}><Bell size={20} /></div>
                <div>
                  <strong>Lembrete enviado</strong>
                  <span>A cliente confirmou presença.</span>
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
            <h3>+10.000</h3>
            <p>Agendamentos mensais</p>
          </div>
          <div className={styles.spDivider} />
          <div className={styles.spItem}>
            <h3>+5.000</h3>
            <p>Profissionais ativos</p>
          </div>
          <div className={styles.spDivider} />
          <div className={styles.spItem}>
            <div className={styles.stars}>
              {[1,2,3,4,5].map(i => <Star key={i} size={20} fill="var(--color-gold-500)" color="var(--color-gold-500)" />)}
            </div>
            <p>4.9/5 Avaliação média</p>
          </div>
        </div>
      </section>

      {/* 3. SEÇÃO PARA CLIENTES */}
      <section className={styles.sectionClients}>
        <div className={styles.sectionHeaderCenter}>
          <h2>Encontre o que você precisa</h2>
          <p>Busque pelos melhores profissionais perto de você</p>
        </div>

        <div className={styles.searchWrapper}>
          <form className={styles.searchForm} onSubmit={handleSearch}>
            <Search className={styles.searchIcon} size={24} strokeWidth={1.5} />
            <input 
              type="text" 
              placeholder="Ex: Designer de Sobrancelhas..." 
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
            />
            <Button type="submit" size="lg" className={styles.searchBtn}>Procurar</Button>
          </form>
          {isSearchFocused && (
            <div className={styles.searchDropdown}>
              <div className={styles.dropdownHeader}>Buscas Populares</div>
              {searchSuggestions.map((suggestion, idx) => (
                <button 
                  key={idx} 
                  className={styles.dropdownItem}
                  onClick={() => {
                    setSearchQuery(suggestion);
                    router.push(`/explorar?q=${encodeURIComponent(suggestion)}`);
                  }}
                >
                  <Search size={16} strokeWidth={1.5} color="var(--color-neutral-500)" />
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className={styles.categoriesVisualGrid}>
          {categories.map((cat, i) => (
            <Link href={`/explorar?categoria=${cat.name.toLowerCase()}`} key={i} className={styles.catVisualCard}>
              <img src={cat.image} alt={cat.name} className={styles.catImage} />
              <div className={styles.catOverlay}>
                <cat.icon size={28} />
                <span>{cat.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. SEÇÃO PARA PROFISSIONAIS */}
      <section className={styles.sectionFeatures}>
        <div className={styles.sfContainer}>
          <div className={styles.sfText}>
            <h2>Liberte-se do WhatsApp e foque no que importa.</h2>
            <p>A Belezza automatiza sua rotina. Ofereça uma experiência premium para seus clientes desde o momento do agendamento.</p>
            
            <ul className={styles.featureList}>
              <li>
                <div className={styles.flIcon}><Calendar /></div>
                <div>
                  <h4>Agenda Inteligente 24/7</h4>
                  <span>Receba agendamentos até quando estiver dormindo ou ocupada atendendo.</span>
                </div>
              </li>
              <li>
                <div className={styles.flIcon}><Smartphone /></div>
                <div>
                  <h4>Lembretes Automáticos</h4>
                  <span>O sistema avisa seus clientes via WhatsApp 24h antes, reduzindo faltas em até 80%.</span>
                </div>
              </li>
              <li>
                <div className={styles.flIcon}><BarChart /></div>
                <div>
                  <h4>Belezza Analytics</h4>
                  <span>Acompanhe seu faturamento, clientes novos e ticket médio direto no painel.</span>
                </div>
              </li>
            </ul>
          </div>
          <div className={styles.sfVisual}>
            <div className={styles.sfImageBg}>
              <img src="https://images.unsplash.com/photo-1516975080661-46bfa3336340?q=80&w=800&auto=format&fit=crop" alt="Profissional" />
            </div>
          </div>
        </div>
      </section>

      {/* 5. DEPOIMENTOS */}
      <section className={styles.sectionTestimonials}>
        <div className={styles.sectionHeaderCenter}>
          <h2>Histórias de Sucesso</h2>
          <p>Profissionais que transformaram seus negócios com a Belezza</p>
        </div>
        <div className={styles.testiGrid}>
          {[
            { name: "Juliana Santos", role: "Nail Designer", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=150&auto=format&fit=crop", text: "Minha renda aumentou 30% porque não perco mais horários com clientes que faltam. O lembrete automático salvou minha vida." },
            { name: "Carlos Oliveira", role: "Cabeleireiro", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop", text: "Meus clientes amam a facilidade de entrar no meu link do Instagram e agendar sozinhos. Zero dor de cabeça." },
            { name: "Amanda Silva", role: "Lash Designer", img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=150&auto=format&fit=crop", text: "A fila de espera automática me ajuda a cobrir desistências no mesmo dia. A Belezza é simplesmente perfeita." }
          ].map((t, i) => (
            <div key={i} className={styles.testiCard}>
              <div className={styles.stars}>
                {[1,2,3,4,5].map(s => <Star key={s} size={16} fill="var(--color-gold-500)" color="var(--color-gold-500)" />)}
              </div>
              <p className={styles.testiText}>&quot;{t.text}&quot;</p>
              <div className={styles.testiAuthor}>
                <img src={t.img} alt={t.name} />
                <div>
                  <strong>{t.name}</strong>
                  <span>{t.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. PRICING */}
      <section className={styles.sectionPricing}>
        <div className={styles.sectionHeaderCenter}>
          <h2>Escolha seu Plano</h2>
          <p>Comece grátis, cresça com o Premium.</p>
        </div>
        <div className={styles.pricingGrid}>
          <div className={styles.pricingCard}>
            <h3>Básico</h3>
            <div className={styles.price}>Grátis<span>/para sempre</span></div>
            <p className={styles.pricingDesc}>Ideal para quem está começando.</p>
            <ul className={styles.pricingFeatures}>
              <li><CheckCircle2 size={18} /> Link próprio de agendamento</li>
              <li><CheckCircle2 size={18} /> Até 50 agendamentos/mês</li>
              <li><CheckCircle2 size={18} /> Portfólio com 10 fotos</li>
              <li className={styles.featureDisabled}>Sem lembretes automáticos</li>
              <li className={styles.featureDisabled}>Sem recebimento de sinal</li>
            </ul>
            <Link href="/cadastro" style={{width: '100%'}}>
              <Button variant="secondary" size="lg" style={{width: '100%'}}>Criar conta grátis</Button>
            </Link>
          </div>

          <div className={`${styles.pricingCard} ${styles.pricingPro}`}>
            <div className={styles.proBadge}>Mais Escolhido</div>
            <h3>Premium</h3>
            <div className={styles.price}>R$ 49,90<span>/mês</span></div>
            <p className={styles.pricingDesc}>Para profissionais que querem escalar.</p>
            <ul className={styles.pricingFeatures}>
              <li><CheckCircle2 size={18} /> Agendamentos Ilimitados</li>
              <li><CheckCircle2 size={18} /> Lembretes via WhatsApp 24h</li>
              <li><CheckCircle2 size={18} /> Fila de espera automática</li>
              <li><CheckCircle2 size={18} /> Recebimento de sinal (Pix/Cartão)</li>
              <li><CheckCircle2 size={18} /> Belezza Analytics (Relatórios)</li>
            </ul>
            <Link href="/cadastro" style={{width: '100%'}}>
              <Button variant="primary" size="lg" style={{width: '100%', backgroundColor: 'var(--color-gold-500)', color: 'white', borderColor: 'var(--color-gold-500)'}}>Teste grátis por 14 dias</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 7. FAQ */}
      <section className={styles.sectionFaq}>
        <div className={styles.sectionHeaderCenter}>
          <h2>Dúvidas Frequentes</h2>
        </div>
        <div className={styles.faqContainer}>
          {faqs.map((faq, idx) => (
            <div key={idx} className={`${styles.faqItem} ${openFaq === idx ? styles.faqOpen : ''}`} onClick={() => setOpenFaq(openFaq === idx ? null : idx)}>
              <div className={styles.faqQuestion}>
                {faq.q}
                <ChevronDown size={20} className={styles.faqIcon} />
              </div>
              <div className={styles.faqAnswer}>
                <p>{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. BOTTOM CTA */}
      <section className={styles.sectionBottomCta}>
        <div className={styles.bcContent}>
          <h2>Pronta para elevar o nível do seu negócio?</h2>
          <p>Junte-se a milhares de profissionais que já modernizaram suas agendas.</p>
          <Link href="/cadastro">
            <Button size="lg" className={styles.bcBtn}>Começar meus 14 dias grátis</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
