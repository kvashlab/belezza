'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Calendar, Star, User, LogOut, Search } from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';
import styles from './styles.module.css';

const NAV_ITEMS = [
  { label: 'Visão Geral', href: '/dashboard', icon: Home },
  { label: 'Buscar Profissionais', href: '/explorar', icon: Search },
  { label: 'Agendamentos', href: '/meus-agendamentos', icon: Calendar },
  { label: 'Favoritos', href: '/favoritos', icon: Star },
  { label: 'Meu Perfil', href: '/perfil', icon: User },
];

export const ClientSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.profileSection}>
        <div className={styles.avatar}>
          <img 
            src={(user as any)?.clientProfile?.avatar || user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=64&h=64'} 
            alt="Avatar" 
            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} 
          />
        </div>
        <div className={styles.userInfo}>
          <span className={styles.userName}>{user?.name || 'Cliente'}</span>
          <span className={styles.userEmail}>{(user as any)?.email || ''}</span>
        </div>
      </div>

      <nav className={styles.nav}>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`${styles.navItem} ${isActive ? styles.active : ''}`}
            >
              <Icon size={20} className={styles.icon} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <button onClick={handleLogout} className={styles.logoutBtn}>
        <LogOut size={20} />
        <span>Sair da conta</span>
      </button>
    </aside>
  );
};
