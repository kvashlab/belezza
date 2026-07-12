'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Search, Menu } from 'lucide-react';
import { AuthNavigation } from './AuthNavigation';
import { CityAutocomplete } from '@/components/ui/CityAutocomplete';
import styles from './styles.module.css';

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={styles.container}>
        <div className={styles.leftSection}>
          <Link href="/" className={styles.logo}>
            Belezza
          </Link>
        </div>

        {isHomePage ? (
          <nav className={`${styles.centerNav} ${isScrolled ? styles.centerNavVisible : ''}`}>
            <a href="#recursos" className={styles.navLink}>Recursos</a>
            <a href="#funciona" className={styles.navLink}>Como Funciona</a>
            <a href="#precos" className={styles.navLink}>Preços</a>
            <a href="#faq" className={styles.navLink}>FAQ</a>
          </nav>
        ) : !pathname.startsWith('/explorar') && (
          <div className={styles.searchBar}>
            <CityAutocomplete 
              placeholder="Buscar por cidade..."
              icon="search"
            />
          </div>
        )}

        <div className={styles.rightSection}>
          <AuthNavigation />
          <button className={styles.mobileMenuBtn} aria-label="Menu">
            <Menu size={24} />
          </button>
        </div>
      </div>
    </header>
  );
};

