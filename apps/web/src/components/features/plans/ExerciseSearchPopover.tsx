'use client';

import { useState, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';
import type { Exercise } from '@nexio/types';
import { Skeleton } from '@/components/ui/Skeleton';
import { useExerciseSearch } from '@/hooks/use-exercise-search';

interface ExerciseSearchPopoverProps {
  currentName: string;
  onSelect: (exercise: Exercise) => void;
  onClose: () => void;
}

export function ExerciseSearchPopover({ currentName, onSelect, onClose }: ExerciseSearchPopoverProps) {
  const [query, setQuery] = useState('');
  const { grouped, isLoading } = useExerciseSearch(query);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const groups = Object.entries(grouped);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        top: '100%',
        left: 0,
        zIndex: 20,
        width: 320,
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 12,
        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        overflow: 'hidden',
        marginTop: 4,
      }}
    >
      <div style={{ padding: '12px 12px 8px', borderBottom: '1px solid var(--color-border)' }}>
        <div style={{ position: 'relative' }}>
          <Search
            size={14}
            style={{
              position: 'absolute',
              left: 10,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--color-text-secondary)',
            }}
          />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar ejercicio..."
            style={{
              width: '100%',
              padding: '8px 10px 8px 32px',
              borderRadius: 8,
              border: '1px solid var(--color-border)',
              fontSize: 13,
              outline: 'none',
            }}
          />
        </div>
      </div>

      <div style={{ maxHeight: 280, overflowY: 'auto', padding: '4px 0' }}>
        {query.length < 2 && (
          <div style={{ padding: '16px', fontSize: 13, color: 'var(--color-text-secondary)', textAlign: 'center' }}>
            Escribe al menos 2 caracteres para buscar
          </div>
        )}

        {query.length >= 2 && isLoading && (
          <div style={{ padding: '16px', textAlign: 'center' }}>
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} height={14} style={{ marginBottom: 8 }} />
            ))}
          </div>
        )}

        {query.length >= 2 && !isLoading && groups.length === 0 && (
          <div style={{ padding: '16px', fontSize: 13, color: 'var(--color-text-secondary)', textAlign: 'center' }}>
            Sin resultados para &ldquo;{query}&rdquo;
          </div>
        )}

        {groups.map(([group, exercises]) => (
          <div key={group}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: 'var(--color-text-secondary)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                padding: '8px 16px 4px',
              }}
            >
              {group}
            </div>
            {exercises.map((ex) => (
              <button
                key={ex.id}
                onClick={() => onSelect(ex)}
                style={{
                  display: 'block',
                  width: '100%',
                  textAlign: 'left',
                  padding: '8px 16px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 13,
                  color: 'var(--color-text-primary)',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = '#F7F8FA';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = '';
                }}
              >
                <div style={{ fontWeight: 500 }}>{ex.name}</div>
                {ex.equipment && (
                  <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginTop: 2 }}>
                    {ex.equipment}
                  </div>
                )}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
