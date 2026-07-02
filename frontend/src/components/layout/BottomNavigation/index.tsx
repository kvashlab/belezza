'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Heart, Calendar, User, LayoutDashboard, Users, UserCircle } from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';
import styles from './styles.module.css';

export const BottomNavigation = () => {
  const { isAuthenticated, role } = useAuthStore();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Don't show bottom navigation on desktop, it's handled via CSS
  // Also, hide bottom navigation in specific full-screen flows like booking if needed, but for now we'll show it everywhere on mobile except login/register
  if (pathname.startsWith('/login') || pathname.startsWith('/cadastro')) return null;

  const getLinks = () => {
    if (!isAuthenticated) {
      return [
        { href: '/', label: 'Início', icon: Search },
        { href: '/explorar', label: 'Explorar', icon: Search },
        { href: '/login', label: 'Entrar', icon: UserCircle },
      ];
    }
    
    if (role === 'professional') {
      return [
        { href: '/painel', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/painel/agenda', label: 'Agenda', icon: Calendar },
        { href: '/painel/clientes', label: 'Clientes', icon: Users },
        { href: '/painel/generic', label: 'Conta', icon: User },
      ];
    }

    return [
      { href: '/explorar', label: 'Explorar', icon: Search },
      { href: '/favoritos', label: 'Favoritos', icon: Heart },
      { href: '/meus-agendamentos', label: 'Agenda', icon: Calendar },
      { href: '/perfil', label: 'Perfil', icon: User },
    ];
  };

  const links = getLinks();

  return (
    <nav className={styles.bottomNav}>
      {links.map((link) => {
        const isActive = pathname === link.href;
        const Icon = link.icon;
        
        return (
          <Link key={link.href} href={link.href} className={`${styles.navItem} ${isActive ? styles.active : ''}`}>
            <Icon size={24} />
            <span className={styles.label}>{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};
