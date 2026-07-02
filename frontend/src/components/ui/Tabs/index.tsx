import React, { useState } from 'react';
import styles from './styles.module.css';

export interface TabItem {
  id: string;
  label: string;
  content?: React.ReactNode;
}

export interface TabsProps {
  items: TabItem[];
  defaultActiveId?: string;
  onChange?: (id: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({ 
  items, 
  defaultActiveId, 
  onChange,
  className = '' 
}) => {
  const [activeId, setActiveId] = useState(defaultActiveId || items[0]?.id);

  const handleTabClick = (id: string) => {
    setActiveId(id);
    if (onChange) onChange(id);
  };

  return (
    <div className={`${styles.tabsWrapper} ${className}`}>
      <div className={styles.tabList} role="tablist">
        {items.map(item => {
          const isActive = activeId === item.id;
          return (
            <button
              key={item.id}
              role="tab"
              aria-selected={isActive}
              aria-controls={`panel-${item.id}`}
              id={`tab-${item.id}`}
              className={`${styles.tab} ${isActive ? styles.active : ''}`}
              onClick={() => handleTabClick(item.id)}
            >
              {item.label}
            </button>
          );
        })}
      </div>
      <div className={styles.tabPanels}>
        {items.map(item => {
          const isActive = activeId === item.id;
          if (!isActive) return null;
          return (
            <div
              key={item.id}
              role="tabpanel"
              id={`panel-${item.id}`}
              aria-labelledby={`tab-${item.id}`}
              className={styles.panel}
            >
              {item.content}
            </div>
          );
        })}
      </div>
    </div>
  );
};
