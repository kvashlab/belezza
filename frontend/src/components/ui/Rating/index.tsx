import React from 'react';
import { Star } from 'lucide-react';
import styles from './styles.module.css';

export interface RatingProps {
  value: number;
  max?: number;
  readOnly?: boolean;
  onChange?: (value: number) => void;
  size?: 'sm' | 'md' | 'lg';
}

export const Rating: React.FC<RatingProps> = ({ 
  value, 
  max = 5, 
  readOnly = true, 
  onChange,
  size = 'md' 
}) => {
  return (
    <div className={`${styles.rating} ${styles[size]} ${readOnly ? styles.readOnly : ''}`}>
      {Array.from({ length: max }).map((_, i) => {
        const starValue = i + 1;
        const isFilled = starValue <= value;
        return (
          <button
            key={i}
            type="button"
            className={`${styles.star} ${isFilled ? styles.filled : ''}`}
            onClick={() => !readOnly && onChange?.(starValue)}
            disabled={readOnly}
            aria-label={`Avaliar com ${starValue} estrelas`}
          >
            <Star 
              size={size === 'sm' ? 14 : size === 'md' ? 18 : 24} 
              fill={isFilled ? 'currentColor' : 'none'} 
            />
          </button>
        );
      })}
    </div>
  );
};
