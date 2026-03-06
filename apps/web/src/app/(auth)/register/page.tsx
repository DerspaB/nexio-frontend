'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { registerSchema } from '@nexio/validations';
import { authApi, apiClient } from '@/lib/api';
import { setAuth } from '@/lib/auth';
import { ErrorAlert } from '@/components/ui/ErrorAlert';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    organizationName: '',
  });
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    const result = registerSchema.safeParse(form);
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
      const response = await authApi.register(result.data);
      apiClient.setToken(response.accessToken);
      setAuth(response.accessToken, response.user);
      router.push('/dashboard');
    } catch {
      setError('Error al registrar. Verifica los datos e intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  }

  const inputStyle = (field: string) => ({
    width: '100%' as const,
    padding: '10px 12px',
    borderRadius: 'var(--radius-input)',
    border: `1px solid ${fieldErrors[field] ? 'var(--color-danger)' : 'var(--color-border)'}`,
    fontSize: 14,
    outline: 'none',
  });

  const fields = [
    { key: 'firstName', label: 'Nombre', type: 'text', placeholder: 'Juan' },
    { key: 'lastName', label: 'Apellido', type: 'text', placeholder: 'Pérez' },
    { key: 'organizationName', label: 'Nombre del negocio', type: 'text', placeholder: 'Mi Gym' },
    { key: 'email', label: 'Email', type: 'email', placeholder: 'tu@email.com' },
    { key: 'password', label: 'Contraseña', type: 'password', placeholder: '••••••••' },
  ];

  return (
    <>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8, textAlign: 'center' }}>
        Crear cuenta
      </h1>
      <p
        style={{
          color: 'var(--color-text-secondary)',
          textAlign: 'center',
          marginBottom: 24,
          fontSize: 14,
        }}
      >
        Registra tu organización de coaching
      </p>

      {error && <ErrorAlert message={error} />}

      <form onSubmit={handleSubmit}>
        {fields.map(({ key, label, type, placeholder }) => (
          <div key={key} style={{ marginBottom: 16 }}>
            <label
              htmlFor={key}
              style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 6 }}
            >
              {label}
            </label>
            <input
              id={key}
              type={type}
              value={form[key as keyof typeof form]}
              onChange={(e) => updateField(key, e.target.value)}
              placeholder={placeholder}
              style={inputStyle(key)}
            />
            {fieldErrors[key] && (
              <span style={{ color: 'var(--color-danger)', fontSize: 12, marginTop: 4, display: 'block' }}>
                {fieldErrors[key]}
              </span>
            )}
          </div>
        ))}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: 'var(--color-primary)',
            color: '#fff',
            border: 'none',
            borderRadius: 'var(--radius-button)',
            fontSize: 14,
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
            marginTop: 8,
          }}
        >
          {loading ? 'Registrando...' : 'Crear cuenta'}
        </button>
      </form>

      <p
        style={{
          textAlign: 'center',
          marginTop: 16,
          fontSize: 14,
          color: 'var(--color-text-secondary)',
        }}
      >
        ¿Ya tienes cuenta?{' '}
        <Link href="/login" style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>
          Inicia sesión
        </Link>
      </p>
    </>
  );
}
