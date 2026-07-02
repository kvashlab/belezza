'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { MapPin, Star, Share2, Heart, Calendar } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Tabs } from '@/components/ui/Tabs';
import { useUIStore } from '@/stores/ui.store';
import styles from './styles.module.css';

export default function PublicProfile() {
  const params = useParams();
  const router = useRouter();
  const rawUsername = params.username as string;
  const username = rawUsername.replace('%40', '').replace('@', ''); // Remove @ for matching
  
  const { favoriteIds, toggleFavorite, addToast } = useUIStore();
  
  const [professional, setProfessional] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);

  useEffect(() => {
    async function fetchProfessional() {
      try {
        const res = await fetch(`http://localhost:3333/api/professionals/public/${username}`);
        if (res.ok) {
          const data = await res.json();
          setProfessional(data);
        } else {
          setProfessional(null);
        }
      } catch (e) {
        console.error(e);
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
      {/* Premium Subscription Mock */}
      <div className={styles.subscriptionCard}>
        <div className={styles.subscriptionBadge}>Assinatura Mensal</div>
        <div className={styles.subscriptionInfo}>
          <h4 className={styles.serviceName}>Clube Unhas Perfeitas</h4>
          <p className={styles.serviceDesc}>Manicure toda semana (4x no mês) + 1 Pedicure. Economize 20%.</p>
        </div>
        <div className={styles.serviceAction}>
          <div className={styles.servicePrice}>R$ 149,90<span style={{ fontSize: '12px', color: 'var(--color-neutral-500)', fontWeight: 'normal' }}>/mês</span></div>
          <Button size="sm" variant="secondary" onClick={() => addToast({ type: 'success', title: 'Assinatura', message: 'Assinatura adicionada ao carrinho.' })}>Assinar</Button>
        </div>
      </div>

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

  const cats = typeof professional.categories === 'string' ? professional.categories.split(',') : (professional.categories || []);

  return (
    <div className={styles.page}>
      <div className={styles.coverSection}>
        <Image src={professional.coverImage || 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=2069&auto=format&fit=crop'} alt="Capa" fill className={styles.coverImage} unoptimized />
        <div className={styles.coverOverlay}></div>
      </div>
      
      <div className={styles.profileContainer}>
        <div className={styles.headerInfo}>
          <div className={styles.avatarContainer}>
            <Avatar name={professional.user?.name || professional.businessName} src={professional.avatar} size="xl" hasGoldBorder />
            {professional.verified && <div className={styles.verifiedBadge}>✓</div>}
          </div>
          
          <div className={styles.actions}>
            <button className={styles.actionBtn} onClick={() => toggleFavorite(professional.id)}>
              <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} className={isFavorite ? styles.favorited : ''} />
            </button>
            <button className={styles.actionBtn} onClick={handleShare}>
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
            { id: 'sobre', label: 'Sobre', content: <p>Mais detalhes sobre o espaço, horários, etc.</p> }
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
