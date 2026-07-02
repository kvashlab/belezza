import React from 'react';
import styles from './styles.module.css';

interface ChartProps {
  data: { label: string; value: number }[];
  height?: number;
}

export const SimpleBarChart: React.FC<ChartProps> = ({ data, height = 250 }) => {
  const maxValue = Math.max(...data.map(d => d.value), 1);

  return (
    <div className={styles.chartContainer} style={{ height }}>
      <div className={styles.barsArea}>
        {data.map((item, index) => (
          <div key={index} className={styles.barGroup}>
            <div className={styles.barTrack}>
              <div 
                className={styles.barFill} 
                style={{ height: `${(item.value / maxValue) * 100}%` }}
              >
                <div className={styles.tooltip}>R$ {item.value}</div>
              </div>
            </div>
            <span className={styles.barLabel}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
