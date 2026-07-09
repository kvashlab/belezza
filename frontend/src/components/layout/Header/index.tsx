'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Search, Menu } from 'lucide-react';
import { AuthNavigation } from './AuthNavigation';
import styles from './styles.module.css';

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/explorar?q=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      router.push('/explorar');
    }
  };

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
          <form className={styles.searchBar} onSubmit={handleSearch}>
            <Search size={18} className={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="Buscar por profissional..."
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>
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

