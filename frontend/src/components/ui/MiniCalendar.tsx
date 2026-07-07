import React from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MiniCalendarProps {
  value: Date;
  onChange: (date: Date) => void;
}

export function MiniCalendar({ value, onChange }: MiniCalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState(startOfMonth(value));

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  });

  return (
    <div style={{ backgroundColor: 'var(--surface-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--surface-border)', padding: 'var(--spacing-4)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-4)' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 600, textTransform: 'capitalize' }}>
          {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
        </h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px' }}>
            <ChevronLeft size={16} />
          </button>
          <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px' }}>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center', marginBottom: '8px' }}>
        {['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'].map(d => (
          <div key={d} style={{ fontSize: '12px', color: 'var(--color-neutral-500)', fontWeight: 500 }}>{d}</div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
        {Array.from({ length: days[0].getDay() }).map((_, i) => <div key={`empty-${i}`} />)}
        {days.map(day => {
          const isSelected = isSameDay(day, value);
          const isCurrent = isToday(day);
          return (
            <button
              key={day.toISOString()}
              onClick={() => onChange(day)}
              style={{
                aspectRatio: '1',
                borderRadius: '50%',
                border: 'none',
                background: isSelected ? 'var(--color-primary-500)' : 'transparent',
                color: isSelected ? 'white' : isCurrent ? 'var(--color-primary-600)' : 'var(--color-neutral-700)',
                fontWeight: isSelected || isCurrent ? 600 : 400,
                cursor: 'pointer',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = 'var(--surface-main)'; }}
              onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              {format(day, 'd')}
            </button>
          );
        })}
      </div>
    </div>
  );
}
