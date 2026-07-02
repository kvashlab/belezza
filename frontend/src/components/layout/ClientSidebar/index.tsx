'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Calendar, Heart, User, LogOut } from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';
import styles from './styles.module.css';

const NAV_ITEMS = [
  { label: 'Visão Geral', href: '/dashboard', icon: Home },
  { label: 'Agendamentos', href: '/meus-agendamentos', icon: Calendar },
  { label: 'Favoritos', href: '/favoritos', icon: Heart },
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
          <User size={24} />
        </div>
        <div className={styles.userInfo}>
          <span className={styles.userName}>{user?.name || 'Cliente Premium'}</span>
          <span className={styles.userEmail}>{user && 'email' in user ? user.email : ''}</span>
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
