'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { MapPin, Star, Share2, Calendar, X } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Tabs } from '@/components/ui/Tabs';
import { useUIStore } from '@/stores/ui.store';
import { api } from '@/lib/api';
import styles from './styles.module.css';

export default function PublicProfile() {
  const params = useParams();
  const router = useRouter();
  const rawUsername = params.username as string || '';
  const username = decodeURIComponent(rawUsername).replace(/^@/, ''); // Remove @ for matching
  
  const { favoriteIds, toggleFavorite, addToast } = useUIStore();
  
  const [professional, setProfessional] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);



  useEffect(() => {
    async function fetchProfessional() {
      try {
        const res = await api.get(`/professionals/public/${username}`);
        setProfessional(res.data);
      } catch (e) {
        console.error(e);
        setProfessional(null);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProfessional();
  }, [username]);
  
  if (isLoading) {
    return <div className={styles.page} style={{ display: 'flex', justifyContent: 'center', padding: '64px' }}>Carregando perfil...</div>;
  }

  if (!professional) {
    return <div className={styles.notFound}>Profissional não encontrado(a).</div>;
  }

  const isFavorite = favoriteIds.includes(professional.id);
  const profServices = professional.services || [];
  const profPortfolio = professional.portfolio || [];
  const profReviews = professional.reviews || []; // Add reviews to backend later if needed

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: professional.businessName || professional.user?.name,
        text: professional.bio,
        url: window.location.href,
      });
    }
  };



  const renderServices = () => (
    <div className={styles.servicesList}>
      {profServices.map((service: any) => (
        <div key={service.id} className={styles.serviceItem}>
          <div className={styles.serviceInfo}>
            <h4 className={styles.serviceName}>{service.name}</h4>
            <p className={styles.serviceDesc}>{service.description}</p>
            <span className={styles.serviceDuration}>{service.duration} min</span>
          </div>
          <div className={styles.serviceAction}>
            <div className={styles.servicePrice}>R$ {service.price.toFixed(2)}</div>
            <Button size="sm" onClick={() => router.push(`/@${username}/agendar?serviceId=${service.id}`)}>Adicionar</Button>
          </div>
        </div>
      ))}
      {profServices.length === 0 && <p>Nenhum serviço cadastrado.</p>}
    </div>
  );

  const renderPortfolio = () => (
    <div className={styles.portfolioGrid}>
      {profPortfolio.map((photo: any, index: number) => (
        <div key={photo.id} className={styles.portfolioItem} onClick={() => setActiveStoryIndex(index)}>
          <Image src={photo.url} alt={photo.description || 'Portfólio'} fill className={styles.portfolioImage} unoptimized />
          {photo.isBeforeAfter && <Badge size="sm" className={styles.beforeAfterBadge}>Antes/Depois</Badge>}
        </div>
      ))}
      {profPortfolio.length === 0 && <p>Nenhuma foto no portfólio.</p>}
    </div>
  );

  const renderReviews = () => (
    <div className={styles.reviewsList}>
      <div className={styles.reviewsSummary}>
        <div className={styles.bigRating}>
          <Star size={32} className={styles.starIcon} fill="currentColor" />
          <span>{professional.rating}</span>
        </div>
        <p>{professional.reviewsCount} avaliações no total</p>
      </div>
      {profReviews.map((review: any) => (
        <div key={review.id} className={styles.reviewCard}>
          <div className={styles.reviewHeader}>
            <Avatar name={review.client?.user?.name || review.clientName} src={review.client?.avatar || review.clientAvatar} size="sm" />
            <div>
              <span className={styles.reviewerName}>{review.client?.user?.name || review.clientName}</span>
              <span className={styles.reviewDate}>{new Date(review.createdAt).toLocaleDateString()}</span>
            </div>
            <div className={styles.reviewStars}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={14} fill={i < review.rating ? 'var(--color-gold-500)' : 'none'} color={i < review.rating ? 'var(--color-gold-500)' : 'var(--color-neutral-300)'} />
              ))}
            </div>
          </div>
          <p className={styles.reviewComment}>{review.comment}</p>
          <span className={styles.reviewService}>{review.serviceName}</span>
          
          {review.reply && (
            <div className={styles.reviewReply}>
              <strong>Resposta da profissional:</strong>
              <p>{review.reply.content}</p>
            </div>
          )}
        </div>
      ))}
      {profReviews.length === 0 && <p>Nenhuma avaliação ainda.</p>}
    </div>
  );

  const renderSobre = () => {
    let socialLinks: any = {};
    try {
      socialLinks = typeof professional.socialLinks === 'string' ? JSON.parse(professional.socialLinks) : professional.socialLinks || {};
    } catch (e) {
      // ignore
    }
    
    const addressParts = [professional.neighborhood, professional.city, professional.state].filter(Boolean);
    const addressStr = addressParts.join(', ');

    const daysOfWeek = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    const sortedHours = (professional.workingHours || []).sort((a: any, b: any) => a.dayOfWeek - b.dayOfWeek);

    return (
      <div style={{ padding: '24px 0', display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {/* Bio Section */}
        <div style={{ backgroundColor: 'var(--surface-card)', borderRadius: 'var(--radius-lg)', padding: '24px', border: '1px solid var(--surface-border)' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', color: 'var(--color-neutral-900)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ display: 'inline-block', width: '4px', height: '18px', backgroundColor: 'var(--color-primary-500)', borderRadius: '2px' }}></span>
            Sobre o Espaço
          </h3>
          <p style={{ whiteSpace: 'pre-wrap', color: 'var(--color-neutral-600)', lineHeight: 1.7, fontSize: '15px' }}>
            {professional.bio || 'Este profissional ainda não adicionou uma descrição detalhada.'}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          {/* Horários de Atendimento */}
          <div style={{ backgroundColor: 'var(--surface-card)', borderRadius: 'var(--radius-lg)', padding: '24px', border: '1px solid var(--surface-border)' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', color: 'var(--color-neutral-900)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ display: 'inline-block', width: '4px', height: '18px', backgroundColor: 'var(--color-primary-500)', borderRadius: '2px' }}></span>
              Horários de Atendimento
            </h3>
            
            {sortedHours.length > 0 ? (
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {sortedHours.map((wh: any) => (
                  <li key={wh.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid var(--surface-border)', fontSize: '14px' }}>
                    <span style={{ fontWeight: 500, color: 'var(--color-neutral-700)' }}>{daysOfWeek[wh.dayOfWeek]}</span>
                    {wh.isClosed ? (
                      <Badge variant="error">Fechado</Badge>
                    ) : (
                      <span style={{ color: 'var(--color-neutral-600)' }}>{wh.startTime} às {wh.endTime}</span>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ color: 'var(--color-neutral-500)', fontSize: '14px', fontStyle: 'italic' }}>Horários não informados.</p>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Contato */}
            {(socialLinks.whatsapp || socialLinks.instagram) && (
              <div style={{ backgroundColor: 'var(--surface-card)', borderRadius: 'var(--radius-lg)', padding: '24px', border: '1px solid var(--surface-border)' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', color: 'var(--color-neutral-900)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ display: 'inline-block', width: '4px', height: '18px', backgroundColor: 'var(--color-primary-500)', borderRadius: '2px' }}></span>
                  Redes Sociais
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {socialLinks.whatsapp && (
                    <a href={`https://wa.me/${socialLinks.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', color: 'var(--color-neutral-700)', fontSize: '15px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#E8F5E9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4CAF50' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                      </div>
                      <span style={{ fontWeight: 500 }}>WhatsApp</span>
                    </a>
                  )}
                  {socialLinks.instagram && (
                    <a href={socialLinks.instagram.startsWith('http') ? socialLinks.instagram : `https://instagram.com/${socialLinks.instagram.replace('@', '')}`} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', color: 'var(--color-neutral-700)', fontSize: '15px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#FCE4EC', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#E91E63' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                      </div>
                      <span style={{ fontWeight: 500 }}>Instagram</span>
                    </a>
                  )}
                </div>
              </div>
            )}
            
            {/* Localização */}
            <div style={{ backgroundColor: 'var(--surface-card)', borderRadius: 'var(--radius-lg)', padding: '24px', border: '1px solid var(--surface-border)' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', color: 'var(--color-neutral-900)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ display: 'inline-block', width: '4px', height: '18px', backgroundColor: 'var(--color-primary-500)', borderRadius: '2px' }}></span>
                Localização
              </h3>
              {addressStr ? (
                <>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '16px', color: 'var(--color-neutral-700)' }}>
                    <MapPin size={20} style={{ flexShrink: 0, marginTop: '2px', color: 'var(--color-primary-500)' }} />
                    <span style={{ fontSize: '15px', lineHeight: 1.5 }}>{addressStr}</span>
                  </div>
                  <div style={{ width: '100%', height: '200px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--surface-border)' }}>
                    <iframe 
                      src={`https://www.google.com/maps?q=${encodeURIComponent(addressStr)}&output=embed`}
                      width="100%" 
                      height="100%" 
                      style={{ border: 0 }} 
                      allowFullScreen={false} 
                      loading="lazy" 
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                  </div>
                </>
              ) : (
                <p style={{ color: 'var(--color-neutral-500)', fontSize: '14px', fontStyle: 'italic' }}>Endereço completo não disponível.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const cats = typeof professional.categories === 'string' ? professional.categories.split(',') : (professional.categories || []);

  return (
    <div className={styles.page}>
      <div className={styles.coverSection}>
        {professional.coverImage ? (
          <Image src={professional.coverImage} alt="Capa" fill className={styles.coverImage} unoptimized />
        ) : (
          <div className={styles.coverImage} style={{ backgroundColor: 'var(--color-neutral-200)', position: 'absolute', inset: 0 }} />
        )}
        <div className={styles.coverOverlay}></div>
      </div>
      
      <div className={styles.profileContainer}>
        <div className={styles.headerInfo}>
          <div className={styles.avatarContainer}>
            <Avatar name={professional.user?.name || professional.businessName} src={professional.avatar} size="xl" hasGoldBorder />
            {professional.verified && <div className={styles.verifiedBadge}>✓</div>}
          </div>
          
          <div className={styles.actions}>
            <button className={styles.actionBtn} onClick={() => toggleFavorite(professional.id)} title={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}>
              <Star size={20} fill={isFavorite ? 'var(--color-gold-500)' : 'none'} color={isFavorite ? 'var(--color-gold-500)' : 'currentColor'} />
            </button>
            <button className={styles.actionBtn} onClick={handleShare} title="Compartilhar">
              <Share2 size={20} />
            </button>
          </div>
        </div>
        
        <div className={styles.details}>
          <h1 className={styles.name}>{professional.businessName || professional.user?.name}</h1>
          <p className={styles.username}>@{professional.username}</p>
          
          <div className={styles.badges}>
            {cats.map((cat: string) => (
              <Badge key={cat} variant={'default'}>{cat.trim()}</Badge>
            ))}
          </div>
          
          <div className={styles.stats}>
            <div className={styles.statItem}>
              <Star size={16} className={styles.starIcon} fill="currentColor" />
              <strong>{professional.rating}</strong>
              <span>({professional.reviewsCount} avaliações)</span>
            </div>
            <div className={styles.statItem}>
              <MapPin size={16} />
              <span>{professional.neighborhood || ''}{professional.city ? `, ${professional.city}` : ''}</span>
            </div>
          </div>
          
          <p className={styles.bio}>{professional.bio}</p>
        </div>

        <Tabs 
          items={[
            { id: 'servicos', label: 'Serviços', content: renderServices() },
            { id: 'portfolio', label: 'Portfólio', content: renderPortfolio() },
            { id: 'avaliacoes', label: 'Avaliações', content: renderReviews() },
            { id: 'sobre', label: 'Sobre', content: renderSobre() }
          ]}
        />
      </div>

      {/* Sticky Bottom Bar for Mobile */}
      <div className={styles.stickyFooter}>
        <Button 
          variant="primary" 
          size="lg" 
          className={styles.bookBtn}
          onClick={() => router.push(`/@${username}/agendar`)}
          leftIcon={<Calendar size={20} />}
        >
          Agendar Horário
        </Button>
      </div>

      {/* Stories Viewer Modal */}
      {activeStoryIndex !== null && (
        <div className={styles.storiesViewer}>
          <div className={styles.storiesOverlay} onClick={() => setActiveStoryIndex(null)}></div>
          <button className={styles.closeStoriesBtn} onClick={() => setActiveStoryIndex(null)}>✕</button>
          
          <div className={styles.storiesContent}>
            {/* Progress Bars */}
            <div className={styles.storiesProgressContainer}>
              {profPortfolio.map((_: any, idx: number) => (
                <div key={idx} className={styles.storyProgressBar}>
                  <div 
                    className={styles.storyProgressFill} 
                    style={{ 
                      width: idx < activeStoryIndex ? '100%' : (idx === activeStoryIndex ? '100%' : '0%'),
                      transition: idx === activeStoryIndex ? 'width 5s linear' : 'none'
                    }} 
                  />
                </div>
              ))}
            </div>
            
            <div className={styles.storyHeader}>
              <Avatar name={professional.user?.name} src={professional.avatar} size="sm" />
              <span className={styles.storyAuthor}>{professional.username}</span>
            </div>
            
            <div className={styles.storyImageContainer}>
              <Image 
                src={profPortfolio[activeStoryIndex].url} 
                alt="Story" 
                fill 
                className={styles.storyImage} 
                unoptimized
              />
            </div>
            
            {/* Navigation Areas */}
            <div 
              className={styles.storyPrevArea} 
              onClick={() => setActiveStoryIndex(prev => prev! > 0 ? prev! - 1 : prev)}
            />
            <div 
              className={styles.storyNextArea} 
              onClick={() => setActiveStoryIndex(prev => prev! < profPortfolio.length - 1 ? prev! + 1 : null)}
            />
          </div>
        </div>
      )}


    </div>
  );
}
