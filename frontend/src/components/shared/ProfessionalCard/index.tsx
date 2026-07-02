import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Star } from 'lucide-react';
import { Professional } from '@/types/professional.types';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import styles from './styles.module.css';

interface ProfessionalCardProps {
  professional: Professional;
}

export const ProfessionalCard: React.FC<ProfessionalCardProps> = ({ professional }) => {
  return (
    <Link href={`/@${professional.username}`} className={styles.card}>
      <div className={styles.coverWrapper}>
        <Image 
          src={professional.coverImage} 
          alt={`Capa de ${professional.name}`} 
          fill
          className={styles.coverImage}
          unoptimized
        />
        <div className={styles.avatarWrapper}>
          <Avatar 
            src={professional.avatar} 
            name={professional.name} 
            size="lg" 
            hasGoldBorder 
          />
        </div>
        {professional.verified && (
          <div className={styles.verifiedBadge}>
            ✓ Verificado
          </div>
        )}
      </div>
      
      <div className={styles.content}>
        <div className={styles.header}>
          <h3 className={styles.name}>{professional.businessName || professional.name}</h3>
          <div className={styles.rating}>
            <Star size={14} className={styles.starIcon} fill="currentColor" />
            <span className={styles.ratingValue}>{professional.rating}</span>
            <span className={styles.reviewsCount}>({professional.reviewsCount})</span>
          </div>
        </div>
        
        <p className={styles.bio}>{professional.bio}</p>
        
        <div className={styles.categories}>
          {professional.categories.slice(0, 3).map((cat, i) => (
            <Badge key={i} size="sm" variant={cat as 'cabelo' | 'unhas' | 'maquiagem' | 'estetica' | 'sobrancelhas' | 'cilios' | 'massoterapia' | 'default'}>
              {cat.replace('_', ' ')}
            </Badge>
          ))}
          {professional.categories.length > 3 && (
            <Badge size="sm">+{professional.categories.length - 3}</Badge>
          )}
        </div>
        
        <div className={styles.footer}>
          <div className={styles.location}>
            <MapPin size={14} className={styles.locationIcon} />
            <span>{professional.address.neighborhood}, {professional.address.city}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};
