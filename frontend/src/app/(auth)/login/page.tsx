'use client';
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuthStore } from '@/stores/auth.store';
import { useUIStore } from '@/stores/ui.store';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { supabase } from '@/lib/supabase';
import styles from './styles.module.css';

const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const router = useRouter();
  const { login } = useAuthStore();
  const { addToast } = useUIStore();
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      await login({ email: data.email, password: data.password });
      addToast({ type: 'success', title: 'Login realizado com sucesso!' });
      
      const { role } = useAuthStore.getState();
      if (role === 'professional') {
        router.push('/painel');
      } else {
        router.push('/dashboard');
      }
    } catch {
      addToast({
        type: 'error',
        title: 'Erro de Login',
        message: 'E-mail ou senha inválidos.'
      });
    }
  };

  const handleGoogleLogin = async () => {
    try {
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

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Bem-vindo de volta</h1>
      <p className={styles.subtitle}>Acesse sua conta para continuar</p>
      
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <Input 
          label="E-mail" 
          type="email" 
          placeholder="seu@email.com" 
          error={errors.email?.message}
          {...register('email')} 
        />
        <Input 
          label="Senha" 
          type="password" 
          placeholder="••••••" 
          error={errors.password?.message}
          {...register('password')} 
        />
        
        <div className={styles.forgotPassword}>
          <button type="button" onClick={() => addToast({ type: 'info', title: 'Recuperação', message: 'Instruções enviadas.' })}>
            Esqueci minha senha
          </button>
        </div>
        
        <Button type="submit" variant="primary" size="lg" isLoading={isSubmitting} className={styles.submitBtn}>
          Entrar
        </Button>
      </form>
      
      <div className={styles.divider}>
        <span>ou</span>
      </div>
      
      <Button variant="secondary" size="lg" className={styles.googleBtn} onClick={handleGoogleLogin}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg"><g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)"><path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/><path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/><path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/><path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/></g></svg>
          <span>Entrar com Google</span>
        </div>
      </Button>
      
      <p className={styles.registerLink}>
        Ainda não tem conta? <Link href="/cadastro">Cadastre-se</Link>
      </p>
    </div>
  );
}
