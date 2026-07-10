'use client';
import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { useUIStore } from '@/stores/ui.store';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Image as ImageIcon, Camera, Check, X, Link as LinkIcon, Share2 } from 'lucide-react';
import { api } from '@/lib/api';
import { VALID_CATEGORIES } from '@/constants/categories';
import styles from './styles.module.css';

type Tab = 'aparencia' | 'contato' | 'horarios' | 'seguranca';

export default function PerfilProfissional() {
  const { user, role, isAuthenticated } = useAuthStore();
  const { addToast } = useUIStore();
  const [activeTab, setActiveTab] = useState<Tab>('aparencia');
  const [profileData, setProfileData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Username states
  const [isChangingUsername, setIsChangingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'unavailable'>('idle');
  const [isSavingUsername, setIsSavingUsername] = useState(false);

  // Image previews
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  
  // Categories
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const loadProfile = async () => {
    try {
      const response = await api.get('/professionals/me');
      setProfileData(response.data);
      if (response.data.avatar) setAvatarPreview(response.data.avatar);
      if (response.data.coverImage) setCoverPreview(response.data.coverImage);
      if (response.data.categories) {
        try {
          const parsed = JSON.parse(response.data.categories);
          setSelectedCategories(Array.isArray(parsed) ? parsed : [parsed]);
        } catch {
          setSelectedCategories(response.data.categories.split(',').map((c:string) => c.trim()));
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  // Use `role` from the store (already normalized to lowercase) — fixes case mismatch bug
  useEffect(() => {
    if (isAuthenticated && role === 'professional') {
      loadProfile();
    } else if (!isAuthenticated) {
      setIsLoading(false);
    }
  }, [isAuthenticated, role]);

  useEffect(() => {
    if (!newUsername || newUsername.length < 3) {
      setUsernameStatus('idle');
      return;
    }
    const delayDebounceFn = setTimeout(async () => {
      setUsernameStatus('checking');
      try {
        const res = await api.get(`/professionals/check-username?username=${newUsername}`);
        if (res.data.available) {
          setUsernameStatus('available');
        } else {
          setUsernameStatus('unavailable');
        }
      } catch (e) {
        setUsernameStatus('idle');
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [newUsername]);

  const handleChangeUsername = async (e: React.FormEvent) => {
    e.preventDefault();
    if (usernameStatus !== 'available') return;
    setIsSavingUsername(true);
    try {
      await api.put('/professionals/me/username', { newUsername });
      addToast({ type: 'success', title: 'Username atualizado com sucesso!' });
      setNewUsername('');
      setIsChangingUsername(false);
      await loadProfile();
    } catch (error: any) {
      addToast({ type: 'error', title: 'Erro', message: error.response?.data?.error || 'Falha ao atualizar username' });
    } finally {
      setIsSavingUsername(false);
    }
  };

  const handleUpdateAparencia = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const form = e.target as HTMLFormElement;
    
    try {
      const formData = new FormData();
      formData.append('businessName', (form.elements.namedItem('businessName') as HTMLInputElement).value);
      formData.append('bio', (form.elements.namedItem('bio') as HTMLTextAreaElement).value);
      formData.append('categories', JSON.stringify(selectedCategories));
      
      const avatarInput = form.elements.namedItem('avatar') as HTMLInputElement;
      if (avatarInput && avatarInput.files && avatarInput.files[0]) {
        formData.append('avatar', avatarInput.files[0]);
      }

      const coverInput = form.elements.namedItem('coverImage') as HTMLInputElement;
      if (coverInput && coverInput.files && coverInput.files[0]) {
        formData.append('coverImage', coverInput.files[0]);
      }

      await api.put('/professionals/me', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      addToast({ type: 'success', title: 'Perfil atualizado com sucesso!' });
      await loadProfile();
      await useAuthStore.getState().fetchMe();
    } catch (err: any) {
      const message = err.response?.data?.error || err.message || 'Erro desconhecido ao salvar perfil.';
      addToast({ type: 'error', title: 'Falha ao atualizar o perfil', message });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleUpdateContato = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const form = e.target as HTMLFormElement;
    
    try {
      await api.put('/professionals/me', {
        socialLinks: JSON.stringify({
          whatsapp: (form.elements.namedItem('whatsapp') as HTMLInputElement).value,
          instagram: (form.elements.namedItem('instagram') as HTMLInputElement).value,
        }),
        city: (form.elements.namedItem('city') as HTMLInputElement).value,
        neighborhood: (form.elements.namedItem('neighborhood') as HTMLInputElement).value,
      });

      addToast({ type: 'success', title: 'Contato atualizado com sucesso!' });
      await loadProfile();
      await useAuthStore.getState().fetchMe();
    } catch {
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
      const requireDeposit = (form.elements.namedItem('requireDeposit') as HTMLInputElement).checked;
      await api.put('/professionals/me', {
        requireDeposit
      });

      addToast({ type: 'success', title: 'Preferências atualizadas com sucesso!' });
      
      // Update local state to reflect change
      setProfileData({ ...profileData, requireDeposit });
    } catch {
      addToast({ type: 'error', title: 'Falha ao atualizar preferências' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateHorarios = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const form = e.target as HTMLFormElement;
    
    try {
      const hours = [];
      for (let i = 0; i < 7; i++) {
        const isOpen = (form.elements.namedItem(`day_${i}_isOpen`) as HTMLInputElement).checked;
        const startTime = (form.elements.namedItem(`day_${i}_startTime`) as HTMLInputElement).value;
        const endTime = (form.elements.namedItem(`day_${i}_endTime`) as HTMLInputElement).value;
        hours.push({ dayOfWeek: i, isOpen, startTime, endTime });
      }
      await api.put('/professionals/working-hours', hours);
      addToast({ type: 'success', title: 'Horários atualizados com sucesso!' });
      await loadProfile();
    } catch {
      addToast({ type: 'error', title: 'Falha ao atualizar horários' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateSenha = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const form = e.target as HTMLFormElement;
    
    const currentPassword = (form.elements.namedItem('currentPassword') as HTMLInputElement).value;
    const newPassword = (form.elements.namedItem('newPassword') as HTMLInputElement).value;
    const confirmPassword = (form.elements.namedItem('confirmPassword') as HTMLInputElement).value;

    if (newPassword !== confirmPassword) {
      addToast({ type: 'error', title: 'As senhas não coincidem' });
      setIsSaving(false);
      return;
    }

    try {
      await api.put('/users/me/password', { currentPassword, newPassword });
      addToast({ type: 'success', title: 'Senha atualizada com sucesso!' });
      form.reset();
    } catch {
      addToast({ type: 'error', title: 'Falha ao atualizar senha' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/@${profileData?.username}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: profileData?.businessName || 'Meu Perfil',
          text: 'Agende um horário comigo na Belezza!',
          url,
        });
      } catch (err) {
        console.error('Erro ao compartilhar:', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        addToast({ type: 'success', title: 'Link copiado para a área de transferência!' });
      } catch (err) {
        addToast({ type: 'error', title: 'Falha ao copiar link' });
      }
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
            <div>
              <div style={{ backgroundColor: 'var(--surface-card)', padding: 'var(--spacing-6)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--surface-border)', marginBottom: 'var(--spacing-6)' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: 'var(--spacing-2)', color: 'var(--color-neutral-900)' }}>Link do Perfil</h3>
                <p style={{ color: 'var(--color-neutral-500)', fontSize: '14px', marginBottom: 'var(--spacing-4)' }}>Este é o link público do seu portfólio. Você pode compartilhá-lo com clientes.</p>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)' }}>
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', backgroundColor: 'var(--surface-main)', borderRadius: 'var(--radius-md)', border: '1px solid var(--surface-border)', color: 'var(--color-neutral-700)', fontWeight: 500 }}>
                    <LinkIcon size={18} color="var(--color-neutral-400)" />
                    {typeof window !== 'undefined' ? window.location.origin : 'belezza.com'}/@{profileData?.username}
                  </div>
                  <Button variant="secondary" onClick={() => setIsChangingUsername(!isChangingUsername)}>
                    {isChangingUsername ? 'Cancelar' : 'Alterar Username'}
                  </Button>
                  <Button variant="primary" onClick={handleShare} leftIcon={<Share2 size={18} />}>
                    Compartilhar
                  </Button>
                </div>

                {isChangingUsername && (
                  <form onSubmit={handleChangeUsername} style={{ marginTop: 'var(--spacing-4)', paddingTop: 'var(--spacing-4)', borderTop: '1px solid var(--surface-border)' }}>
                    <p style={{ fontSize: '13px', color: 'var(--color-neutral-500)', marginBottom: 'var(--spacing-4)' }}>
                      <strong>Atenção:</strong> Seu plano ({profileData?.plan}) permite {profileData?.plan === 'PREMIUM' ? '3 alterações' : '1 alteração'} a cada 30 dias.
                    </p>
                    <div style={{ display: 'flex', gap: 'var(--spacing-4)', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1, position: 'relative' }}>
                        <Input 
                          placeholder="novo_username" 
                          value={newUsername}
                          onChange={(e) => setNewUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, '').toLowerCase())}
                          required
                        />
                        {usernameStatus === 'checking' && <span style={{ position: 'absolute', right: '12px', top: '12px', fontSize: '12px', color: 'var(--color-neutral-500)' }}>...</span>}
                        {usernameStatus === 'available' && <Check size={18} style={{ position: 'absolute', right: '12px', top: '12px', color: 'var(--color-success-500)' }} />}
                        {usernameStatus === 'unavailable' && <X size={18} style={{ position: 'absolute', right: '12px', top: '12px', color: 'var(--color-danger-500)' }} />}
                      </div>
                      <Button variant="primary" type="submit" isLoading={isSavingUsername} disabled={usernameStatus !== 'available'}>Confirmar</Button>
                    </div>
                  </form>
                )}
              </div>

            <form onSubmit={handleUpdateAparencia}>
              <h2 className={styles.sectionTitle}>Aparência da Página</h2>
              
              <label 
                className={styles.coverUpload} 
                style={{ 
                  cursor: 'pointer', 
                  backgroundImage: coverPreview ? `url(${coverPreview})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  color: coverPreview ? 'white' : 'inherit',
                  textShadow: coverPreview ? '0 1px 4px rgba(0,0,0,0.8)' : 'none'
                }}
              >
                <div style={{ backgroundColor: coverPreview ? 'rgba(0,0,0,0.4)' : 'transparent', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRadius: 'inherit' }}>
                  <input type="file" name="coverImage" accept="image/*" onChange={handleCoverChange} style={{ display: 'none' }} />
                  <ImageIcon size={32} />
                  <span>Clique para alterar a foto de capa</span>
                  <span style={{ fontSize: '12px' }}>Tamanho recomendado: 1200x400px</span>
                </div>
              </label>
              
              <label 
                className={styles.avatarUpload} 
                title="Alterar foto de perfil" 
                style={{ 
                  cursor: 'pointer', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  backgroundImage: avatarPreview ? `url(${avatarPreview})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  color: avatarPreview ? 'transparent' : 'inherit',
                }}
              >
                <input type="file" name="avatar" accept="image/*" onChange={handleAvatarChange} style={{ display: 'none' }} />
                {!avatarPreview && <Camera size={28} />}
              </label>

              <div className={styles.formGridFull} style={{ marginTop: 'var(--spacing-6)' }}>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Nome do Negócio ou Nome Profissional</label>
                  <input name="businessName" type="text" className={styles.input} defaultValue={profileData?.businessName || user?.name || ''} placeholder="Ex: Studio Bela" />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Biografia (Bio)</label>
                  <textarea name="bio" className={styles.textarea} placeholder="Conte um pouco sobre você, suas especialidades e seu espaço..." defaultValue={profileData?.bio || ''} />
                </div>
                <div className={styles.inputGroup} style={{ gridColumn: '1 / -1' }}>
                  <label className={styles.label}>Categorias de Serviço Principais</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '12px', marginTop: '8px' }}>
                    {VALID_CATEGORIES.map(cat => (
                      <label key={cat} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: 'var(--color-neutral-700)' }}>
                        <input 
                          type="checkbox" 
                          checked={selectedCategories.includes(cat)}
                          onChange={(e) => {
                            if (e.target.checked) setSelectedCategories(prev => [...prev, cat]);
                            else setSelectedCategories(prev => prev.filter(c => c !== cat));
                          }}
                          style={{ accentColor: 'var(--color-primary-600)', width: '16px', height: '16px' }}
                        />
                        {cat}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className={styles.formActions}>
                <Button variant="primary" type="submit" isLoading={isSaving}>Salvar Aparência</Button>
              </div>
            </form>
            </div>
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
            <form onSubmit={handleUpdateHorarios}>
              <h2 className={styles.sectionTitle}>Horários de Atendimento</h2>
              <div style={{ display: 'grid', gap: '16px' }}>
                {['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'].map((day, i) => {
                  const hour = profileData?.workingHours?.find((h: any) => h.dayOfWeek === i) || { isOpen: false, startTime: '09:00', endTime: '18:00' };
                  return (
                    <div key={i} style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                      <div style={{ width: '100px', fontWeight: 500 }}>{day}</div>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <input type="checkbox" name={`day_${i}_isOpen`} defaultChecked={hour.isOpen} />
                        Aberto
                      </label>
                      <input type="time" name={`day_${i}_startTime`} defaultValue={hour.startTime} className={styles.input} style={{ width: '120px' }} />
                      <span>até</span>
                      <input type="time" name={`day_${i}_endTime`} defaultValue={hour.endTime} className={styles.input} style={{ width: '120px' }} />
                    </div>
                  );
                })}
              </div>
              <div className={styles.formActions} style={{ marginTop: '24px' }}>
                <Button variant="primary" type="submit" isLoading={isSaving}>Salvar Horários</Button>
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

              <form onSubmit={handleUpdateSenha}>
                <h2 className={styles.sectionTitle}>Segurança da Conta</h2>
                <div className={styles.formGrid}>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Senha Atual</label>
                    <input type="password" name="currentPassword" placeholder="••••••••" className={styles.input} required />
                  </div>
                  <div className={styles.inputGroup}></div>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Nova Senha</label>
                    <input type="password" name="newPassword" placeholder="••••••••" className={styles.input} required minLength={6} />
                  </div>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Confirmar Nova Senha</label>
                    <input type="password" name="confirmPassword" placeholder="••••••••" className={styles.input} required minLength={6} />
                  </div>
                </div>
                <div className={styles.formActions}>
                  <Button variant="primary" type="submit" isLoading={isSaving}>Atualizar Senha</Button>
                </div>
              </form>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
