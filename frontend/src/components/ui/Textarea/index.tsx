import React from 'react';
import styles from './styles.module.css';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = '', label, error, id, ...props }, ref) => {
    const textareaId = id || Math.random().toString(36).substring(7);

    return (
      <div className={`${styles.wrapper} ${className}`}>
        {label && <label htmlFor={textareaId} className={styles.label}>{label}</label>}
        <textarea
          id={textareaId}
          ref={ref}
          className={`${styles.textarea} ${error ? styles.textareaError : ''}`}
          {...props}
        />
        {error && <span className={styles.errorMessage}>{error}</span>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
