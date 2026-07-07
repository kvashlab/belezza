'use client';
import React from 'react';
import Link from 'next/link';
import { Button } from '../../ui/Button';
import { Avatar } from '../../ui/Avatar';
import { useAuthStore } from '@/stores/auth.store';
import styles from './styles.module.css';

export const AuthNavigation = () => {
  const { isAuthenticated, user, role } = useAuthStore();

  return (
    <nav className={styles.nav}>
      {!isAuthenticated ? (
        <>
          <Link href="/cadastro" className={styles.professionalLink}>
            Sou Profissional
          </Link>
          <Link href="/login">
            <Button variant="primary" size="md" className={styles.loginBtn}>Entrar</Button>
          </Link>
        </>
      ) : (
        <Link href={role === 'professional' ? '/painel' : '/dashboard'} className={styles.userProfile}>
          <Avatar 
            src={user?.avatar} 
            name={user?.name || 'User'} 
            size="sm" 
          />
          <span className={styles.userName}>Olá, {user?.name?.split(' ')[0] || 'Usuário'}</span>
        </Link>
      )}
    </nav>
  );
};
