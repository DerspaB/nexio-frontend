'use client';

import { Plus, Trash2 } from 'lucide-react';
import type { WorkoutDay } from '@nexio/types';

const DAY_NAMES: Record<number, string> = {
  1: 'Lunes',
  2: 'Martes',
  3: 'Miércoles',
  4: 'Jueves',
  5: 'Viernes',
  6: 'Sábado',
  7: 'Domingo',
};

interface PlanSidebarProps {
  days: WorkoutDay[];
  selectedDayId: string | null;
  durationWeeks: number;
  onSelectDay: (dayId: string) => void;
  onAddDay: () => void;
  onDeleteDay: (dayId: string) => void;
}

export function PlanSidebar({
  days,
  selectedDayId,
  onSelectDay,
  onAddDay,
  onDeleteDay,
}: PlanSidebarProps) {
  const sortedDays = [...days].sort((a, b) => a.order - b.order);

  return (
    <aside
      style={{
        width: 250,
        borderRight: '1px solid var(--color-border)',
        backgroundColor: 'var(--color-surface)',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          padding: '16px 16px 8px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Días
        </span>
        <button
          onClick={onAddDay}
          title="Agregar día"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 4,
            color: 'var(--color-primary)',
            borderRadius: 4,
          }}
        >
          <Plus size={16} />
        </button>
      </div>

      <div style={{ flex: 1, padding: '0 8px 16px' }}>
        {sortedDays.length === 0 && (
          <div style={{ padding: '8px', fontSize: 12, color: 'var(--color-text-secondary)', fontStyle: 'italic' }}>
            Sin días
          </div>
        )}

        {sortedDays.map((day) => {
          const active = day.id === selectedDayId;
          return (
            <div
              key={day.id}
              onClick={() => onSelectDay(day.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 8px',
                borderRadius: 8,
                cursor: 'pointer',
                backgroundColor: active ? '#EEF2FF' : 'transparent',
                color: active ? 'var(--color-primary)' : 'var(--color-text-primary)',
                fontWeight: active ? 600 : 400,
                fontSize: 13,
              }}
            >
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                {DAY_NAMES[day.dayOfWeek] || `Día ${day.dayOfWeek}`} — {day.name}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteDay(day.id);
                }}
                title="Eliminar día"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 2,
                  color: 'var(--color-text-secondary)',
                  opacity: 0.5,
                  flexShrink: 0,
                }}
              >
                <Trash2 size={13} />
              </button>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
