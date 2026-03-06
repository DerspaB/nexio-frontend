'use client';

import { createContext, useContext, useState, useCallback } from 'react';

interface Toast {
  id: number;
  message: string;
  type: 'error' | 'success';
}

interface ToastContextValue {
  toast: {
    error: (message: string) => void;
    success: (message: string) => void;
  };
}

const ToastContext = createContext<ToastContextValue | null>(null);

let nextId = 0;

export function useToast(): ToastContextValue['toast'] {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx.toast;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: 'error' | 'success') => {
    const id = nextId++;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const toast = {
    error: useCallback((message: string) => addToast(message, 'error'), [addToast]),
    success: useCallback((message: string) => addToast(message, 'success'), [addToast]),
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          zIndex: 9999,
        }}
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            style={{
              padding: '12px 20px',
              borderRadius: 'var(--radius-card)',
              backgroundColor: t.type === 'error' ? '#FEE2E2' : '#DCFCE7',
              color: t.type === 'error' ? '#991B1B' : '#166534',
              fontSize: 14,
              fontWeight: 500,
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              maxWidth: 360,
              animation: 'fadeIn 0.2s ease-out',
            }}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
