'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { useUIStore } from '@/stores/ui.store';
import { Button } from '@/components/ui/Button';
import { User, Camera, MapPin, Trash2 } from 'lucide-react';
import { updateProfile, changePassword, addAddress, removeAddress } from '@/services/api/user';
import styles from './styles.module.css';

type Tab = 'dados_pessoais' | 'enderecos' | 'seguranca';

export default function Perfil() {
  const { user, fetchMe } = useAuthStore();
  const { addToast } = useUIStore();
  const [activeTab, setActiveTab] = useState<Tab>('dados_pessoais');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // States for Dados Pessoais
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    cpf: '',
    avatar: ''
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [showSmsModal, setShowSmsModal] = useState(false);
  const [smsCode, setSmsCode] = useState('');
  const [pendingProfileData, setPendingProfileData] = useState<any>(null);

  // States for Security
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  // States for Address
  const [addresses, setAddresses] = useState<any[]>([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressData, setAddressData] = useState({
    title: 'Casa',
    zipCode: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: ''
  });
  const [isSavingAddress, setIsSavingAddress] = useState(false);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: (user as any).email || '',
        phone: (user as any).phone || '',
        cpf: (user as any).cpf || '',
        avatar: (user as any).clientProfile?.avatar || ''
      });
      setAddresses((user as any).addresses || []);
    }
  }, [user]);

  // --- DADOS PESSOAIS ---
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        addToast({ type: 'error', title: 'Erro', message: 'Por favor, selecione uma imagem.' });
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        addToast({ type: 'error', title: 'Erro', message: 'A imagem deve ter no máximo 5MB.' });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 400;
          const MAX_HEIGHT = 400;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          canvas.toBlob((blob) => {
            if (blob) {
              const newFile = new File([blob], 'avatar.jpg', { type: 'image/jpeg' });
              setAvatarFile(newFile);
              setFormData({ ...formData, avatar: URL.createObjectURL(blob) });
            }
          }, 'image/jpeg', 0.8);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };


  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.phone && formData.phone !== (user as any).phone) {
      setShowSmsModal(true);
      addToast({ type: 'info', title: 'SMS Enviado', message: 'Código de teste: 1234' });
      return;
    }

    // Phone didn't change, save directly
    executeSaveProfile(formData);
  };

  const executeSaveProfile = async (dataToSave: any) => {
    setIsSavingProfile(true);
    try {
      const data = new FormData();
      data.append('name', dataToSave.name);
      data.append('phone', dataToSave.phone);
      data.append('cpf', dataToSave.cpf);
      if (avatarFile) {
        data.append('avatar', avatarFile);
      } else if (dataToSave.avatar) {
        data.append('avatar', dataToSave.avatar);
      }

      await updateProfile(data);
      await fetchMe();
      addToast({ type: 'success', title: 'Sucesso', message: 'Perfil atualizado com sucesso!' });
      setShowSmsModal(false);
      setSmsCode('');
      setPendingProfileData(null);
    } catch (err: any) {
      addToast({ type: 'error', title: 'Erro', message: err.message });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleVerifySms = () => {
    if (smsCode !== '1234') {
      addToast({ type: 'error', title: 'Código Inválido', message: 'Tente usar 1234 para testes.' });
      return;
    }
    executeSaveProfile(pendingProfileData);
  };

  // --- SEGURANÇA ---
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleSavePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      addToast({ type: 'info', title: 'Atenção', message: 'A nova senha e a confirmação não conferem.' });
      return;
    }
    if (passwordData.newPassword.length < 6) {
      addToast({ type: 'info', title: 'Atenção', message: 'A nova senha deve ter no mínimo 6 caracteres.' });
      return;
    }

    setIsSavingPassword(true);
    try {
      await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      addToast({ type: 'success', title: 'Sucesso', message: 'Senha alterada com sucesso!' });
    } catch (err: any) {
      addToast({ type: 'error', title: 'Erro', message: err.message });
    } finally {
      setIsSavingPassword(false);
    }
  };

  // --- ENDEREÇOS ---
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddressData({ ...addressData, [e.target.name]: e.target.value });
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingAddress(true);
    try {
      await addAddress(addressData);
      await fetchMe();
      setShowAddressForm(false);
      setAddressData({
        title: 'Casa', zipCode: '', street: '', number: '', complement: '', neighborhood: '', city: '', state: ''
      });
      addToast({ type: 'success', title: 'Sucesso', message: 'Endereço salvo com sucesso!' });
    } catch (err: any) {
      addToast({ type: 'error', title: 'Erro', message: err.message });
    } finally {
      setIsSavingAddress(false);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (!confirm('Deseja realmente remover este endereço?')) return;
    try {
      await removeAddress(id);
      await fetchMe();
      addToast({ type: 'success', title: 'Sucesso', message: 'Endereço removido!' });
    } catch (err: any) {
      addToast({ type: 'error', title: 'Erro', message: err.message });
    }
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
          {/* ABA: DADOS PESSOAIS */}
          {activeTab === 'dados_pessoais' && (
            <form onSubmit={handleSaveProfile}>
              <h2 className={styles.sectionTitle}>Dados Pessoais</h2>
              
              <div className={styles.avatarSection}>
                <div className={styles.avatar}>
                  {formData.avatar ? (
                    <img src={formData.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                  ) : (
                    <User size={40} />
                  )}
                </div>
                <div className={styles.avatarActions}>
                  <input type="file" accept="image/*" hidden ref={fileInputRef} onChange={handleAvatarChange} />
                  <Button variant="secondary" type="button" onClick={() => fileInputRef.current?.click()} leftIcon={<Camera size={18} />}>
                    Alterar Foto
                  </Button>
                  <Button variant="secondary" type="button" onClick={() => setFormData({...formData, avatar: ''})} style={{ color: 'var(--color-danger)', borderColor: 'var(--color-danger)' }}>
                    Remover
                  </Button>
                </div>
              </div>

              <div className={styles.formGrid}>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Nome Completo</label>
                  <input type="text" name="name" value={formData.name} onChange={handleProfileChange} className={styles.input} required />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>E-mail</label>
                  <input type="email" name="email" value={formData.email} className={styles.input} disabled style={{ backgroundColor: 'var(--surface-border)', cursor: 'not-allowed' }} />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Telefone / WhatsApp</label>
                  <input type="text" name="phone" value={formData.phone} onChange={handleProfileChange} placeholder="(00) 00000-0000" className={styles.input} />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>CPF</label>
                  <input type="text" name="cpf" value={formData.cpf} onChange={handleProfileChange} placeholder="000.000.000-00" className={styles.input} />
                </div>
              </div>

              {showSmsModal && (
                <div style={{ marginTop: 'var(--spacing-6)', padding: 'var(--spacing-4)', border: '1px solid var(--color-primary-200)', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-primary-50)' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: 'var(--spacing-2)' }}>Verificação de Telefone</h3>
                  <p style={{ fontSize: '14px', marginBottom: 'var(--spacing-4)', color: 'var(--color-neutral-600)' }}>Um SMS foi enviado para {pendingProfileData?.phone}. Insira o código 1234 abaixo:</p>
                  <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                    <input type="text" className={styles.input} style={{ flex: 1 }} placeholder="1234" value={smsCode} onChange={(e) => setSmsCode(e.target.value)} maxLength={4} />
                    <Button variant="primary" type="button" onClick={handleVerifySms}>Verificar e Salvar</Button>
                    <Button variant="secondary" type="button" onClick={() => setShowSmsModal(false)}>Cancelar</Button>
                  </div>
                </div>
              )}

              <div className={styles.formActions}>
                <Button variant="primary" type="submit" isLoading={isSavingProfile}>Salvar Alterações</Button>
              </div>
            </form>
          )}
          
          {activeTab === 'dados_pessoais' && showSmsModal && (
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
              <div style={{ backgroundColor: 'var(--surface-main)', padding: 'var(--spacing-6)', borderRadius: 'var(--radius-lg)', width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 600 }}>Verificação de Telefone</h3>
                <p style={{ fontSize: '14px', color: 'var(--color-neutral-500)' }}>Um código de 4 dígitos foi enviado para o seu novo número: {formData.phone}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                  <label className={styles.label}>Código SMS</label>
                  <input type="text" className={styles.input} maxLength={4} value={smsCode} onChange={(e) => setSmsCode(e.target.value)} placeholder="1234" />
                </div>
                <div style={{ display: 'flex', gap: 'var(--spacing-3)', justifyContent: 'flex-end', marginTop: 'var(--spacing-4)' }}>
                  <Button variant="secondary" onClick={() => setShowSmsModal(false)}>Cancelar</Button>
                  <Button variant="primary" onClick={handleVerifySms}>Verificar e Salvar</Button>
                </div>
              </div>
            </div>
          )}

          {/* ABA: ENDEREÇOS */}
          {activeTab === 'enderecos' && (
            <div>
              <h2 className={styles.sectionTitle}>Meus Endereços</h2>
              {!showAddressForm && (
                <>
                  <p style={{ color: 'var(--color-neutral-500)', marginBottom: 'var(--spacing-6)' }}>
                    Cadastre seus endereços para encontrar profissionais próximos a você ou para serviços a domicílio.
                  </p>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-6)' }}>
                    {addresses.length === 0 ? (
                      <p style={{ fontSize: '14px', color: 'var(--color-neutral-500)', fontStyle: 'italic' }}>Nenhum endereço cadastrado.</p>
                    ) : (
                      addresses.map((address) => (
                        <div key={address.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--spacing-4)', border: '1px solid var(--surface-border)', borderRadius: 'var(--radius-lg)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)' }}>
                            <div style={{ padding: 'var(--spacing-3)', backgroundColor: 'var(--color-primary-50)', color: 'var(--color-primary-600)', borderRadius: 'var(--radius-full)' }}>
                              <MapPin size={24} />
                            </div>
                            <div>
                              <p style={{ fontWeight: 600, margin: '0 0 4px 0' }}>{address.title}</p>
                              <p style={{ fontSize: '14px', color: 'var(--color-neutral-500)', margin: 0 }}>
                                {address.street}, {address.number} {address.complement && `- ${address.complement}`} <br/>
                                {address.neighborhood}, {address.city} - {address.state}
                              </p>
                            </div>
                          </div>
                          <button onClick={() => handleDeleteAddress(address.id)} style={{ padding: 'var(--spacing-2)', color: 'var(--color-danger)', border: 'none', background: 'none', cursor: 'pointer' }}>
                            <Trash2 size={20} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                  <Button variant="secondary" onClick={() => setShowAddressForm(true)}>+ Adicionar Novo Endereço</Button>
                </>
              )}

              {showAddressForm && (
                <form onSubmit={handleSaveAddress} style={{ padding: 'var(--spacing-6)', border: '1px solid var(--surface-border)', borderRadius: 'var(--radius-lg)' }}>
                  <h3 style={{ marginBottom: 'var(--spacing-4)' }}>Adicionar Endereço</h3>
                  <div className={styles.formGrid}>
                    <div className={styles.inputGroup} style={{ gridColumn: '1 / -1' }}>
                      <label className={styles.label}>Título (Ex: Casa, Trabalho)</label>
                      <input type="text" name="title" value={addressData.title} onChange={handleAddressChange} className={styles.input} required />
                    </div>
                    <div className={styles.inputGroup}>
                      <label className={styles.label}>CEP</label>
                      <input type="text" name="zipCode" value={addressData.zipCode} onChange={handleAddressChange} className={styles.input} required />
                    </div>
                    <div className={styles.inputGroup}>
                      <label className={styles.label}>Rua / Logradouro</label>
                      <input type="text" name="street" value={addressData.street} onChange={handleAddressChange} className={styles.input} required />
                    </div>
                    <div className={styles.inputGroup}>
                      <label className={styles.label}>Número</label>
                      <input type="text" name="number" value={addressData.number} onChange={handleAddressChange} className={styles.input} required />
                    </div>
                    <div className={styles.inputGroup}>
                      <label className={styles.label}>Complemento</label>
                      <input type="text" name="complement" value={addressData.complement} onChange={handleAddressChange} className={styles.input} />
                    </div>
                    <div className={styles.inputGroup}>
                      <label className={styles.label}>Bairro</label>
                      <input type="text" name="neighborhood" value={addressData.neighborhood} onChange={handleAddressChange} className={styles.input} required />
                    </div>
                    <div className={styles.inputGroup}>
                      <label className={styles.label}>Cidade</label>
                      <input type="text" name="city" value={addressData.city} onChange={handleAddressChange} className={styles.input} required />
                    </div>
                    <div className={styles.inputGroup}>
                      <label className={styles.label}>Estado (UF)</label>
                      <input type="text" name="state" value={addressData.state} onChange={handleAddressChange} className={styles.input} maxLength={2} required />
                    </div>
                  </div>
                  <div className={styles.formActions} style={{ marginTop: 'var(--spacing-6)' }}>
                    <Button variant="secondary" type="button" onClick={() => setShowAddressForm(false)}>Cancelar</Button>
                    <Button variant="primary" type="submit" isLoading={isSavingAddress}>Salvar Endereço</Button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* ABA: SEGURANÇA */}
          {activeTab === 'seguranca' && (
            <div>
              <h2 className={styles.sectionTitle}>Segurança</h2>
              <div className={styles.formGrid}>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Senha Atual</label>
                  <input type="password" name="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange} placeholder="••••••••" className={styles.input} />
                </div>
                <div className={styles.inputGroup}></div>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Nova Senha</label>
                  <input type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} placeholder="••••••••" className={styles.input} />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Confirmar Nova Senha</label>
                  <input type="password" name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} placeholder="••••••••" className={styles.input} />
                </div>
              </div>
              <div className={styles.formActions}>
                <Button variant="primary" type="button" onClick={handleSavePassword} isLoading={isSavingPassword}>Atualizar Senha</Button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
