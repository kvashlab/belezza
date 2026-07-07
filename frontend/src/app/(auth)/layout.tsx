import React from 'react';
import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="auth-container" style={{ 
      display: 'flex', 
      height: '100vh', /* Strict height to prevent scrolling */
      width: '100%',
      backgroundColor: 'var(--surface-main, #ffffff)',
      overflow: 'hidden' /* Hide any overflow */
    }}>
      
      {/* Lado Esquerdo - Graphic/Vibe (Escondido no Mobile) */}
      <div className="auth-illustration" style={{ 
        flex: '1 1 50%', 
        position: 'relative', 
        display: 'none', 
        backgroundColor: 'var(--color-neutral-900)',
        backgroundImage: 'url(https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=1200&auto=format&fit=crop)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'white',
        overflow: 'hidden'
      }}>
        {/* Premium Dark Gradient Overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.8) 100%)' }}></div>

        {/* Professional Structure - Padding and Flex */}
        <div style={{ 
          position: 'relative', 
          zIndex: 3, 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'space-between', 
          height: '100%', 
          width: '100%',
          padding: '48px 64px'
        }}>
          
          <div style={{ display: 'flex', alignItems: 'center' }}>
             {/* Minimalist Logo Mark */}
             <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 0L22.5 15L35 5L26.5 17.5L40 20L26.5 22.5L35 35L22.5 25L20 40L17.5 25L5 35L13.5 22.5L0 20L13.5 17.5L5 5L17.5 15L20 0Z" fill="white" fillOpacity="0.9"/>
             </svg>
          </div>
          
          <div style={{ maxWidth: '500px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <p style={{ 
              fontWeight: 600, 
              fontSize: '12px', 
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              color: 'var(--color-primary-300)'
            }}>
              Belezza Para Profissionais
            </p>
            <h2 style={{ 
              fontFamily: 'var(--font-family-display)', 
              fontSize: '36px', 
              fontWeight: 700, 
              lineHeight: 1.2, 
              margin: 0, 
              letterSpacing: '-1px' 
            }}>
              Sua agenda inteligente, integrada e desenhada para conversão.
            </h2>
            <p style={{
              fontSize: '16px',
              lineHeight: 1.6,
              opacity: 0.8,
              margin: 0
            }}>
              Junte-se aos profissionais que estão escalando seus negócios e oferecendo experiências premium para seus clientes.
            </p>
          </div>
        </div>
      </div>
      
      {/* Lado Direito - Formulário */}
      <div className="auth-right" style={{ 
        flex: '1 1 50%', 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center',
        position: 'relative',
        height: '100%',
        overflowY: 'auto' /* Permit scroll only if screen is extremely small */
      }}>
        <div style={{ maxWidth: '380px', width: '100%', margin: '0 auto', padding: '32px' }}>
          <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
            <Link href="/" style={{ fontFamily: 'var(--font-family-display)', fontSize: '20px', color: 'var(--color-primary-600)', fontWeight: 800, textDecoration: 'none' }}>
              Belezza
            </Link>
          </div>
          {children}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 768px) {
          .auth-right {
            flex: 1 1 100% !important;
          }
          .auth-right > div {
            padding: var(--spacing-6) !important;
          }
        }
        @media (min-width: 1024px) {
          .auth-illustration { display: flex !important; }
        }
      `}} />
    </div>
  );
}
