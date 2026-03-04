'use client';

import { useState, useRef, useEffect } from 'react';
import { Plus, Dumbbell, Timer, StickyNote, Layers } from 'lucide-react';
import type { BlockType } from '@nexio/types';

interface AddBlockButtonProps {
  onAdd: (type: BlockType) => void;
}

const OPTIONS: { type: BlockType; label: string; icon: typeof Dumbbell; color: string }[] = [
  { type: 'EXERCISE', label: 'Ejercicio', icon: Dumbbell, color: 'var(--color-primary)' },
  { type: 'SUPERSET', label: 'Superset', icon: Layers, color: '#7C3AED' },
  { type: 'REST', label: 'Descanso', icon: Timer, color: '#059669' },
  { type: 'NOTE', label: 'Nota', icon: StickyNote, color: '#D97706' },
];

export function AddBlockButton({ onAdd }: AddBlockButtonProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '10px 16px',
          backgroundColor: 'transparent',
          color: 'var(--color-primary)',
          border: '1px dashed var(--color-primary)',
          borderRadius: 12,
          fontSize: 13,
          fontWeight: 600,
          cursor: 'pointer',
          width: '100%',
          justifyContent: 'center',
        }}
      >
        <Plus size={16} />
        Agregar bloque
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            bottom: '100%',
            left: 0,
            marginBottom: 4,
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 12,
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            overflow: 'hidden',
            width: 180,
            zIndex: 15,
          }}
        >
          {OPTIONS.map(({ type, label, icon: Icon, color }) => (
            <button
              key={type}
              onClick={() => {
                onAdd(type);
                setOpen(false);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                width: '100%',
                padding: '10px 14px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: 13,
                color: 'var(--color-text-primary)',
                textAlign: 'left',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = '#F7F8FA';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = '';
              }}
            >
              <Icon size={16} style={{ color }} />
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
