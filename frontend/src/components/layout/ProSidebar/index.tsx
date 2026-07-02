'use client';
import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Calendar, Scissors, Users, DollarSign, User, LogOut, X } from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';
import styles from './styles.module.css';

interface ProSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/painel', icon: LayoutDashboard },
  { label: 'Agenda', href: '/painel/agenda', icon: Calendar },
  { label: 'Serviços', href: '/painel/servicos', icon: Scissors },
  { label: 'Clientes', href: '/painel/clientes', icon: Users },
  { label: 'Financeiro', href: '/painel/financeiro', icon: DollarSign },
  { label: 'Meu Perfil', href: '/painel/perfil', icon: User },
];

export const ProSidebar: React.FC<ProSidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  // Prevent scroll when sidebar is open on mobile
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      <div 
        className={`${styles.overlay} ${isOpen ? styles.open : ''}`} 
        onClick={onClose}
      />
      <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        <div className={styles.brand}>
          <Link href="/painel" className={styles.logo}>
            Belezza <span style={{ color: 'var(--color-neutral-900)' }}>Pro</span>
          </Link>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Fechar menu">
            <X size={24} />
          </button>
        </div>

        <nav className={styles.nav}>
          <div className={styles.navSection}>
            <p className={styles.navLabel}>Menu Principal</p>
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/painel' && pathname.startsWith(item.href));
              
              return (
                <Link 
                  key={item.href} 
                  href={item.href}
                  className={`${styles.navItem} ${isActive ? styles.active : ''}`}
                  onClick={() => {
                    if (window.innerWidth <= 1024) onClose();
                  }}
                >
                  <Icon size={20} className={styles.icon} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        <div className={styles.footer}>
          <div className={styles.profileSection}>
            <div className={styles.avatar}>
              {user?.name?.charAt(0) || 'P'}
            </div>
            <div className={styles.userInfo}>
              <span className={styles.userName}>{user?.name || 'Profissional'}</span>
              <span className={styles.userRole}>Plano Premium</span>
            </div>
          </div>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            <LogOut size={18} />
            <span>Sair da conta</span>
          </button>
        </div>
      </aside>
    </>
  );
};
