'use client';
import React from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import styles from './styles.module.css';

export type AppointmentStatus = 'confirmed' | 'pending' | 'cancelled' | 'completed';

interface AppointmentCardProps {
  id: string;
  professionalName: string;
  professionalPhoto?: string;
  serviceName: string;
  date: string; // ex: "12 de Agosto"
  time: string; // ex: "14:00"
  price: string; // ex: "R$ 80,00"
  location: string;
  status: AppointmentStatus;
  onCancel?: (id: string) => void;
  onReschedule?: (id: string) => void;
  onReview?: (id: string) => void;
  onRebook?: (id: string) => void;
}

export const AppointmentCard: React.FC<AppointmentCardProps> = ({
  id,
  professionalName,
  professionalPhoto,
  serviceName,
  date,
  time,
  price,
  location,
  status,
  onCancel,
  onReschedule,
  onReview,
  onRebook
}) => {
  const getStatusBadge = () => {
    switch (status) {
      case 'confirmed':
        return <Badge variant="success">Confirmado</Badge>;
      case 'pending':
        return <Badge variant="warning">Pendente</Badge>;
      case 'cancelled':
        return <Badge variant="danger">Cancelado</Badge>;
      case 'completed':
        return <Badge variant="info">Concluído</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.professionalInfo}>
          {professionalPhoto ? (
            <img src={professionalPhoto} alt={professionalName} className={styles.avatar} />
          ) : (
            <div className={styles.avatar} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-primary-100)', color: 'var(--color-primary-700)', fontWeight: 'bold' }}>
              {professionalName.charAt(0)}
            </div>
          )}
          <div className={styles.proDetails}>
            <span className={styles.proName}>{professionalName}</span>
            <span className={styles.serviceName}>{serviceName} • {price}</span>
          </div>
        </div>
        {getStatusBadge()}
      </div>

      <div className={styles.appointmentDetails}>
        <div className={styles.detailRow}>
          <Calendar size={16} color="var(--color-primary-600)" />
          <span>{date}</span>
        </div>
        <div className={styles.detailRow}>
          <Clock size={16} color="var(--color-primary-600)" />
          <span>{time}</span>
        </div>
        <div className={styles.detailRow}>
          <MapPin size={16} color="var(--color-primary-600)" />
          <span>{location}</span>
        </div>
      </div>

      <div className={styles.actions}>
        {(status === 'confirmed' || status === 'pending') && (
          <>
            <div className={styles.actionBtn}>
              <Button variant="secondary" onClick={() => onCancel?.(id)}>
                Cancelar
              </Button>
            </div>
            <div className={styles.actionBtn}>
              <Button variant="primary" onClick={() => onReschedule?.(id)}>
                Reagendar
              </Button>
            </div>
          </>
        )}
        {status === 'completed' && (
          <>
            <div className={styles.actionBtn}>
              <Button variant="secondary" onClick={() => onReview?.(id)}>
                Avaliar
              </Button>
            </div>
            <div className={styles.actionBtn}>
              <Button variant="primary" onClick={() => onRebook?.(id)}>
                Agendar Novamente
              </Button>
            </div>
          </>
        )}
        {status === 'cancelled' && (
          <div className={styles.actionBtn}>
            <Button variant="primary" onClick={() => onRebook?.(id)}>
              Agendar Novamente
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
