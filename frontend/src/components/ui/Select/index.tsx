import React from 'react';
import { ChevronDown } from 'lucide-react';
import styles from './styles.module.css';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'options'> {
  label?: string;
  error?: string;
  options: SelectOption[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = '', label, error, options, id, ...props }, ref) => {
    const selectId = id || Math.random().toString(36).substring(7);

    return (
      <div className={`${styles.wrapper} ${className}`}>
        {label && <label htmlFor={selectId} className={styles.label}>{label}</label>}
        <div className={styles.selectContainer}>
          <select
            id={selectId}
            ref={ref}
            className={`${styles.select} ${error ? styles.selectError : ''}`}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className={styles.icon} size={20} />
        </div>
        {error && <span className={styles.errorMessage}>{error}</span>}
      </div>
    );
  }
);

Select.displayName = 'Select';
