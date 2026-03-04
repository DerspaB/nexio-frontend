export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--color-background)',
        padding: 'var(--spacing-md)',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 420,
          backgroundColor: 'var(--color-surface)',
          borderRadius: 'var(--radius-card)',
          padding: 'var(--spacing-xl)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        }}
      >
        {children}
      </div>
    </div>
  );
}
