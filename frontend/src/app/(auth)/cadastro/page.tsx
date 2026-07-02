'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { User, Scissors } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useUIStore } from '@/stores/ui.store';
import styles from '../login/styles.module.css';

const registerSchema = z.object({
  name: z.string().min(3, 'O nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function Cadastro() {
  const router = useRouter();
  const { addToast } = useUIStore();
  const [profileType, setProfileType] = useState<'client' | 'professional' | null>(null);
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema)
  });

  const onSubmit = () => {
    addToast({
      type: 'success',
      title: 'Cadastro Realizado',
      message: 'Sua conta foi criada com sucesso!'
    });
    router.push('/painel');
  };

  if (!profileType) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Crie sua conta</h1>
        <p className={styles.subtitle}>Como você deseja usar a Belezza?</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)', marginTop: 'var(--spacing-4)' }}>
          <button 
            style={{ display: 'flex', alignItems: 'center', padding: 'var(--spacing-6)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--surface-border)', backgroundColor: 'var(--surface-card)', cursor: 'pointer', textAlign: 'left', transition: 'all var(--transition-normal)' }}
            onClick={() => setProfileType('client')}
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
            onClick={() => setProfileType('professional')}
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
        style={{ color: 'var(--color-neutral-500)', fontSize: '13px', marginBottom: 'var(--spacing-4)', textAlign: 'left' }}
        onClick={() => setProfileType(null)}
      >
        ← Voltar
      </button>
      
      <h1 className={styles.title}>Cadastro de {profileType === 'client' ? 'Cliente' : 'Profissional'}</h1>
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
      
      <p className={styles.registerLink}>
        Já tem conta? <Link href="/login">Entrar</Link>
      </p>
    </div>
  );
}
