'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Calendar, Scissors, Users, DollarSign, User, LogOut, X, Image as ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react';
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
  { label: 'Portfólio', href: '/painel/portfolio', icon: ImageIcon },
  { label: 'Clientes', href: '/painel/clientes', icon: Users },
  { label: 'Financeiro', href: '/painel/financeiro', icon: DollarSign },
  { label: 'Meu Perfil', href: '/painel/perfil', icon: User },
];

export const ProSidebar: React.FC<ProSidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [isMinimized, setIsMinimized] = useState(false);

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
      <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''} ${isMinimized ? styles.minimized : ''}`}>
        <div className={styles.brand}>
          <Link href="/painel" className={styles.logo}>
            {isMinimized ? 'B' : 'Belezza'} {(user as any)?.professionalProfile?.plan === 'PREMIUM' && !isMinimized && <span style={{ color: 'var(--color-neutral-900)' }}>Pro</span>}
          </Link>
          <div className={styles.brandActions}>
            <button className={styles.minimizeBtn} onClick={() => setIsMinimized(!isMinimized)} aria-label="Minimizar menu">
              {isMinimized ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>
            <button className={styles.closeBtn} onClick={onClose} aria-label="Fechar menu">
              <X size={24} />
            </button>
          </div>
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
              {(user as any)?.professionalProfile?.avatar ? (
                <img src={(user as any).professionalProfile.avatar} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
              ) : (
                (user as any)?.professionalProfile?.businessName?.charAt(0) || user?.name?.charAt(0) || 'P'
              )}
            </div>
            {!isMinimized && (
              <div className={styles.userInfo}>
                <span className={styles.userName}>{(user as any)?.professionalProfile?.businessName || user?.name || 'Profissional'}</span>
                <span className={styles.userRole}>
                  {(user as any)?.professionalProfile?.plan === 'PREMIUM' ? 'Plano Premium' : 'Plano Básico'}
                </span>
                {(user as any)?.professionalProfile?.plan !== 'PREMIUM' && (
                  <button 
                    style={{
                      marginTop: '4px',
                      padding: '4px 8px',
                      fontSize: '11px',
                      fontWeight: 600,
                      backgroundColor: 'var(--color-gold-500)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      width: 'fit-content'
                    }}
                    onClick={() => router.push('/painel/premium')}
                  >
                    Fazer Upgrade
                  </button>
                )}
              </div>
            )}
          </div>
          <button onClick={handleLogout} className={styles.logoutBtn} title="Sair da conta">
            <LogOut size={18} />
            {!isMinimized && <span>Sair da conta</span>}
          </button>
        </div>
      </aside>
    </>
  );
};
