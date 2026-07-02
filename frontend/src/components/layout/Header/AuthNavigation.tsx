'use client';
import React from 'react';
import Link from 'next/link';
import { Button } from '../../ui/Button';
import { useAuthStore } from '@/stores/auth.store';
import styles from './styles.module.css';

export const AuthNavigation = () => {
  const { isAuthenticated, user, role } = useAuthStore();

  return (
    <nav className={styles.nav}>
      {!isAuthenticated ? (
        <>
          <Link href="/cadastro" className={styles.navLink}>
            Sou Profissional
          </Link>
          <Link href="/login">
            <Button variant="primary" size="sm">Entrar</Button>
          </Link>
        </>
      ) : (
        <Link href={role === 'professional' ? '/painel' : '/dashboard'} className={styles.navLink}>
          Olá, {user?.name.split(' ')[0]}
        </Link>
      )}
    </nav>
  );
};
