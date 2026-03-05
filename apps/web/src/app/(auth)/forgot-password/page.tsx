'use client';

import { useState } from 'react';
import Link from 'next/link';
import { authApi } from '@/lib/api';

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus('loading');
    setError('');

    try {
      await authApi.forgotPassword({ email: email.trim() });
    } catch {
      // Always show success for security
    }
    setStatus('success');
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
            Revisa tu correo. Si el email está registrado, recibirás instrucciones en los
            próximos minutos.
          </p>
        </div>
        <Link
          href="/login"
          style={{
            display: 'block',
            textAlign: 'center',
            fontSize: 14,
            color: 'var(--color-primary)',
            textDecoration: 'none',
          }}
        >
          ← Volver al inicio de sesión
        </Link>
      </>
    );
  }

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
        ¿Olvidaste tu contraseña?
      </h1>
      <p
        style={{
          color: 'var(--color-text-secondary)',
          textAlign: 'center',
          marginBottom: 24,
          fontSize: 14,
        }}
      >
        Ingresa tu email y te enviaremos instrucciones
      </p>

      {error && (
        <div
          role="alert"
          aria-live="polite"
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
        <div style={{ marginBottom: 20 }}>
          <label
            htmlFor="email"
            style={{
              display: 'block',
              fontSize: 14,
              fontWeight: 500,
              marginBottom: 6,
            }}
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: 'var(--radius-input)',
              border: '1px solid var(--color-border)',
              fontSize: 14,
              outline: 'none',
            }}
          />
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
          {status === 'loading' ? 'Enviando...' : 'Enviar instrucciones'}
        </button>
      </form>

      <Link
        href="/login"
        style={{
          display: 'block',
          textAlign: 'center',
          marginTop: 16,
          fontSize: 14,
          color: 'var(--color-primary)',
          textDecoration: 'none',
        }}
      >
        ← Volver al inicio de sesión
      </Link>
    </>
  );
}
