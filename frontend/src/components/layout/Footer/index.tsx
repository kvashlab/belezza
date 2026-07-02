import React from 'react';
import Link from 'next/link';

import styles from './styles.module.css';

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.brand}>
            <Link href="/" className={styles.logo}>Belezza</Link>
            <p className={styles.description}>
              Sua plataforma completa para agendamentos e gestão de serviços de beleza.
            </p>
            <div className={styles.social}>
              <a href="#" aria-label="Instagram">Instagram</a>
              <a href="#" aria-label="Twitter">Twitter</a>
            </div>
          </div>
          
          <div className={styles.linksColumn}>
            <h4 className={styles.title}>Para Clientes</h4>
            <Link href="/explorar" className={styles.link}>Explorar Profissionais</Link>
            <Link href="/dashboard" className={styles.link}>Minha Conta</Link>
            <Link href="/login" className={styles.link}>Entrar</Link>
          </div>

          <div className={styles.linksColumn}>
            <h4 className={styles.title}>Para Profissionais</h4>
            <Link href="/cadastro" className={styles.link}>Cadastre-se</Link>
            <Link href="/painel" className={styles.link}>Painel de Controle</Link>
            <Link href="/precos" className={styles.link}>Planos e Preços</Link>
          </div>

          <div className={styles.linksColumn}>
            <h4 className={styles.title}>Legal</h4>
            <Link href="/termos" className={styles.link}>Termos de Uso</Link>
            <Link href="/privacidade" className={styles.link}>Privacidade</Link>
            <Link href="/ajuda" className={styles.link}>Central de Ajuda</Link>
          </div>
        </div>
        
        <div className={styles.bottom}>
          <p>© {new Date().getFullYear()} Belezza. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};
