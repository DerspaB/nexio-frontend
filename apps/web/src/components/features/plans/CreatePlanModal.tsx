'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { createPlanSchema } from '@nexio/validations';
import { plansApi } from '@/lib/api';

interface CreatePlanModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export function CreatePlanModal({ open, onClose, onCreated }: CreatePlanModalProps) {
  const [form, setForm] = useState({
    name: '',
    description: '',
    durationWeeks: 4,
    isTemplate: true,
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function updateField(field: string, value: string | number | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function resetForm() {
    setForm({ name: '', description: '', durationWeeks: 4, isTemplate: true });
    setFieldErrors({});
    setError('');
  }

  function handleClose() {
    resetForm();
    onClose();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    const result = createPlanSchema.safeParse(form);
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) errors[String(err.path[0])] = err.message;
      });
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    try {
      await plansApi.createPlan(result.data);
      resetForm();
      onCreated();
    } catch {
      setError('Error al crear el plan. Verifica los datos.');
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  const inputStyle = (field: string): React.CSSProperties => ({
    width: '100%',
    padding: '10px 12px',
    borderRadius: 'var(--radius-input)',
    border: `1px solid ${fieldErrors[field] ? 'var(--color-danger)' : 'var(--color-border)'}`,
    fontSize: 14,
    outline: 'none',
  });

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
      onClick={handleClose}
    >
      <div
        style={{
          backgroundColor: 'var(--color-surface)',
          borderRadius: 'var(--radius-modal)',
          padding: 'var(--spacing-xl)',
          width: '100%',
          maxWidth: 440,
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
          }}
        >
          <h2 style={{ fontSize: 18, fontWeight: 700 }}>Nuevo plan</h2>
          <button
            onClick={handleClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 4,
              color: 'var(--color-text-secondary)',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {error && (
          <div
            style={{
              backgroundColor: '#FEE2E2',
              color: 'var(--color-danger)',
              padding: '12px 16px',
              borderRadius: 'var(--radius-input)',
              marginBottom: 16,
              fontSize: 14,
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label
              htmlFor="plan-name"
              style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 6 }}
            >
              Nombre
            </label>
            <input
              id="plan-name"
              type="text"
              value={form.name}
              onChange={(e) => updateField('name', e.target.value)}
              placeholder="Ej: Push Pull Legs"
              style={inputStyle('name')}
            />
            {fieldErrors.name && (
              <span style={{ color: 'var(--color-danger)', fontSize: 12, marginTop: 4, display: 'block' }}>
                {fieldErrors.name}
              </span>
            )}
          </div>

          <div style={{ marginBottom: 16 }}>
            <label
              htmlFor="plan-description"
              style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 6 }}
            >
              Descripción
            </label>
            <textarea
              id="plan-description"
              value={form.description}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="Descripción opcional del plan..."
              rows={3}
              style={{
                ...inputStyle('description'),
                resize: 'vertical',
              }}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label
              htmlFor="plan-weeks"
              style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 6 }}
            >
              Duración (semanas)
            </label>
            <input
              id="plan-weeks"
              type="number"
              min={1}
              max={52}
              value={form.durationWeeks}
              onChange={(e) => updateField('durationWeeks', parseInt(e.target.value) || 1)}
              style={inputStyle('durationWeeks')}
            />
            {fieldErrors.durationWeeks && (
              <span style={{ color: 'var(--color-danger)', fontSize: 12, marginTop: 4, display: 'block' }}>
                {fieldErrors.durationWeeks}
              </span>
            )}
          </div>

          <div style={{ marginBottom: 16 }}>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 14,
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              <input
                type="checkbox"
                checked={form.isTemplate}
                onChange={(e) => updateField('isTemplate', e.target.checked)}
                style={{ width: 16, height: 16 }}
              />
              Crear como template
            </label>
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <button
              type="button"
              onClick={handleClose}
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
              disabled={loading}
              style={{
                flex: 1,
                padding: '10px',
                backgroundColor: 'var(--color-primary)',
                color: '#fff',
                border: 'none',
                borderRadius: 'var(--radius-button)',
                fontSize: 14,
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? 'Creando...' : 'Crear plan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
