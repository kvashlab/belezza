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
        background: 'linear-gradient(135deg, #4f46e5 0%, #a855f7 50%, #ec4899 100%)', // Vibrant gradient mesh
        color: 'white',
        overflow: 'hidden'
      }}>
        {/* Decorative abstract elements */}
        <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: '40vw', height: '40vw', background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 70%)', borderRadius: '50%' }}></div>
        <div style={{ position: 'absolute', bottom: '-15%', right: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)', borderRadius: '50%' }}></div>
        
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
          
          <div style={{ maxWidth: '480px' }}>
            <p style={{ 
              fontWeight: 600, 
              fontSize: '13px', 
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              marginBottom: '16px', 
              opacity: 0.8 
            }}>
              Para Gestão Premium
            </p>
            <h2 style={{ 
              fontFamily: 'var(--font-family-display)', 
              fontSize: '40px', 
              fontWeight: 700, 
              lineHeight: 1.1, 
              margin: '0 0 16px 0', 
              letterSpacing: '-1px' 
            }}>
              Seu hub pessoal para clareza e produtividade
            </h2>
            <p style={{
              fontSize: '16px',
              lineHeight: 1.5,
              opacity: 0.9,
              margin: 0
            }}>
              Gerencie seus agendamentos e clientes de forma inteligente e integrada, sem perder o foco na beleza.
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
