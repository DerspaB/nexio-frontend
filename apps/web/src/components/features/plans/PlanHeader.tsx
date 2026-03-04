'use client';

import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Save, UserPlus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { Plan, PlanStatus } from '@nexio/types';
import { PlanStatusPill } from './PlanStatusPill';
import type { PlanStatus as PlanStatusType } from '@nexio/constants';

interface PlanHeaderProps {
  plan: Plan;
  saving: boolean;
  onNameChange: (name: string) => void;
  onSave: () => void;
  onAssign: () => void;
}

export function PlanHeader({ plan, saving, onNameChange, onSave, onAssign }: PlanHeaderProps) {
  const router = useRouter();
  const [name, setName] = useState(plan.name);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    setName(plan.name);
  }, [plan.name]);

  function handleNameChange(value: string) {
    setName(value);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onNameChange(value);
    }, 1000);
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: '12px 24px',
        borderBottom: '1px solid var(--color-border)',
        backgroundColor: 'var(--color-surface)',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}
    >
      <button
        onClick={() => router.push('/plans')}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 4,
          color: 'var(--color-text-secondary)',
        }}
      >
        <ArrowLeft size={20} />
      </button>

      <input
        type="text"
        value={name}
        onChange={(e) => handleNameChange(e.target.value)}
        style={{
          fontSize: 18,
          fontWeight: 700,
          border: 'none',
          outline: 'none',
          background: 'transparent',
          flex: 1,
          minWidth: 200,
        }}
      />

      <PlanStatusPill status={plan.status as PlanStatusType} />

      {plan.isTemplate && (
        <span
          style={{
            padding: '2px 10px',
            borderRadius: 9999,
            fontSize: 12,
            fontWeight: 600,
            backgroundColor: '#EEF2FF',
            color: '#4338CA',
          }}
        >
          Template
        </span>
      )}

      {saving && (
        <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>
          Guardando...
        </span>
      )}

      <button
        onClick={onSave}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '8px 16px',
          backgroundColor: 'var(--color-primary)',
          color: '#fff',
          border: 'none',
          borderRadius: 'var(--radius-button)',
          fontSize: 13,
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        <Save size={14} />
        Guardar
      </button>

      {plan.isTemplate && (
        <button
          onClick={onAssign}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '8px 16px',
            backgroundColor: 'transparent',
            color: 'var(--color-primary)',
            border: '1px solid var(--color-primary)',
            borderRadius: 'var(--radius-button)',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          <UserPlus size={14} />
          Asignar a cliente
        </button>
      )}
    </div>
  );
}
