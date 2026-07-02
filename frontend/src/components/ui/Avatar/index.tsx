import React from 'react';
import Image from 'next/image';
import styles from './styles.module.css';
import { getInitials } from '@/utils/getInitials';

export interface AvatarProps {
  src?: string | null;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  hasGoldBorder?: boolean;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name,
  size = 'md',
  hasGoldBorder = false,
  className = '',
}) => {
  const initials = getInitials(name);
  
  return (
    <div 
      className={`${styles.avatar} ${styles[size]} ${hasGoldBorder ? styles.goldBorder : ''} ${className}`}
      aria-label={name}
      title={name}
    >
      {src ? (
        <Image 
          src={src} 
          alt={name} 
          fill 
          sizes="(max-width: 768px) 100vw, 33vw"
          className={styles.image} 
          unoptimized={src.includes('pravatar')} 
        />
      ) : (
        <span className={styles.initials}>{initials}</span>
      )}
    </div>
  );
};
