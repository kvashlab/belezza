import React from 'react';
import styles from './styles.module.css';
import { SearchX, FileQuestion, CalendarOff } from 'lucide-react';
import { Button } from '../Button';

interface EmptyStateProps {
  icon?: 'search' | 'document' | 'calendar';
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'document',
  title,
  description,
  actionText,
  onAction,
  className = ''
}) => {
  const IconComponent = {
    search: SearchX,
    document: FileQuestion,
    calendar: CalendarOff
  }[icon];

  return (
    <div className={`${styles.wrapper} ${className}`}>
      <div className={styles.iconWrapper}>
        <IconComponent size={32} className={styles.icon} />
      </div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
      {actionText && onAction && (
        <Button variant="secondary" onClick={onAction} className={styles.action}>
          {actionText}
        </Button>
      )}
    </div>
  );
};
