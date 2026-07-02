'use client';
import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { useUIStore } from '@/stores/ui.store';
import { Button } from '@/components/ui/Button';
import { Image as ImageIcon, Camera } from 'lucide-react';
import styles from './styles.module.css';

type Tab = 'aparencia' | 'contato' | 'horarios' | 'seguranca';

export default function PerfilProfissional() {
  const { user } = useAuthStore();
  const { addToast } = useUIStore();
  const [activeTab, setActiveTab] = useState<Tab>('aparencia');
  const [profileData, setProfileData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        const token = localStorage.getItem('@belezza:token');
        const res = await fetch('http://localhost:3333/api/professionals/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setProfileData(data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    if ((user as any)?.role === 'professional') {
      loadProfile();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const handleUpdateAparencia = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const form = e.target as HTMLFormElement;
    
    try {
      const token = localStorage.getItem('@belezza:token');
      const res = await fetch('http://localhost:3333/api/professionals/me', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({
          businessName: (form.elements.namedItem('businessName') as HTMLInputElement).value,
          bio: (form.elements.namedItem('bio') as HTMLTextAreaElement).value,
          categories: (form.elements.namedItem('categories') as HTMLInputElement).value,
        })
      });

      if (!res.ok) throw new Error('Erro ao salvar');
      addToast({ type: 'success', title: 'Perfil atualizado com sucesso!' });
    } catch (e) {
      addToast({ type: 'error', title: 'Falha ao atualizar o perfil' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateContato = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const form = e.target as HTMLFormElement;
    
    try {
      const token = localStorage.getItem('@belezza:token');
      const res = await fetch('http://localhost:3333/api/professionals/me', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({
          socialLinks: JSON.stringify({
            whatsapp: (form.elements.namedItem('whatsapp') as HTMLInputElement).value,
            instagram: (form.elements.namedItem('instagram') as HTMLInputElement).value,
          }),
          city: (form.elements.namedItem('city') as HTMLInputElement).value,
          neighborhood: (form.elements.namedItem('neighborhood') as HTMLInputElement).value,
        })
      });

      if (!res.ok) throw new Error('Erro ao salvar');
      addToast({ type: 'success', title: 'Contato atualizado com sucesso!' });
    } catch (e) {
      addToast({ type: 'error', title: 'Falha ao atualizar contato' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdatePreferencias = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const form = e.target as HTMLFormElement;
    
    try {
      const token = localStorage.getItem('@belezza:token');
      const res = await fetch('http://localhost:3333/api/professionals/me', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({
          requireDeposit: (form.elements.namedItem('requireDeposit') as HTMLInputElement).checked
        })
      });

      if (!res.ok) throw new Error('Erro ao salvar');
      addToast({ type: 'success', title: 'Preferências atualizadas com sucesso!' });
      
      // Update local state to reflect change
      setProfileData({ ...profileData, requireDeposit: (form.elements.namedItem('requireDeposit') as HTMLInputElement).checked });
    } catch (e) {
      addToast({ type: 'error', title: 'Falha ao atualizar preferências' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className={styles.container}>Carregando perfil...</div>;

  const socialLinks = profileData?.socialLinks ? JSON.parse(profileData.socialLinks) : {};

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
            className={`${styles.tab} ${activeTab === 'horarios' ? styles.active : ''}`}
            onClick={() => setActiveTab('horarios')}
          >
            Horários de Atendimento
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
            <form onSubmit={handleUpdateAparencia}>
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
                  <input name="businessName" type="text" className={styles.input} defaultValue={profileData?.businessName || user?.name || ''} placeholder="Ex: Studio Bela" />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Biografia (Bio)</label>
                  <textarea name="bio" className={styles.textarea} placeholder="Conte um pouco sobre você, suas especialidades e seu espaço..." defaultValue={profileData?.bio || ''} />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Categorias de Serviço Principais (Separadas por vírgula)</label>
                  <input name="categories" type="text" className={styles.input} defaultValue={profileData?.categories || ''} />
                </div>
              </div>

              <div className={styles.formActions}>
                <Button variant="primary" type="submit" isLoading={isSaving}>Salvar Aparência</Button>
              </div>
            </form>
          )}

          {activeTab === 'contato' && (
            <form onSubmit={handleUpdateContato}>
              <h2 className={styles.sectionTitle}>Contato e Localização</h2>
              
              <div className={styles.formGrid}>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>WhatsApp para Clientes</label>
                  <input name="whatsapp" type="text" className={styles.input} placeholder="(11) 99999-9999" defaultValue={socialLinks?.whatsapp || ''} />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Instagram (URL ou @)</label>
                  <input name="instagram" type="text" className={styles.input} placeholder="@seunegocio" defaultValue={socialLinks?.instagram || ''} />
                </div>
              </div>

              <h3 style={{ fontSize: '16px', fontWeight: 600, marginTop: 'var(--spacing-6)', marginBottom: 'var(--spacing-4)' }}>Endereço do Espaço</h3>
              <div className={styles.formGrid}>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Cidade / Estado</label>
                  <input name="city" type="text" className={styles.input} placeholder="Ex: São Paulo, SP" defaultValue={profileData?.city || ''} />
                </div>
                <div className={styles.inputGroup} style={{ gridColumn: '1 / -1' }}>
                  <label className={styles.label}>Rua e Número</label>
                  <input name="neighborhood" type="text" className={styles.input} placeholder="Ex: Av. Paulista, 1000" defaultValue={profileData?.neighborhood || ''} />
                </div>
              </div>

              <div className={styles.formActions}>
                <Button variant="primary" type="submit" isLoading={isSaving}>Salvar Contatos</Button>
              </div>
            </form>
          )}

          {activeTab === 'horarios' && (
            <form>
              <h2 className={styles.sectionTitle}>Horários de Atendimento</h2>
              <div style={{ display: 'grid', gap: '16px' }}>
                {['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'].map((day, i) => {
                  const hour = profileData?.workingHours?.find((h: any) => h.dayOfWeek === i) || { isOpen: false, startTime: '09:00', endTime: '18:00' };
                  return (
                    <div key={i} style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                      <div style={{ width: '100px', fontWeight: 500 }}>{day}</div>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <input type="checkbox" defaultChecked={hour.isOpen} />
                        Aberto
                      </label>
                      <input type="time" defaultValue={hour.startTime} className={styles.input} style={{ width: '120px' }} />
                      <span>até</span>
                      <input type="time" defaultValue={hour.endTime} className={styles.input} style={{ width: '120px' }} />
                    </div>
                  );
                })}
              </div>
              <div className={styles.formActions} style={{ marginTop: '24px' }}>
                <Button variant="primary" type="button" onClick={() => addToast({ type: 'success', title: 'Horários atualizados!' })}>Salvar Horários</Button>
              </div>
            </form>
          )}

          {activeTab === 'seguranca' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              <form onSubmit={handleUpdatePreferencias}>
                <h2 className={styles.sectionTitle}>Preferências de Agendamento</h2>
                <div style={{ backgroundColor: 'var(--surface-card)', padding: 'var(--spacing-4)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--surface-border)' }}>
                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      name="requireDeposit" 
                      defaultChecked={profileData?.requireDeposit} 
                      style={{ marginTop: '4px', width: '18px', height: '18px', accentColor: 'var(--color-primary-600)' }} 
                    />
                    <div>
                      <strong style={{ display: 'block', color: 'var(--color-neutral-900)', marginBottom: '4px' }}>Exigir Sinal (Pix) no Agendamento</strong>
                      <span style={{ fontSize: '13px', color: 'var(--color-neutral-500)', lineHeight: '1.4' }}>
                        Ao ativar esta opção, o cliente será obrigado a passar por uma etapa de pagamento simulado via Pix (30% do valor do serviço) para confirmar o horário, ajudando a evitar faltas (no-shows).
                      </span>
                    </div>
                  </label>
                </div>
                <div className={styles.formActions} style={{ marginTop: '16px' }}>
                  <Button variant="primary" type="submit" isLoading={isSaving}>Salvar Preferências</Button>
                </div>
              </form>

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
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
