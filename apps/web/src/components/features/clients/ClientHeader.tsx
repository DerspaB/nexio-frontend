'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import type { Client } from '@nexio/types';
import type { ClientStatus } from '@nexio/constants';
import { clientsApi } from '@/lib/api';
import { ClientStatusPill } from './ClientStatusPill';

const STATUS_OPTIONS: { value: ClientStatus; label: string }[] = [
  { value: 'ACTIVE', label: 'Activo' },
  { value: 'AT_RISK', label: 'En riesgo' },
  { value: 'TRIAL', label: 'Prueba' },
  { value: 'INACTIVE', label: 'Inactivo' },
];

interface ClientHeaderProps {
  client: Client;
  onUpdate: () => void;
}

export function ClientHeader({ client, onUpdate }: ClientHeaderProps) {
  const router = useRouter();
  const [statusOpen, setStatusOpen] = useState(false);
  const [updating, setUpdating] = useState(false);

  async function handleStatusChange(status: ClientStatus) {
    setStatusOpen(false);
    if (status === client.status) return;
    setUpdating(true);
    try {
      await clientsApi.updateClient(client.id, { status });
      onUpdate();
    } finally {
      setUpdating(false);
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        marginBottom: 24,
      }}
    >
      <button
        onClick={() => router.push('/clients')}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 36,
          height: 36,
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-button)',
          backgroundColor: 'var(--color-surface)',
          cursor: 'pointer',
        }}
      >
        <ArrowLeft size={18} />
      </button>

      <div style={{ flex: 1 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>
          {client.user.firstName} {client.user.lastName}
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 14 }}>
          {client.user.email}
        </p>
      </div>

      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setStatusOpen(!statusOpen)}
          disabled={updating}
          style={{
            background: 'none',
            border: 'none',
            cursor: updating ? 'not-allowed' : 'pointer',
            opacity: updating ? 0.6 : 1,
          }}
        >
          <ClientStatusPill status={client.status} />
        </button>

        {statusOpen && (
          <div
            style={{
              position: 'absolute',
              right: 0,
              top: '100%',
              marginTop: 4,
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-input)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              zIndex: 10,
              minWidth: 140,
              overflow: 'hidden',
            }}
          >
            {STATUS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleStatusChange(opt.value)}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '8px 14px',
                  border: 'none',
                  backgroundColor:
                    client.status === opt.value ? '#F3F4F6' : 'transparent',
                  fontSize: 14,
                  textAlign: 'left',
                  cursor: 'pointer',
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
