'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { useClients } from '@/hooks/use-clients';
import { Modal } from '@/components/ui/Modal';
import { Skeleton } from '@/components/ui/Skeleton';

interface AssignPlanModalProps {
  open: boolean;
  loading: boolean;
  onClose: () => void;
  onAssign: (clientId: string) => void;
}

export function AssignPlanModal({ open, loading, onClose, onAssign }: AssignPlanModalProps) {
  const [search, setSearch] = useState('');
  const { clients, isLoading } = useClients({ search: search || undefined, limit: 20 });

  return (
    <Modal open={open} title="Asignar a cliente" onClose={onClose}>
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
              <Skeleton key={i} height={40} borderRadius={8} style={{ marginBottom: 8 }} />
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
    </Modal>
  );
}
