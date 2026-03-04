'use client';

import type { ConversationListItem } from '@nexio/types';

interface ConversationItemProps {
  conversation: ConversationListItem;
  currentUserId: string;
  isActive: boolean;
  onClick: () => void;
}

function getInitials(firstName: string, lastName: string) {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

function formatRelativeTime(dateStr: string | null): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return 'ahora';
  if (diffMin < 60) return `hace ${diffMin} min`;
  if (diffHours < 24) return `hace ${diffHours}h`;

  const isYesterday =
    now.getDate() - date.getDate() === 1 &&
    now.getMonth() === date.getMonth() &&
    now.getFullYear() === date.getFullYear();
  if (isYesterday) return 'ayer';

  if (diffDays < 7) return `hace ${diffDays}d`;

  return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
}

function truncate(text: string, max: number) {
  return text.length > max ? text.slice(0, max) + '...' : text;
}

export function ConversationItem({
  conversation,
  currentUserId,
  isActive,
  onClick,
}: ConversationItemProps) {
  const otherParticipant = conversation.participants.find(
    (p) => p.userId !== currentUserId,
  );

  if (!otherParticipant) return null;

  const { firstName, lastName } = otherParticipant.user;
  const initials = getInitials(firstName, lastName);
  const lastMsg = conversation.lastMessage;
  const isOwn = lastMsg?.senderId === currentUserId;

  let preview = '';
  if (lastMsg) {
    const text = truncate(lastMsg.content, 50);
    preview = isOwn ? `Tú: ${text}` : text;
  }

  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        width: '100%',
        padding: '12px 16px',
        border: 'none',
        borderBottom: '1px solid var(--color-border)',
        backgroundColor: isActive ? '#F7F8FA' : 'transparent',
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'background-color 0.15s',
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          backgroundColor: 'var(--color-primary)',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 14,
          fontWeight: 700,
          flexShrink: 0,
        }}
      >
        {initials}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
          <span
            style={{
              fontSize: 14,
              fontWeight: conversation.unreadCount > 0 ? 700 : 500,
              color: 'var(--color-text-primary)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {firstName} {lastName}
          </span>
          <span style={{ fontSize: 11, color: 'var(--color-text-secondary)', flexShrink: 0, marginLeft: 8 }}>
            {formatRelativeTime(conversation.lastMessageAt)}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span
            style={{
              fontSize: 13,
              color: isOwn ? 'var(--color-text-secondary)' : 'var(--color-text-secondary)',
              fontWeight: conversation.unreadCount > 0 ? 600 : 400,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              flex: 1,
            }}
          >
            {preview || 'Sin mensajes'}
          </span>

          {conversation.unreadCount > 0 && (
            <span
              style={{
                minWidth: 20,
                height: 20,
                borderRadius: 10,
                backgroundColor: '#C62828',
                color: '#fff',
                fontSize: 11,
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 6px',
                flexShrink: 0,
              }}
            >
              {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
