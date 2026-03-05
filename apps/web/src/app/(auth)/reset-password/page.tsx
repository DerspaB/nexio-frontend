'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { authApi } from '@/lib/api';

type Status = 'idle' | 'loading' | 'success' | 'error';

function getStrengthColor(password: string): { color: string; width: string; label: string } {
  if (password.length === 0) return { color: 'var(--color-border)', width: '0%', label: '' };
  if (password.length < 8) return { color: '#C62828', width: '33%', label: 'Débil' };
  if (password.length < 12) return { color: '#F59E0B', width: '66%', label: 'Media' };
  return { color: '#1E7F4F', width: '100%', label: 'Fuerte' };
}

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [apiError, setApiError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  if (!token) {
    return (
      <>
        <div
          role="alert"
          style={{
            backgroundColor: '#FEE2E2',
            border: '1px solid #FECACA',
            borderRadius: 'var(--radius-input)',
            padding: 20,
            textAlign: 'center',
            marginBottom: 16,
          }}
        >
          <p style={{ fontSize: 14, color: '#C62828', fontWeight: 600, marginBottom: 8 }}>
            Token no encontrado
          </p>
          <p style={{ fontSize: 13, color: '#991B1B' }}>
            El enlace es inválido o ha expirado.
          </p>
        </div>
        <Link
          href="/forgot-password"
          style={{
            display: 'block',
            textAlign: 'center',
            fontSize: 14,
            color: 'var(--color-primary)',
            textDecoration: 'none',
          }}
        >
          Solicitar nuevo enlace
        </Link>
      </>
    );
  }

  if (status === 'success') {
    return (
      <>
        <div
          style={{
            backgroundColor: '#DCFCE7',
            border: '1px solid #BBF7D0',
            borderRadius: 'var(--radius-input)',
            padding: 20,
            textAlign: 'center',
            marginBottom: 16,
          }}
        >
          <span style={{ fontSize: 24, display: 'block', marginBottom: 8 }}>✓</span>
          <p style={{ fontSize: 14, color: '#166534', lineHeight: 1.5 }}>
            ¡Contraseña actualizada! Ahora puedes iniciar sesión.
          </p>
        </div>
        <Link
          href="/login"
          style={{
            display: 'block',
            width: '100%',
            padding: '12px',
            backgroundColor: 'var(--color-primary)',
            color: '#fff',
            border: 'none',
            borderRadius: 'var(--radius-button)',
            fontSize: 14,
            fontWeight: 600,
            textAlign: 'center',
            textDecoration: 'none',
          }}
        >
          Ir a iniciar sesión
        </Link>
      </>
    );
  }

  function validate(): boolean {
    const errors: Record<string, string> = {};
    if (password.length < 8) {
      errors.password = 'La contraseña debe tener al menos 8 caracteres';
    }
    if (password !== confirmPassword) {
      errors.confirmPassword = 'Las contraseñas no coinciden';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setApiError('');
    if (!validate()) return;

    setStatus('loading');

    try {
      await authApi.resetPassword({ token: token!, password });
      setStatus('success');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Token inválido o expirado';
      setApiError(message);
      setStatus('error');
    }
  }

  const strength = getStrengthColor(password);

  return (
    <>
      <h1
        style={{
          fontSize: 24,
          fontWeight: 700,
          marginBottom: 8,
          textAlign: 'center',
        }}
      >
        Crear nueva contraseña
      </h1>
      <p
        style={{
          color: 'var(--color-text-secondary)',
          textAlign: 'center',
          marginBottom: 24,
          fontSize: 14,
        }}
      >
        Ingresa tu nueva contraseña
      </p>

      {apiError && (
        <div
          role="alert"
          aria-live="polite"
          style={{
            backgroundColor: '#FEE2E2',
            color: '#C62828',
            padding: '12px 16px',
            borderRadius: 'var(--radius-input)',
            marginBottom: 16,
            fontSize: 14,
          }}
        >
          {apiError}
          <Link
            href="/forgot-password"
            style={{
              display: 'block',
              marginTop: 8,
              fontSize: 13,
              color: 'var(--color-primary)',
              textDecoration: 'none',
            }}
          >
            Solicitar nuevo enlace →
          </Link>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label
            htmlFor="password"
            style={{
              display: 'block',
              fontSize: 14,
              fontWeight: 500,
              marginBottom: 6,
            }}
          >
            Nueva contraseña
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setFieldErrors((prev) => ({ ...prev, password: '' }));
            }}
            placeholder="Mínimo 8 caracteres"
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: 'var(--radius-input)',
              border: `1px solid ${fieldErrors.password ? 'var(--color-danger)' : 'var(--color-border)'}`,
              fontSize: 14,
              outline: 'none',
            }}
          />
          {password.length > 0 && (
            <div style={{ marginTop: 6 }}>
              <div
                style={{
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: 'var(--color-border)',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: strength.width,
                    backgroundColor: strength.color,
                    transition: 'width 0.3s, background-color 0.3s',
                  }}
                />
              </div>
              <span style={{ fontSize: 11, color: strength.color, marginTop: 2, display: 'block' }}>
                {strength.label}
              </span>
            </div>
          )}
          {fieldErrors.password && (
            <span
              aria-live="polite"
              style={{
                color: 'var(--color-danger)',
                fontSize: 12,
                marginTop: 4,
                display: 'block',
              }}
            >
              {fieldErrors.password}
            </span>
          )}
        </div>

        <div style={{ marginBottom: 24 }}>
          <label
            htmlFor="confirmPassword"
            style={{
              display: 'block',
              fontSize: 14,
              fontWeight: 500,
              marginBottom: 6,
            }}
          >
            Confirmar contraseña
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setFieldErrors((prev) => ({ ...prev, confirmPassword: '' }));
            }}
            placeholder="Repite la contraseña"
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: 'var(--radius-input)',
              border: `1px solid ${fieldErrors.confirmPassword ? 'var(--color-danger)' : 'var(--color-border)'}`,
              fontSize: 14,
              outline: 'none',
            }}
          />
          {fieldErrors.confirmPassword && (
            <span
              aria-live="polite"
              style={{
                color: 'var(--color-danger)',
                fontSize: 12,
                marginTop: 4,
                display: 'block',
              }}
            >
              {fieldErrors.confirmPassword}
            </span>
          )}
        </div>

        <button
          type="submit"
          disabled={status === 'loading'}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: 'var(--color-primary)',
            color: '#fff',
            border: 'none',
            borderRadius: 'var(--radius-button)',
            fontSize: 14,
            fontWeight: 600,
            cursor: status === 'loading' ? 'not-allowed' : 'pointer',
            opacity: status === 'loading' ? 0.7 : 1,
          }}
        >
          {status === 'loading' ? 'Restableciendo...' : 'Restablecer contraseña'}
        </button>
      </form>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div style={{ textAlign: 'center', padding: 24 }}>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 14 }}>Cargando...</p>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
