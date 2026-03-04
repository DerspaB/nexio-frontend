'use client';

import type { Message } from '@nexio/types';

interface MessageBubbleProps {
  message: Message & { _status?: 'sending' | 'sent' };
  isOwn: boolean;
}

function formatTime(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
}

export function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: isOwn ? 'flex-end' : 'flex-start',
        padding: '2px 16px',
      }}
    >
      <div
        style={{
          maxWidth: '70%',
          padding: '8px 12px',
          borderRadius: isOwn ? '12px 12px 4px 12px' : '12px 12px 12px 4px',
          backgroundColor: isOwn ? '#0B2E8A' : '#F7F8FA',
          color: isOwn ? '#fff' : 'var(--color-text-primary)',
          fontSize: 14,
          lineHeight: 1.5,
          opacity: message._status === 'sending' ? 0.7 : 1,
        }}
      >
        <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
          {message.content}
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginTop: 4,
            fontSize: 11,
            color: isOwn ? 'rgba(255,255,255,0.7)' : 'var(--color-text-secondary)',
          }}
        >
          {formatTime(message.createdAt)}
          {message._status === 'sending' && (
            <span style={{ marginLeft: 4 }}>...</span>
          )}
        </div>
      </div>
    </div>
  );
}
