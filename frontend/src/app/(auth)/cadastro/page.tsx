'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { User, Scissors, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuthStore } from '@/stores/auth.store';
import { useUIStore } from '@/stores/ui.store';
import { supabase } from '@/lib/supabase';
import { api } from '@/lib/api';
import styles from '../login/styles.module.css';

const registerSchema = z.object({
  name: z.string().min(3, 'O nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('E-mail inválido'),
  phone: z.string().min(10, 'Telefone é obrigatório e deve ter no mínimo 10 dígitos'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
  username: z.string().optional(),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function Cadastro() {
  const router = useRouter();
  const { register: registerUser } = useAuthStore();
  const { addToast } = useUIStore();
  const [profileType, setProfileType] = useState<'CLIENT' | 'PROFESSIONAL' | null>(null);
  
  const { register, handleSubmit, watch, setError, clearErrors, formState: { errors, isSubmitting } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema)
  });

  const watchUsername = watch('username');
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'unavailable'>('idle');

  React.useEffect(() => {
    if (profileType !== 'PROFESSIONAL' || !watchUsername) {
      setUsernameStatus('idle');
      return;
    }
    
    if (watchUsername.length < 3) {
      setUsernameStatus('idle');
      return;
    }

    const regex = /^[a-zA-Z0-9_]+$/;
    if (!regex.test(watchUsername)) {
      setError('username', { type: 'manual', message: 'Apenas letras, números e underlines.' });
      setUsernameStatus('unavailable');
      return;
    } else {
      clearErrors('username');
    }

    const delayDebounceFn = setTimeout(async () => {
      setUsernameStatus('checking');
      try {
        const res = await api.get(`/professionals/check-username?username=${watchUsername}`);
        if (res.data.available) {
          setUsernameStatus('available');
          clearErrors('username');
        } else {
          setUsernameStatus('unavailable');
          setError('username', { type: 'manual', message: 'Este username já está em uso.' });
        }
      } catch (e) {
        setUsernameStatus('idle');
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [watchUsername, profileType, setError, clearErrors]);

  const onSubmit = async (data: RegisterForm) => {
    if (!profileType) return;
    
    if (profileType === 'PROFESSIONAL') {
      if (!data.username || data.username.length < 3) {
        setError('username', { type: 'manual', message: 'Username é obrigatório para profissionais (min 3 chars).' });
        return;
      }
      if (usernameStatus === 'unavailable') {
        return;
      }
    }
    
    try {
      await registerUser({ ...data, role: profileType });
      addToast({
        type: 'success',
        title: 'Cadastro Realizado',
        message: 'Verifique seu e-mail para confirmar a conta!'
      });
      // They won't be redirected immediately if email confirmation is required by Supabase
      // The store handles the error if session is null
      if (profileType === 'PROFESSIONAL') {
        router.push('/painel');
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      addToast({ type: 'error', title: 'Aviso', message: err.message || 'Verifique seu e-mail.' });
    }
  };

  const handleGoogleLogin = async () => {
    try {
      localStorage.setItem('@belezza:pending_role', profileType || 'CLIENT');
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
    } catch {
      addToast({ type: 'error', title: 'Erro', message: 'Não foi possível conectar ao Google.' });
    }
  };

  if (!profileType) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Crie sua conta</h1>
        <p className={styles.subtitle}>Como você deseja usar a Belezza?</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)', marginTop: 'var(--spacing-4)' }}>
          <button 
            style={{ display: 'flex', alignItems: 'center', padding: 'var(--spacing-6)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--surface-border)', backgroundColor: 'var(--surface-card)', cursor: 'pointer', textAlign: 'left', transition: 'all var(--transition-normal)' }}
            onClick={() => setProfileType('CLIENT')}
            onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--color-primary-300)'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
            onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--surface-border)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-full)', backgroundColor: 'var(--color-primary-50)', color: 'var(--color-primary-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 'var(--spacing-4)' }}>
              <User size={24} strokeWidth={1.5} />
            </div>
            <div>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: 600, color: 'var(--color-neutral-900)' }}>Sou Cliente</h3>
              <p style={{ margin: 0, fontSize: '14px', color: 'var(--color-neutral-500)' }}>Quero agendar horários com profissionais</p>
            </div>
          </button>
          
          <button 
            style={{ display: 'flex', alignItems: 'center', padding: 'var(--spacing-6)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--surface-border)', backgroundColor: 'var(--surface-card)', cursor: 'pointer', textAlign: 'left', transition: 'all var(--transition-normal)' }}
            onClick={() => setProfileType('PROFESSIONAL')}
            onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--color-gold-500)'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
            onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--surface-border)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-full)', backgroundColor: 'rgba(201, 161, 92, 0.15)', color: 'var(--color-gold-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 'var(--spacing-4)' }}>
              <Scissors size={24} strokeWidth={1.5} />
            </div>
            <div>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: 600, color: 'var(--color-neutral-900)' }}>Sou Profissional</h3>
              <p style={{ margin: 0, fontSize: '14px', color: 'var(--color-neutral-500)' }}>Quero oferecer serviços e gerenciar minha agenda</p>
            </div>
          </button>
        </div>
        
        <p className={styles.registerLink}>
          Já tem conta? <Link href="/login">Entrar</Link>
        </p>
      </div>
    );
  }



  return (
    <div className={styles.container}>
      <button 
        style={{ color: 'var(--color-neutral-500)', fontSize: '13px', marginBottom: 'var(--spacing-4)', textAlign: 'left', cursor: 'pointer', border: 'none', background: 'none' }}
        onClick={() => setProfileType(null)}
      >
        ← Voltar
      </button>
      
      <h1 className={styles.title}>Cadastro de {profileType === 'CLIENT' ? 'Cliente' : 'Profissional'}</h1>
      <p className={styles.subtitle}>Preencha seus dados para criar a conta</p>
      
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <Input 
          label="Nome Completo" 
          placeholder="Ex: Maria Silva" 
          error={errors.name?.message}
          {...register('name')} 
        />
        <Input 
          label="E-mail" 
          type="email" 
          placeholder="seu@email.com" 
          error={errors.email?.message}
          {...register('email')} 
        />
        
        {profileType === 'PROFESSIONAL' && (
          <div style={{ position: 'relative' }}>
            <Input 
              label="Username (@)" 
              placeholder="ex: maria_nails" 
              error={errors.username?.message}
              {...register('username')} 
            />
            {usernameStatus === 'checking' && <span style={{ position: 'absolute', right: '12px', top: '38px', fontSize: '12px', color: 'var(--color-neutral-500)' }}>Verificando...</span>}
            {usernameStatus === 'available' && <Check size={18} style={{ position: 'absolute', right: '12px', top: '36px', color: 'var(--color-success-500)' }} />}
            {usernameStatus === 'unavailable' && <X size={18} style={{ position: 'absolute', right: '12px', top: '36px', color: 'var(--color-danger-500)' }} />}
          </div>
        )}

        <Input 
          label="Telefone / WhatsApp" 
          placeholder="(00) 00000-0000" 
          error={errors.phone?.message}
          {...register('phone')} 
        />
        <Input 
          label="Senha" 
          type="password" 
          placeholder="••••••" 
          error={errors.password?.message}
          {...register('password')} 
        />
        
        <Button type="submit" variant="primary" size="lg" isLoading={isSubmitting} className={styles.submitBtn}>
          Criar conta
        </Button>
      </form>
      
      <div className={styles.divider}>
        <span>ou</span>
      </div>
      
      <Button variant="secondary" size="lg" className={styles.googleBtn} onClick={handleGoogleLogin}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg"><g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)"><path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/><path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/><path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/><path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/></g></svg>
          <span>Cadastrar com Google</span>
        </div>
      </Button>
      
      <p className={styles.registerLink}>
        Já tem conta? <Link href="/login">Entrar</Link>
      </p>
    </div>
  );
}
