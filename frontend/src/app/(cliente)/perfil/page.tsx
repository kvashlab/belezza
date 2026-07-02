'use client';
import React, { useState } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { Button } from '@/components/ui/Button';
import { User, Camera } from 'lucide-react';
import styles from './styles.module.css';

type Tab = 'dados_pessoais' | 'enderecos' | 'seguranca';

export default function Perfil() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<Tab>('dados_pessoais');

  // Mock form state
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: (user && 'email' in user ? user.email : '') || '',
    phone: '(11) 99999-9999',
    cpf: '123.456.789-00'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate save
    alert('Perfil atualizado com sucesso!');
  };

  return (
    <div className={styles.profileContainer}>
      <h1 className="heading-2 title">Meu Perfil</h1>
      
      <div className={styles.content}>
        <aside className={styles.sidebar}>
          <button 
            className={`${styles.tab} ${activeTab === 'dados_pessoais' ? styles.active : ''}`}
            onClick={() => setActiveTab('dados_pessoais')}
          >
            Dados Pessoais
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'enderecos' ? styles.active : ''}`}
            onClick={() => setActiveTab('enderecos')}
          >
            Endereços
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'seguranca' ? styles.active : ''}`}
            onClick={() => setActiveTab('seguranca')}
          >
            Segurança
          </button>
        </aside>

        <section className={styles.formSection}>
          {activeTab === 'dados_pessoais' && (
            <form onSubmit={handleSubmit}>
              <h2 className={styles.sectionTitle}>Dados Pessoais</h2>
              
              <div className={styles.avatarSection}>
                <div className={styles.avatar}>
                  <User size={40} />
                </div>
                <div className={styles.avatarActions}>
                  <Button variant="secondary" type="button" leftIcon={<Camera size={18} />}>
                    Alterar Foto
                  </Button>
                  <Button variant="outline" type="button" style={{ color: 'var(--color-danger)', borderColor: 'var(--color-danger)' }}>
                    Remover
                  </Button>
                </div>
              </div>

              <div className={styles.formGrid}>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Nome Completo</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} className={styles.input} />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>E-mail</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} className={styles.input} />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Telefone / WhatsApp</label>
                  <input type="text" name="phone" value={formData.phone} onChange={handleChange} className={styles.input} />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>CPF</label>
                  <input type="text" name="cpf" value={formData.cpf} onChange={handleChange} className={styles.input} disabled />
                </div>
              </div>

              <div className={styles.formActions}>
                <Button variant="secondary" type="button">Cancelar</Button>
                <Button variant="primary" type="submit">Salvar Alterações</Button>
              </div>
            </form>
          )}

          {activeTab === 'enderecos' && (
            <div>
              <h2 className={styles.sectionTitle}>Meus Endereços</h2>
              <p style={{ color: 'var(--color-neutral-500)', marginBottom: 'var(--spacing-6)' }}>
                Cadastre seus endereços para encontrar profissionais próximos a você.
              </p>
              <Button variant="secondary">+ Adicionar Novo Endereço</Button>
            </div>
          )}

          {activeTab === 'seguranca' && (
            <div>
              <h2 className={styles.sectionTitle}>Segurança</h2>
              <div className={styles.formGrid}>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Senha Atual</label>
                  <input type="password" placeholder="••••••••" className={styles.input} />
                </div>
                <div className={styles.inputGroup}></div>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Nova Senha</label>
                  <input type="password" placeholder="••••••••" className={styles.input} />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Confirmar Nova Senha</label>
                  <input type="password" placeholder="••••••••" className={styles.input} />
                </div>
              </div>
              <div className={styles.formActions}>
                <Button variant="primary" type="button">Atualizar Senha</Button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
