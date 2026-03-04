'use client';

interface TypingIndicatorProps {
  firstName: string;
}

export function TypingIndicator({ firstName }: TypingIndicatorProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 16px' }}>
      <span style={{ fontSize: 13, color: 'var(--color-text-secondary)', fontStyle: 'italic' }}>
        {firstName} está escribiendo
      </span>
      <span style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            style={{
              width: 5,
              height: 5,
              borderRadius: '50%',
              backgroundColor: 'var(--color-text-secondary)',
              animation: `typingDot 1.4s infinite`,
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </span>
      <style>{`
        @keyframes typingDot {
          0%, 60%, 100% { opacity: 0.3; transform: translateY(0); }
          30% { opacity: 1; transform: translateY(-3px); }
        }
      `}</style>
    </div>
  );
}
