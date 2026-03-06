'use client';

import { useState, useEffect, useMemo } from 'react';
import { X, Search } from 'lucide-react';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorAlert } from '@/components/ui/ErrorAlert';
import { useClients } from '@/hooks/use-clients';
import { messagingApi } from '@/lib/api';
import type { Conversation } from '@nexio/types';

interface NewConversationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConversationCreated: (conversation: Conversation) => void;
}

function getInitials(firstName: string, lastName: string) {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

export function NewConversationModal({
  isOpen,
  onClose,
  onConversationCreated,
}: NewConversationModalProps) {
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { clients, isLoading: clientsLoading } = useClients({ limit: 100 });

  useEffect(() => {
    if (isOpen) {
      setSearch('');
      setError('');
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const filtered = useMemo(() => {
    if (!search.trim()) return clients;
    const q = search.toLowerCase();
    return clients.filter((c) => {
      const name = `${c.user?.firstName ?? ''} ${c.user?.lastName ?? ''}`.toLowerCase();
      const email = (c.user?.email ?? '').toLowerCase();
      return name.includes(q) || email.includes(q);
    });
  }, [clients, search]);

  async function handleSelectClient(clientUserId: string) {
    if (loading) return;
    setLoading(true);
    setError('');

    try {
      const conversation = await messagingApi.createConversation({
        participantId: clientUserId,
      });
      onConversationCreated(conversation);
      onClose();
    } catch {
      setError('No se pudo iniciar la conversación. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(2px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 200,
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 400,
          backgroundColor: 'var(--color-surface)',
          borderRadius: 16,
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            borderBottom: '1px solid var(--color-border)',
          }}
        >
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>Nueva conversación</h3>
            <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', margin: '4px 0 0' }}>
              Selecciona un cliente para iniciar el chat
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 4,
              color: 'var(--color-text-secondary)',
            }}
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: '12px 20px' }}>
          <div style={{ position: 'relative' }}>
            <Search
              size={16}
              style={{
                position: 'absolute',
                left: 10,
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
              autoFocus
              style={{
                width: '100%',
                padding: '8px 12px 8px 32px',
                borderRadius: 'var(--radius-input)',
                border: '1px solid var(--color-border)',
                fontSize: 13,
                outline: 'none',
              }}
            />
          </div>
        </div>

        {error && (
          <div style={{ margin: '0 20px 8px' }}>
            <ErrorAlert message={error} />
          </div>
        )}

        <div style={{ maxHeight: 280, overflowY: 'auto', padding: '0 8px 12px' }}>
          {clientsLoading ? (
            <div style={{ padding: '0 12px' }}>
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '10px 12px',
                  }}
                >
                  <Skeleton width={36} height={36} borderRadius="50%" />
                  <div style={{ flex: 1 }}>
                    <Skeleton width="50%" height={13} style={{ marginBottom: 4 }} />
                    <Skeleton width="70%" height={11} />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div
              style={{
                padding: 24,
                textAlign: 'center',
                color: 'var(--color-text-secondary)',
                fontSize: 13,
              }}
            >
              {clients.length === 0
                ? 'No tienes clientes aún. Agrega clientes primero.'
                : 'Sin resultados'}
            </div>
          ) : (
            filtered.map((client) => {
              const firstName = client.user?.firstName ?? '';
              const lastName = client.user?.lastName ?? '';
              const email = client.user?.email ?? '';
              const userId = client.userId ?? client.id;

              return (
                <button
                  key={client.id}
                  onClick={() => handleSelectClient(userId)}
                  disabled={loading}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    width: '100%',
                    padding: '10px 12px',
                    border: 'none',
                    borderRadius: 'var(--radius-input)',
                    backgroundColor: 'transparent',
                    cursor: loading ? 'wait' : 'pointer',
                    textAlign: 'left',
                    transition: 'background-color 0.15s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#EEF2FF';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      backgroundColor: 'var(--color-primary)',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 13,
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    {getInitials(firstName, lastName)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 500,
                        color: 'var(--color-text-primary)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {firstName} {lastName}
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: 'var(--color-text-secondary)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {email}
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
