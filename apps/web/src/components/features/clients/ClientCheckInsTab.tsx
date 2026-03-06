'use client';

import { useState, useEffect, useMemo } from 'react';
import { ClipboardCheck } from 'lucide-react';
import type { CheckIn } from '@nexio/types';
import { Skeleton } from '@/components/ui/Skeleton';
import { checkInsApi } from '@/lib/api';

interface ClientCheckInsTabProps {
  clientId: string;
}

const MOOD_LABELS: Record<number, string> = {
  1: 'Muy mal', 2: 'Mal', 3: 'Normal', 4: 'Bien', 5: 'Excelente',
};

const ENERGY_LABELS: Record<number, string> = {
  1: 'Muy baja', 2: 'Baja', 3: 'Normal', 4: 'Alta', 5: 'Muy alta',
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function ClientCheckInsTab({ clientId }: ClientCheckInsTabProps) {
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      try {
        const now = new Date();
        const from = new Date(now);
        from.setDate(from.getDate() - 90);
        const res = await checkInsApi.getByClient(clientId, {
          from: from.toISOString().split('T')[0],
          to: now.toISOString().split('T')[0],
          limit: 100,
        });
        setCheckIns(res.data);
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, [clientId]);

  const heatmapData = useMemo(() => {
    const map = new Map<string, boolean>();
    checkIns.forEach((ci) => {
      const dateKey = ci.date.split('T')[0];
      map.set(dateKey, ci.completed);
    });

    const days: { date: string; status: 'completed' | 'missed' | 'none' }[] = [];
    const now = new Date();
    for (let i = 89; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      const hasData = map.has(key);
      days.push({
        date: key,
        status: hasData ? (map.get(key) ? 'completed' : 'missed') : 'none',
      });
    }
    return days;
  }, [checkIns]);

  const recentCheckIns = useMemo(
    () => [...checkIns].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10),
    [checkIns],
  );

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Skeleton height={120} borderRadius="var(--radius-card)" />
        <Skeleton height={200} borderRadius="var(--radius-card)" />
      </div>
    );
  }

  if (checkIns.length === 0) {
    return (
      <div
        style={{
          backgroundColor: 'var(--color-surface)',
          borderRadius: 'var(--radius-card)',
          border: '1px solid var(--color-border)',
          padding: 48,
          textAlign: 'center',
        }}
      >
        <ClipboardCheck size={48} style={{ color: 'var(--color-border)', marginBottom: 16 }} />
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Sin check-ins</h3>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 14 }}>
          Este cliente no ha registrado check-ins en los últimos 90 días.
        </p>
      </div>
    );
  }

  const statusColor = (status: string) => {
    if (status === 'completed') return '#166534';
    if (status === 'missed') return '#C62828';
    return 'var(--color-border)';
  };

  const statusBg = (status: string) => {
    if (status === 'completed') return '#DCFCE7';
    if (status === 'missed') return '#FEE2E2';
    return '#F3F4F6';
  };

  return (
    <div>
      <div
        style={{
          backgroundColor: 'var(--color-surface)',
          borderRadius: 'var(--radius-card)',
          border: '1px solid var(--color-border)',
          padding: 'var(--spacing-lg)',
          marginBottom: 16,
        }}
      >
        <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>
          Últimos 90 días
        </h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(18, 1fr)',
            gap: 3,
          }}
        >
          {heatmapData.map((day) => (
            <div
              key={day.date}
              title={`${day.date}: ${day.status === 'completed' ? 'Completado' : day.status === 'missed' ? 'No completado' : 'Sin dato'}`}
              style={{
                width: '100%',
                aspectRatio: '1',
                borderRadius: 3,
                backgroundColor: statusBg(day.status),
                border: `1px solid ${statusColor(day.status)}20`,
              }}
            />
          ))}
        </div>
        <div style={{ display: 'flex', gap: 16, marginTop: 10, fontSize: 11, color: 'var(--color-text-secondary)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: '#DCFCE7', border: '1px solid #166534', display: 'inline-block' }} />
            Completado
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: '#FEE2E2', border: '1px solid #C62828', display: 'inline-block' }} />
            No completado
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: '#F3F4F6', border: '1px solid var(--color-border)', display: 'inline-block' }} />
            Sin dato
          </span>
        </div>
      </div>

      <div
        style={{
          backgroundColor: 'var(--color-surface)',
          borderRadius: 'var(--radius-card)',
          border: '1px solid var(--color-border)',
          overflow: 'hidden',
        }}
      >
        <div style={{ padding: '16px 16px 8px' }}>
          <h3 style={{ fontSize: 14, fontWeight: 600 }}>Historial de check-ins</h3>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['Fecha', 'Estado', 'Ánimo', 'Energía', 'Notas'].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: '8px 16px',
                    fontSize: 11,
                    fontWeight: 600,
                    color: 'var(--color-text-secondary)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    backgroundColor: '#FAFBFC',
                    borderBottom: '1px solid var(--color-border)',
                    textAlign: 'left',
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recentCheckIns.map((ci) => (
              <tr key={ci.id}>
                <td style={cellStyle}>{formatDate(ci.date)}</td>
                <td style={cellStyle}>
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '2px 10px',
                      borderRadius: 9999,
                      fontSize: 12,
                      fontWeight: 600,
                      backgroundColor: ci.completed ? '#DCFCE7' : '#FEE2E2',
                      color: ci.completed ? '#166534' : '#991B1B',
                    }}
                  >
                    {ci.completed ? 'Completado' : 'No completado'}
                  </span>
                </td>
                <td style={cellStyle}>
                  {ci.mood ? MOOD_LABELS[ci.mood] || ci.mood : '—'}
                </td>
                <td style={cellStyle}>
                  {ci.energyLevel ? ENERGY_LABELS[ci.energyLevel] || ci.energyLevel : '—'}
                </td>
                <td style={{ ...cellStyle, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {ci.notes || '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const cellStyle: React.CSSProperties = {
  padding: '10px 16px',
  fontSize: 13,
  borderBottom: '1px solid var(--color-border)',
};
