import React from 'react';
import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--surface-main)' }}>
      {/* Lado Esquerdo - Formulário */}
      <div className="auth-left" style={{ flex: '1 1 50%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ maxWidth: '440px', width: '100%', margin: 'auto' }}>
          <Link href="/" style={{ fontFamily: 'var(--font-family-display)', fontSize: '32px', color: 'var(--color-primary-600)', fontWeight: 800, display: 'inline-block', marginBottom: 'var(--spacing-12)' }}>
            Belezza
          </Link>
          {children}
        </div>
      </div>
      
      {/* Lado Direito - Imagem e Branding (Escondido no Mobile) */}
      <div className="auth-illustration" style={{ flex: '1 1 50%', position: 'relative', display: 'none', backgroundColor: 'var(--color-neutral-900)' }}>
        <div style={{ 
          position: 'absolute', inset: 0, 
          backgroundImage: 'url("https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1974&auto=format&fit=crop")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 1 
        }} />
        
        {/* Overlay Escuro para Legibilidade */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 100%)', zIndex: 2 }} />
        
        {/* Conteúdo Sobreposto (Depoimento) */}
        <div style={{ position: 'relative', zIndex: 3, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', height: '100%', padding: 'var(--spacing-16)', color: 'white' }}>
          <div style={{ display: 'flex', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-4)' }}>
            {[1,2,3,4,5].map(i => (
              <svg key={i} width="24" height="24" viewBox="0 0 24 24" fill="var(--color-gold-500)" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
            ))}
          </div>
          <p style={{ fontFamily: 'var(--font-family-display)', fontSize: '36px', fontWeight: 600, lineHeight: 1.2, marginBottom: 'var(--spacing-6)' }}>
            &quot;A Belezza transformou meu negócio. Hoje tenho minha agenda sempre lotada e reduzi em 90% as faltas das clientes com os lembretes automáticos.&quot;
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-full)', background: 'var(--color-primary-500)', overflow: 'hidden' }}>
              <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=100&auto=format&fit=crop" alt="Juliana" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div>
              <p style={{ fontWeight: 600, fontSize: '18px', margin: 0 }}>Juliana Santos</p>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', margin: 0 }}>Nail Designer & Proprietária</p>
            </div>
          </div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .auth-left { padding: var(--spacing-8); }
        @media (max-width: 480px) {
          .auth-left { padding: var(--spacing-4); }
        }
        @media (min-width: 1024px) {
          .auth-illustration { display: block !important; }
        }
      `}} />
    </div>
  );
}
