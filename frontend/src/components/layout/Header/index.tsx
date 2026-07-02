'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Menu } from 'lucide-react';
import { AuthNavigation } from './AuthNavigation';
import styles from './styles.module.css';

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

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
        <Link href="/" className={styles.logo}>
          Belezza
        </Link>

        <div className={styles.searchBar}>
          <Search size={18} className={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="Buscar por profissional, categoria..."
            className={styles.searchInput}
          />
        </div>

        <AuthNavigation />

        <button className={styles.mobileMenuBtn} aria-label="Menu">
          <Menu size={24} />
        </button>
      </div>
    </header>
  );
};
