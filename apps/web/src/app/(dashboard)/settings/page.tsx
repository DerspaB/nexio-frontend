'use client';

import { Settings } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Ajustes</h1>
      <p style={{ color: 'var(--color-text-secondary)', fontSize: 14, marginBottom: 32 }}>
        Configuración de tu cuenta y organización
      </p>

      <div
        style={{
          backgroundColor: 'var(--color-surface)',
          borderRadius: 'var(--radius-card)',
          border: '1px solid var(--color-border)',
          padding: 48,
          textAlign: 'center',
        }}
      >
        <Settings size={48} style={{ color: 'var(--color-border)', marginBottom: 16 }} />
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Próximamente</h3>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 14 }}>
          La configuración de cuenta estará disponible pronto.
        </p>
      </div>
    </div>
  );
}
