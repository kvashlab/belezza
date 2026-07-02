'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth.store';
import { Spinner } from '../ui/Spinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRole?: 'client' | 'professional';
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRole }) => {
  const router = useRouter();
  const { isAuthenticated, role } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Simulando uma verificação rápida de auth no client-side
    const checkAuth = () => {
      if (!isAuthenticated) {
        router.replace('/login');
      } else if (allowedRole && role !== allowedRole) {
        // Redireciona para o lugar certo dependendo da role
        router.replace(role === 'professional' ? '/painel' : '/dashboard');
      } else {
        setIsChecking(false);
      }
    };
    
    checkAuth();
  }, [isAuthenticated, role, allowedRole, router]);

  if (isChecking) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100%' }}>
        <Spinner size="lg" />
      </div>
    );
  }

  return <>{children}</>;
};
