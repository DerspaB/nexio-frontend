interface ErrorAlertProps {
  message: string;
  children?: React.ReactNode;
}

export function ErrorAlert({ message, children }: ErrorAlertProps) {
  return (
    <div
      role="alert"
      style={{
        backgroundColor: '#FEE2E2',
        color: 'var(--color-danger)',
        padding: '12px 16px',
        borderRadius: 'var(--radius-input)',
        marginBottom: 16,
        fontSize: 14,
      }}
    >
      {message}
      {children}
    </div>
  );
}
