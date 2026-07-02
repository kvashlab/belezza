'use client';
import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { useUIStore, ToastMessage } from '@/stores/ui.store';
import styles from './styles.module.css';

export const ToastContainer: React.FC = () => {
  const toasts = useUIStore(state => state.toasts);
  const removeToast = useUIStore(state => state.removeToast);

  return (
    <div className={styles.toastContainer} aria-live="polite">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
};

const ToastItem = ({ toast, onClose }: { toast: ToastMessage; onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, toast.duration || 5000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  const Icon = toast.type === 'success' ? CheckCircle : toast.type === 'error' ? AlertCircle : Info;

  return (
    <div className={`${styles.toast} ${styles[toast.type]}`}>
      <Icon size={24} className={styles.icon} />
      <div className={styles.content}>
        <h4 className={styles.title}>{toast.title}</h4>
        {toast.message && <p className={styles.message}>{toast.message}</p>}
      </div>
      <button className={styles.closeBtn} onClick={onClose} aria-label="Fechar notificação">
        <X size={20} />
      </button>
    </div>
  );
};
