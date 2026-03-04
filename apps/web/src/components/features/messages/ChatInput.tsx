'use client';

import { useState, useRef, useCallback } from 'react';
import { SendHorizontal } from 'lucide-react';

interface ChatInputProps {
  onSend: (content: string) => void;
  onTypingStart: () => void;
  onTypingStop: () => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, onTypingStart, onTypingStop, disabled }: ChatInputProps) {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 100)}px`;
  }, []);

  function handleSend() {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue('');
    onTypingStop();
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setValue(e.target.value);
    onTypingStart();
    adjustHeight();
  }

  const canSend = value.trim().length > 0 && !disabled;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: 8,
        padding: '12px 16px',
        borderTop: '1px solid var(--color-border)',
        backgroundColor: 'var(--color-surface)',
      }}
    >
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onBlur={onTypingStop}
        placeholder="Escribe un mensaje..."
        rows={1}
        style={{
          flex: 1,
          padding: '10px 12px',
          borderRadius: 'var(--radius-input)',
          border: '1px solid var(--color-border)',
          fontSize: 14,
          outline: 'none',
          resize: 'none',
          lineHeight: 1.5,
          maxHeight: 100,
          fontFamily: 'inherit',
        }}
      />
      <button
        onClick={handleSend}
        disabled={!canSend}
        style={{
          width: 40,
          height: 40,
          borderRadius: 'var(--radius-button)',
          border: 'none',
          backgroundColor: canSend ? 'var(--color-primary)' : 'var(--color-border)',
          color: canSend ? '#fff' : 'var(--color-text-secondary)',
          cursor: canSend ? 'pointer' : 'default',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          transition: 'background-color 0.15s',
        }}
      >
        <SendHorizontal size={18} />
      </button>
    </div>
  );
}
