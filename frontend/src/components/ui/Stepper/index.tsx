import React from 'react';
import styles from './styles.module.css';

interface StepperProps {
  steps: { id: string; label: string }[];
  currentStepId: string;
}

export const Stepper: React.FC<StepperProps> = ({ steps, currentStepId }) => {
  const currentIndex = steps.findIndex(s => s.id === currentStepId);

  return (
    <div className={styles.stepper}>
      {steps.map((step, index) => {
        const isCompleted = index < currentIndex;
        const isActive = index === currentIndex;
        
        return (
          <React.Fragment key={step.id}>
            <div className={`${styles.step} ${isActive ? styles.active : ''} ${isCompleted ? styles.completed : ''}`}>
              <div className={styles.circle}>
                {isCompleted ? '✓' : index + 1}
              </div>
              <span className={styles.label}>{step.label}</span>
            </div>
            {index < steps.length - 1 && (
              <div className={`${styles.line} ${isCompleted ? styles.lineCompleted : ''}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
