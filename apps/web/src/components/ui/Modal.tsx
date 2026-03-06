import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: number;
}

export function Modal({ open, title, onClose, children, maxWidth = 440 }: ModalProps) {
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
          maxWidth,
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
          }}
        >
          <h2 style={{ fontSize: 18, fontWeight: 700 }}>{title}</h2>
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
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
