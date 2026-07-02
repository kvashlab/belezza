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
  const [isSavingProfile, setIsSavingProfile] = useState(false);

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
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    try {
      await updateProfile({
        name: formData.name,
        phone: formData.phone,
        cpf: formData.cpf,
        avatar: formData.avatar
      });
      await fetchMe();
      addToast({ type: 'success', title: 'Sucesso', message: 'Perfil atualizado com sucesso!' });
    } catch (err: any) {
      addToast({ type: 'error', title: 'Erro', message: err.message });
    } finally {
      setIsSavingProfile(false);
    }
  };

  // --- SEGURANÇA ---
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleSavePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      addToast({ type: 'warning', title: 'Atenção', message: 'A nova senha e a confirmação não conferem.' });
      return;
    }
    if (passwordData.newPassword.length < 6) {
      addToast({ type: 'warning', title: 'Atenção', message: 'A nova senha deve ter no mínimo 6 caracteres.' });
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
                    <img src={formData.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <User size={40} />
                  )}
                </div>
                <div className={styles.avatarActions}>
                  <input type="file" accept="image/*" hidden ref={fileInputRef} onChange={handleAvatarChange} />
                  <Button variant="secondary" type="button" onClick={() => fileInputRef.current?.click()} leftIcon={<Camera size={18} />}>
                    Alterar Foto
                  </Button>
                  <Button variant="outline" type="button" onClick={() => setFormData({...formData, avatar: ''})} style={{ color: 'var(--color-danger)', borderColor: 'var(--color-danger)' }}>
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

              <div className={styles.formActions}>
                <Button variant="primary" type="submit" isLoading={isSavingProfile}>Salvar Alterações</Button>
              </div>
            </form>
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
