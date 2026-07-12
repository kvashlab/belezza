'use client';

import React, { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Search } from 'lucide-react';
import styles from './styles.module.css';

// Global cache to avoid fetching multiple times if component is mounted/unmounted
let cachedCities: string[] = [];
let isFetching = false;

interface CityAutocompleteProps {
  initialValue?: string;
  placeholder?: string;
  className?: string;
  icon?: 'search' | 'map-pin';
  onCitySelected?: (city: string) => void;
}

export const CityAutocomplete: React.FC<CityAutocompleteProps> = ({
  initialValue = '',
  placeholder = 'Buscar por cidade (ex: São Paulo)',
  className = '',
  icon = 'search',
  onCitySelected
}) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Sync state if initialValue changes (e.g. url params update)
  useEffect(() => {
    setSearchTerm(initialValue);
  }, [initialValue]);

  // Fetch cities on mount
  useEffect(() => {
    const fetchCities = async () => {
      if (cachedCities.length > 0 || isFetching) return;
      isFetching = true;
      try {
        const res = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/municipios');
        const data = await res.json();
        cachedCities = data.map((city: any) => 
          `${city.nome} - ${city.microrregiao.mesorregiao.UF.sigla}, Brasil`
        );
      } catch (error) {
        console.error('Failed to fetch cities from IBGE', error);
      } finally {
        isFetching = false;
      }
    };
    fetchCities();
  }, []);

  // Update suggestions when searchTerm changes
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSuggestions([]);
      return;
    }

    const termLower = searchTerm.toLowerCase().trim();
    
    // Normalize string to ignore accents
    const normalize = (str: string) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    const normalizedTerm = normalize(termLower);

    const matches = cachedCities.filter(city => 
      normalize(city).includes(normalizedTerm)
    );

    // Sort: exact matches or starts with should come first
    matches.sort((a, b) => {
      const aNorm = normalize(a);
      const bNorm = normalize(b);
      const aStarts = aNorm.startsWith(normalizedTerm) ? -1 : 1;
      const bStarts = bNorm.startsWith(normalizedTerm) ? -1 : 1;
      if (aStarts !== bStarts) return aStarts - bStarts;
      return a.localeCompare(b);
    });

    setSuggestions(matches.slice(0, 5));
    setSelectedIndex(-1);
  }, [searchTerm]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (city: string) => {
    setSearchTerm(city);
    setIsOpen(false);
    
    if (onCitySelected) {
      onCitySelected(city);
    } else {
      router.push(`/explorar?cidade=${encodeURIComponent(city)}`);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen && suggestions.length > 0) {
      setIsOpen(true);
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
        handleSelect(suggestions[selectedIndex]);
      } else if (searchTerm.trim()) {
        // If they just hit enter without selecting, use the first suggestion if available,
        // or just send the current term.
        if (suggestions.length > 0) {
          handleSelect(suggestions[0]);
        } else {
          handleSelect(searchTerm.trim());
        }
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div className={`${styles.autocompleteWrapper} ${className}`} ref={wrapperRef}>
      <div className={styles.inputContainer}>
        {icon === 'search' ? (
          <Search size={18} className={styles.icon} />
        ) : (
          <MapPin size={18} className={styles.icon} />
        )}
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => {
            if (searchTerm.trim() && suggestions.length > 0) {
              setIsOpen(true);
            }
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={styles.input}
          autoComplete="off"
        />
      </div>

      {isOpen && suggestions.length > 0 && (
        <ul className={styles.suggestionsList}>
          {suggestions.map((city, index) => (
            <li
              key={city}
              className={`${styles.suggestionItem} ${index === selectedIndex ? styles.selected : ''}`}
              onMouseEnter={() => setSelectedIndex(index)}
              onClick={() => handleSelect(city)}
            >
              <MapPin size={16} className={styles.suggestionIcon} />
              {city}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
