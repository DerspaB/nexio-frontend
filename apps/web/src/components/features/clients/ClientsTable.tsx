'use client';

import { useRouter } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import type { Client } from '@nexio/types';
import { ClientStatusPill } from './ClientStatusPill';

interface ClientsTableProps {
  clients: Client[];
  isLoading: boolean;
}

function SkeletonRow() {
  const skeletonBlock = (width: number): React.CSSProperties => ({
    width,
    height: 14,
    backgroundColor: 'var(--color-border)',
    borderRadius: 4,
    animation: 'pulse 1.5s ease-in-out infinite',
  });

  return (
    <tr>
      <td style={cellStyle}><div style={skeletonBlock(140)} /></td>
      <td style={cellStyle}><div style={skeletonBlock(180)} /></td>
      <td style={cellStyle}><div style={skeletonBlock(60)} /></td>
      <td style={cellStyle}><div style={skeletonBlock(40)} /></td>
      <td style={cellStyle}><div style={skeletonBlock(30)} /></td>
      <td style={cellStyle}><div style={skeletonBlock(20)} /></td>
    </tr>
  );
}

const cellStyle: React.CSSProperties = {
  padding: '12px 16px',
  fontSize: 14,
  borderBottom: '1px solid var(--color-border)',
  whiteSpace: 'nowrap',
};

const headerStyle: React.CSSProperties = {
  ...cellStyle,
  fontSize: 12,
  fontWeight: 600,
  color: 'var(--color-text-secondary)',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  backgroundColor: '#FAFBFC',
};

export function ClientsTable({ clients, isLoading }: ClientsTableProps) {
  const router = useRouter();

  return (
    <div
      style={{
        backgroundColor: 'var(--color-surface)',
        borderRadius: 'var(--radius-card)',
        border: '1px solid var(--color-border)',
        overflow: 'hidden',
      }}
    >
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={headerStyle}>Nombre</th>
            <th style={headerStyle}>Email</th>
            <th style={headerStyle}>Estado</th>
            <th style={{ ...headerStyle, textAlign: 'right' }}>Adherencia</th>
            <th style={{ ...headerStyle, textAlign: 'right' }}>Racha</th>
            <th style={{ ...headerStyle, width: 40 }} />
          </tr>
        </thead>
        <tbody>
          {isLoading &&
            Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)}

          {!isLoading &&
            clients.map((client) => (
              <tr
                key={client.id}
                onClick={() => router.push(`/clients/${client.id}`)}
                style={{ cursor: 'pointer' }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = '#FAFBFC';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = '';
                }}
              >
                <td style={{ ...cellStyle, fontWeight: 500 }}>
                  {client.user.firstName} {client.user.lastName}
                </td>
                <td style={{ ...cellStyle, color: 'var(--color-text-secondary)' }}>
                  {client.user.email}
                </td>
                <td style={cellStyle}>
                  <ClientStatusPill status={client.status} />
                </td>
                <td
                  style={{
                    ...cellStyle,
                    textAlign: 'right',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {client.adherenceRate}%
                </td>
                <td
                  style={{
                    ...cellStyle,
                    textAlign: 'right',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {client.currentStreak}d
                </td>
                <td style={{ ...cellStyle, textAlign: 'center' }}>
                  <ChevronRight size={16} color="var(--color-text-secondary)" />
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
