'use client';

import { useEffect, useRef } from 'react';
import { MessageSquare } from 'lucide-react';
import type { Message } from '@nexio/types';
import { MessageBubble } from './MessageBubble';
import { ChatInput } from './ChatInput';
import { TypingIndicator } from './TypingIndicator';

interface ChatThreadProps {
  participantName: string;
  messages: (Message & { _status?: 'sending' | 'sent' })[];
  currentUserId: string;
  isTyping: { userId: string; firstName: string } | null;
  hasMore: boolean;
  isLoadingMore: boolean;
  onSend: (content: string) => void;
  onLoadMore: () => void;
  onTypingStart: () => void;
  onTypingStop: () => void;
}

function formatDayLabel(dateStr: string): string {
  const d = new Date(dateStr);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const msgDay = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diffDays = Math.floor((today.getTime() - msgDay.getTime()) / 86400000);

  if (diffDays === 0) return 'Hoy';
  if (diffDays === 1) return 'Ayer';
  return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
}

function groupByDay(messages: (Message & { _status?: string })[]) {
  const groups: { label: string; messages: (Message & { _status?: string })[] }[] = [];
  let currentLabel = '';

  for (const msg of messages) {
    const label = formatDayLabel(msg.createdAt);
    if (label !== currentLabel) {
      currentLabel = label;
      groups.push({ label, messages: [msg] });
    } else {
      groups[groups.length - 1].messages.push(msg);
    }
  }

  return groups;
}

export function ChatThread({
  participantName,
  messages,
  currentUserId,
  isTyping,
  hasMore,
  isLoadingMore,
  onSend,
  onLoadMore,
  onTypingStart,
  onTypingStop,
}: ChatThreadProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const wasAtBottomRef = useRef(true);
  const prevMessagesLenRef = useRef(0);

  useEffect(() => {
    if (messages.length > prevMessagesLenRef.current) {
      const added = messages.length - prevMessagesLenRef.current;
      const isNewMessage = added <= 2;
      if (isNewMessage && wasAtBottomRef.current) {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
    }
    prevMessagesLenRef.current = messages.length;
  }, [messages.length]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView();
    prevMessagesLenRef.current = messages.length;
  }, [participantName, messages.length]);

  function handleScroll() {
    const el = scrollRef.current;
    if (!el) return;

    wasAtBottomRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 50;

    if (el.scrollTop < 100 && hasMore && !isLoadingMore) {
      const prevHeight = el.scrollHeight;
      onLoadMore();
      requestAnimationFrame(() => {
        if (el) {
          el.scrollTop = el.scrollHeight - prevHeight;
        }
      });
    }
  }

  const groups = groupByDay(messages);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div
        style={{
          padding: '12px 16px',
          borderBottom: '1px solid var(--color-border)',
          backgroundColor: 'var(--color-surface)',
        }}
      >
        <h3 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>{participantName}</h3>
      </div>

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '8px 0',
        }}
      >
        {isLoadingMore && (
          <div style={{ textAlign: 'center', padding: 12 }}>
            <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>
              Cargando mensajes anteriores...
            </span>
          </div>
        )}

        {messages.length === 0 && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: 'var(--color-text-secondary)',
            }}
          >
            <MessageSquare size={40} style={{ marginBottom: 12, opacity: 0.3 }} />
            <p style={{ fontSize: 14 }}>Inicia la conversación</p>
          </div>
        )}

        {groups.map((group) => (
          <div key={group.label}>
            <div
              style={{
                textAlign: 'center',
                padding: '8px 0',
                margin: '4px 0',
              }}
            >
              <span
                style={{
                  fontSize: 12,
                  color: 'var(--color-text-secondary)',
                  backgroundColor: 'var(--color-surface)',
                  padding: '2px 12px',
                  borderRadius: 10,
                  border: '1px solid var(--color-border)',
                }}
              >
                {group.label}
              </span>
            </div>
            {group.messages.map((msg) => (
              <MessageBubble
                key={msg.id}
                message={msg as Message & { _status?: 'sending' | 'sent' }}
                isOwn={msg.senderId === currentUserId}
              />
            ))}
          </div>
        ))}

        {isTyping && <TypingIndicator firstName={isTyping.firstName} />}

        <div ref={bottomRef} />
      </div>

      <ChatInput
        onSend={onSend}
        onTypingStart={onTypingStart}
        onTypingStop={onTypingStop}
      />
    </div>
  );
}
