'use client';

import { useState } from 'react';
import { createClientSchema } from '@nexio/validations';
import { clientsApi } from '@/lib/api';
import { Modal } from '@/components/ui/Modal';
import { ErrorAlert } from '@/components/ui/ErrorAlert';

interface CreateClientModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export function CreateClientModal({ open, onClose, onCreated }: CreateClientModalProps) {
  const [form, setForm] = useState({
    email: '',
    firstName: '',
    lastName: '',
    password: '',
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function resetForm() {
    setForm({ email: '', firstName: '', lastName: '', password: '' });
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

    const result = createClientSchema.safeParse(form);
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
      await clientsApi.createClient(result.data);
      resetForm();
      onCreated();
    } catch {
      setError('Error al crear el cliente. Verifica los datos.');
    } finally {
      setLoading(false);
    }
  }

  const fields = [
    { key: 'firstName', label: 'Nombre', type: 'text', placeholder: 'Juan' },
    { key: 'lastName', label: 'Apellido', type: 'text', placeholder: 'Pérez' },
    { key: 'email', label: 'Email', type: 'email', placeholder: 'cliente@email.com' },
    { key: 'password', label: 'Contraseña', type: 'password', placeholder: '••••••••' },
  ];

  const inputStyle = (field: string): React.CSSProperties => ({
    width: '100%',
    padding: '10px 12px',
    borderRadius: 'var(--radius-input)',
    border: `1px solid ${fieldErrors[field] ? 'var(--color-danger)' : 'var(--color-border)'}`,
    fontSize: 14,
    outline: 'none',
  });

  return (
    <Modal open={open} title="Nuevo cliente" onClose={handleClose} maxWidth={440}>
        {error && <ErrorAlert message={error} />}

        <form onSubmit={handleSubmit}>
          {fields.map(({ key, label, type, placeholder }) => (
            <div key={key} style={{ marginBottom: 16 }}>
              <label
                htmlFor={`create-${key}`}
                style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 6 }}
              >
                {label}
              </label>
              <input
                id={`create-${key}`}
                type={type}
                value={form[key as keyof typeof form]}
                onChange={(e) => updateField(key, e.target.value)}
                placeholder={placeholder}
                style={inputStyle(key)}
              />
              {fieldErrors[key] && (
                <span
                  style={{
                    color: 'var(--color-danger)',
                    fontSize: 12,
                    marginTop: 4,
                    display: 'block',
                  }}
                >
                  {fieldErrors[key]}
                </span>
              )}
            </div>
          ))}

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
              {loading ? 'Creando...' : 'Crear cliente'}
            </button>
          </div>
        </form>
    </Modal>
  );
}
