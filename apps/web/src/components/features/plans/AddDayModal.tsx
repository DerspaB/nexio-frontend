'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

const DAY_OPTIONS = [
  { value: 1, label: 'Lunes' },
  { value: 2, label: 'Martes' },
  { value: 3, label: 'Miércoles' },
  { value: 4, label: 'Jueves' },
  { value: 5, label: 'Viernes' },
  { value: 6, label: 'Sábado' },
  { value: 7, label: 'Domingo' },
];

interface AddDayModalProps {
  open: boolean;
  durationWeeks: number;
  onClose: () => void;
  onAdd: (data: { name: string; dayOfWeek: number }) => void;
}

export function AddDayModal({ open, onClose, onAdd }: AddDayModalProps) {
  const [name, setName] = useState('');
  const [dayOfWeek, setDayOfWeek] = useState(1);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd({ name: name.trim(), dayOfWeek });
    setName('');
    setDayOfWeek(1);
  }

  if (!open) return null;

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 12px',
    borderRadius: 'var(--radius-input)',
    border: '1px solid var(--color-border)',
    fontSize: 14,
    outline: 'none',
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.4)',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'var(--color-surface)',
          borderRadius: 'var(--radius-modal)',
          padding: 'var(--spacing-xl)',
          width: '100%',
          maxWidth: 400,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700 }}>Agregar día</h2>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: 'var(--color-text-secondary)' }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 6 }}>
              Nombre del día
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Push Day"
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 6 }}>
              Día de la semana
            </label>
            <select
              value={dayOfWeek}
              onChange={(e) => setDayOfWeek(parseInt(e.target.value))}
              style={{ ...inputStyle, backgroundColor: 'var(--color-surface)', cursor: 'pointer' }}
            >
              {DAY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: '10px',
                backgroundColor: 'transparent',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-button)',
                fontSize: 14,
                cursor: 'pointer',
                color: 'var(--color-text-secondary)',
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              style={{
                flex: 1,
                padding: '10px',
                backgroundColor: 'var(--color-primary)',
                color: '#fff',
                border: 'none',
                borderRadius: 'var(--radius-button)',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Agregar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
