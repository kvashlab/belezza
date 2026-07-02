'use client';
import React, { useState } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { Button } from '@/components/ui/Button';
import { Image as ImageIcon, Camera } from 'lucide-react';
import styles from './styles.module.css';

type Tab = 'aparencia' | 'contato' | 'seguranca';

export default function PerfilProfissional() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<Tab>('aparencia');

  return (
    <div className={styles.container}>
      <h1 className="heading-2 title">Perfil Público</h1>
      
      <div className={styles.content}>
        <aside className={styles.sidebar}>
          <button 
            className={`${styles.tab} ${activeTab === 'aparencia' ? styles.active : ''}`}
            onClick={() => setActiveTab('aparencia')}
          >
            Aparência da Página
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'contato' ? styles.active : ''}`}
            onClick={() => setActiveTab('contato')}
          >
            Contato e Localização
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'seguranca' ? styles.active : ''}`}
            onClick={() => setActiveTab('seguranca')}
          >
            Segurança da Conta
          </button>
        </aside>

        <section className={styles.formSection}>
          {activeTab === 'aparencia' && (
            <form>
              <h2 className={styles.sectionTitle}>Aparência da Página</h2>
              
              <div className={styles.coverUpload}>
                <ImageIcon size={32} />
                <span>Clique para alterar a foto de capa</span>
                <span style={{ fontSize: '12px' }}>Tamanho recomendado: 1200x400px</span>
              </div>
              
              <div className={styles.avatarUpload} title="Alterar foto de perfil">
                <Camera size={28} />
              </div>

              <div className={styles.formGridFull} style={{ marginTop: 'var(--spacing-6)' }}>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Nome do Negócio ou Nome Profissional</label>
                  <input type="text" className={styles.input} defaultValue={user?.name || ''} placeholder="Ex: Studio Bela" />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Biografia (Bio)</label>
                  <textarea className={styles.textarea} placeholder="Conte um pouco sobre você, suas especialidades e seu espaço..." defaultValue="Especialista em cortes modernos e coloração." />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Categorias de Serviço Principais (Separadas por vírgula)</label>
                  <input type="text" className={styles.input} defaultValue="Cabelo, Maquiagem" />
                </div>
              </div>

              <div className={styles.formActions}>
                <Button variant="primary" type="button">Salvar Aparência</Button>
              </div>
            </form>
          )}

          {activeTab === 'contato' && (
            <form>
              <h2 className={styles.sectionTitle}>Contato e Localização</h2>
              
              <div className={styles.formGrid}>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>WhatsApp para Clientes</label>
                  <input type="text" className={styles.input} placeholder="(11) 99999-9999" defaultValue="(11) 98765-4321" />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Instagram (URL ou @)</label>
                  <input type="text" className={styles.input} placeholder="@seunegocio" defaultValue="@studio.bela" />
                </div>
              </div>

              <h3 style={{ fontSize: '16px', fontWeight: 600, marginTop: 'var(--spacing-6)', marginBottom: 'var(--spacing-4)' }}>Endereço do Espaço</h3>
              <div className={styles.formGrid}>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>CEP</label>
                  <input type="text" className={styles.input} placeholder="00000-000" defaultValue="01234-567" />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Cidade / Estado</label>
                  <input type="text" className={styles.input} placeholder="Ex: São Paulo, SP" defaultValue="São Paulo, SP" />
                </div>
                <div className={styles.inputGroup} style={{ gridColumn: '1 / -1' }}>
                  <label className={styles.label}>Rua e Número</label>
                  <input type="text" className={styles.input} placeholder="Ex: Av. Paulista, 1000" defaultValue="Rua Augusta, 1500" />
                </div>
                <div className={styles.inputGroup} style={{ gridColumn: '1 / -1' }}>
                  <label className={styles.label}>Complemento / Ponto de Referência</label>
                  <input type="text" className={styles.input} placeholder="Ex: Sala 402, Próximo ao metrô" defaultValue="Sala 22, Galeria Central" />
                </div>
              </div>

              <div className={styles.formActions}>
                <Button variant="primary" type="button">Salvar Contatos</Button>
              </div>
            </form>
          )}

          {activeTab === 'seguranca' && (
            <form>
              <h2 className={styles.sectionTitle}>Segurança da Conta</h2>
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
            </form>
          )}
        </section>
      </div>
    </div>
  );
}
