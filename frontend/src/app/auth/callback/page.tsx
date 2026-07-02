'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/auth.store';
import { useUIStore } from '@/stores/ui.store';

export default function AuthCallback() {
  const router = useRouter();
  const { googleLogin } = useAuthStore();
  const { addToast } = useUIStore();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        if (session && session.user) {
          const { email, user_metadata } = session.user;
          const name = user_metadata?.full_name || email?.split('@')[0];
          
          const pendingRole = localStorage.getItem('@belezza:pending_role') || 'CLIENT';
          localStorage.removeItem('@belezza:pending_role');
          
          // Try to create/login via our custom backend
          await googleLogin({ email, name, role: pendingRole });
          
          addToast({ type: 'success', title: 'Login realizado', message: 'Bem-vindo(a) via Google!' });
          
          const { role } = useAuthStore.getState();
          if (role === 'professional') {
            router.push('/painel');
          } else {
            router.push('/dashboard');
          }
        } else {
          router.push('/login');
        }
      } catch (err) {
        console.error(err);
        addToast({ type: 'error', title: 'Erro', message: 'Falha ao sincronizar com Google.' });
        router.push('/login');
      }
    };

    handleAuthCallback();
  }, [router, googleLogin, addToast]);

  return (
    <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center' }}>
      <p style={{ color: 'var(--color-neutral-500)' }}>Autenticando com Google...</p>
    </div>
  );
}
