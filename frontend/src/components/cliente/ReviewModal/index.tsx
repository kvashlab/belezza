import React, { useState } from 'react';
import { Star, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => void;
  isSubmitting?: boolean;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({ isOpen, onClose, onSubmit, isSubmitting }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return; // Prevent submitting 0 stars if required
    onSubmit(rating, comment);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '24px'
    }}>
      <div style={{
        backgroundColor: 'var(--surface-card)',
        borderRadius: 'var(--radius-xl)',
        padding: '32px',
        width: '100%',
        maxWidth: '500px',
        boxShadow: 'var(--shadow-lg)',
        position: 'relative'
      }}>
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '24px',
            right: '24px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--color-neutral-500)'
          }}
        >
          <X size={24} />
        </button>

        <h2 style={{ fontSize: '24px', fontWeight: 600, color: 'var(--color-neutral-900)', marginBottom: '8px' }}>
          Avalie seu atendimento
        </h2>
        <p style={{ color: 'var(--color-neutral-600)', marginBottom: '24px' }}>
          Sua opinião é muito importante para manter a qualidade dos nossos profissionais.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-neutral-700)' }}>Deixe sua nota</span>
            <div style={{ display: 'flex', gap: '8px' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    transition: 'transform 0.2s'
                  }}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.9)'}
                  onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                >
                  <Star 
                    size={40} 
                    fill={(hoverRating || rating) >= star ? 'var(--color-gold-500)' : 'none'}
                    color={(hoverRating || rating) >= star ? 'var(--color-gold-500)' : 'var(--color-neutral-300)'}
                    style={{ transition: 'all 0.2s' }}
                  />
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-neutral-700)' }}>
              Comentário <span style={{ color: 'var(--color-neutral-400)', fontWeight: 400 }}>(opcional)</span>
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Conte como foi sua experiência..."
              rows={4}
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--surface-border)',
                backgroundColor: 'var(--color-neutral-50)',
                outline: 'none',
                resize: 'none',
                fontFamily: 'inherit',
                fontSize: '15px'
              }}
            />
          </div>

          <Button 
            type="submit" 
            variant="primary" 
            size="lg" 
            isLoading={isSubmitting}
            disabled={rating === 0 || isSubmitting}
            style={{ width: '100%', marginTop: '8px' }}
          >
            Enviar Avaliação
          </Button>
        </form>
      </div>
    </div>
  );
};
