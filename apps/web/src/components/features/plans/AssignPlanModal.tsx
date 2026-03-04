'use client';

import { useState } from 'react';
import { X, Search } from 'lucide-react';
import { useClients } from '@/hooks/use-clients';

interface AssignPlanModalProps {
  open: boolean;
  loading: boolean;
  onClose: () => void;
  onAssign: (clientId: string) => void;
}

export function AssignPlanModal({ open, loading, onClose, onAssign }: AssignPlanModalProps) {
  const [search, setSearch] = useState('');
  const { clients, isLoading } = useClients({ search: search || undefined, limit: 20 });

  if (!open) return null;

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
          maxWidth: 440,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700 }}>Asignar a cliente</h2>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: 'var(--color-text-secondary)' }}
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ position: 'relative', marginBottom: 16 }}>
          <Search
            size={14}
            style={{
              position: 'absolute',
              left: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--color-text-secondary)',
            }}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar cliente..."
            style={{
              width: '100%',
              padding: '10px 12px 10px 34px',
              borderRadius: 'var(--radius-input)',
              border: '1px solid var(--color-border)',
              fontSize: 14,
              outline: 'none',
            }}
          />
        </div>

        <div style={{ maxHeight: 300, overflowY: 'auto' }}>
          {isLoading && (
            <div style={{ padding: 16, textAlign: 'center' }}>
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    height: 40,
                    backgroundColor: 'var(--color-border)',
                    borderRadius: 8,
                    marginBottom: 8,
                    animation: 'pulse 1.5s ease-in-out infinite',
                  }}
                />
              ))}
            </div>
          )}

          {!isLoading && clients.length === 0 && (
            <div style={{ padding: 24, textAlign: 'center', fontSize: 14, color: 'var(--color-text-secondary)' }}>
              No se encontraron clientes
            </div>
          )}

          {!isLoading &&
            clients.map((client) => (
              <button
                key={client.id}
                onClick={() => onAssign(client.id)}
                disabled={loading}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  width: '100%',
                  padding: '12px',
                  background: 'none',
                  border: 'none',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  borderRadius: 8,
                  textAlign: 'left',
                  fontSize: 14,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = '#F7F8FA';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = '';
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    backgroundColor: '#EEF2FF',
                    color: 'var(--color-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: 14,
                  }}
                >
                  {client.user.firstName[0]}
                </div>
                <div>
                  <div style={{ fontWeight: 500 }}>
                    {client.user.firstName} {client.user.lastName}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>
                    {client.user.email}
                  </div>
                </div>
              </button>
            ))}
        </div>
      </div>
    </div>
  );
}
