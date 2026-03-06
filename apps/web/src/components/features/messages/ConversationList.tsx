'use client';

import { useState, useMemo } from 'react';
import { MessageSquare, Search, SquarePen } from 'lucide-react';
import type { ConversationListItem } from '@nexio/types';
import { Skeleton } from '@/components/ui/Skeleton';
import { ConversationItem } from './ConversationItem';

interface ConversationListProps {
  conversations: ConversationListItem[];
  currentUserId: string;
  activeConversationId: string | null;
  isLoading: boolean;
  onSelect: (conversationId: string) => void;
  onNewConversation: () => void;
}

export function ConversationList({
  conversations,
  currentUserId,
  activeConversationId,
  isLoading,
  onSelect,
  onNewConversation,
}: ConversationListProps) {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const sorted = [...conversations].sort((a, b) => {
      const aTime = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
      const bTime = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;
      return bTime - aTime;
    });

    if (!search.trim()) return sorted;

    const q = search.toLowerCase();
    return sorted.filter((c) =>
      c.participants.some((p) => {
        if (p.userId === currentUserId) return false;
        const name = `${p.user.firstName} ${p.user.lastName}`.toLowerCase();
        return name.includes(q);
      }),
    );
  }, [conversations, currentUserId, search]);

  return (
    <div
      style={{
        width: 320,
        borderRight: '1px solid var(--color-border)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <div style={{ padding: '16px 16px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <MessageSquare size={20} style={{ color: 'var(--color-primary)' }} />
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Mensajes</h2>
          <div style={{ flex: 1 }} />
          <button
            onClick={onNewConversation}
            title="Nueva conversación"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 6,
              borderRadius: 8,
              color: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.15s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#EEF2FF'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
          >
            <SquarePen size={18} />
          </button>
        </div>

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
            placeholder="Buscar conversación..."
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

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {isLoading ? (
          <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, padding: '8px 0' }}>
                <Skeleton width={40} height={40} borderRadius="50%" />
                <div style={{ flex: 1 }}>
                  <Skeleton width="60%" height={14} style={{ marginBottom: 6 }} />
                  <Skeleton width="80%" height={12} />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 32,
              color: 'var(--color-text-secondary)',
              textAlign: 'center',
            }}
          >
            <MessageSquare size={40} style={{ marginBottom: 12, opacity: 0.3 }} />
            <p style={{ fontSize: 14 }}>
              {search ? 'Sin resultados' : 'No hay conversaciones aún'}
            </p>
          </div>
        ) : (
          filtered.map((c) => (
            <ConversationItem
              key={c.id}
              conversation={c}
              currentUserId={currentUserId}
              isActive={c.id === activeConversationId}
              onClick={() => onSelect(c.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
