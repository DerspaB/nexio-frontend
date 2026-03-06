'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Users, AlertTriangle, TrendingUp, Flame, ChevronRight } from 'lucide-react';
import type { UserPayload, Client } from '@nexio/types';
import { Skeleton } from '@/components/ui/Skeleton';
import { clientsApi } from '@/lib/api';

interface KpiData {
  activeCount: number;
  avgAdherence: number;
  atRiskCount: number;
  maxStreak: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserPayload | null>(null);
  const [kpis, setKpis] = useState<KpiData | null>(null);
  const [atRiskClients, setAtRiskClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) setUser(JSON.parse(userData));
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const [activeRes, atRiskRes] = await Promise.all([
          clientsApi.getClients({ status: 'ACTIVE', limit: 100 }),
          clientsApi.getClients({ status: 'AT_RISK', limit: 5 }),
        ]);

        const activeClients = activeRes.data;
        const avgAdherence =
          activeClients.length > 0
            ? Math.round(
                activeClients.reduce((sum, c) => sum + c.adherenceRate, 0) /
                  activeClients.length,
              )
            : 0;
        const maxStreak =
          activeClients.length > 0
            ? Math.max(...activeClients.map((c) => c.currentStreak))
            : 0;

        setKpis({
          activeCount: activeRes.total,
          avgAdherence,
          atRiskCount: atRiskRes.total,
          maxStreak,
        });
        setAtRiskClients(atRiskRes.data);
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const kpiCards = [
    {
      label: 'Clientes activos',
      value: kpis?.activeCount ?? 0,
      icon: Users,
      color: '#166534',
      bg: '#DCFCE7',
    },
    {
      label: 'Adherencia promedio',
      value: `${kpis?.avgAdherence ?? 0}%`,
      icon: TrendingUp,
      color: '#1E40AF',
      bg: '#DBEAFE',
    },
    {
      label: 'En riesgo',
      value: kpis?.atRiskCount ?? 0,
      icon: AlertTriangle,
      color: '#991B1B',
      bg: '#FEE2E2',
    },
    {
      label: 'Racha más alta',
      value: `${kpis?.maxStreak ?? 0}d`,
      icon: Flame,
      color: '#D97706',
      bg: '#FEF3C7',
    },
  ];

  function SkeletonCard() {
    return (
      <div
        style={{
          backgroundColor: 'var(--color-surface)',
          borderRadius: 'var(--radius-card)',
          padding: 'var(--spacing-lg)',
          border: '1px solid var(--color-border)',
        }}
      >
        <Skeleton width={100} height={12} style={{ marginBottom: 12 }} />
        <Skeleton width={60} height={28} />
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>
        {user ? `Bienvenido, ${user.firstName}` : 'Cargando...'}
      </h1>
      <p style={{ color: 'var(--color-text-secondary)', fontSize: 14, marginBottom: 24 }}>
        Panel de administración de coaching
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 16,
          marginBottom: 32,
        }}
      >
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          : kpiCards.map((kpi) => {
              const Icon = kpi.icon;
              return (
                <div
                  key={kpi.label}
                  style={{
                    backgroundColor: 'var(--color-surface)',
                    borderRadius: 'var(--radius-card)',
                    padding: 'var(--spacing-lg)',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 8,
                        backgroundColor: kpi.bg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Icon size={16} style={{ color: kpi.color }} />
                    </div>
                    <span style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
                      {kpi.label}
                    </span>
                  </div>
                  <div style={{ fontSize: 28, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                    {kpi.value}
                  </div>
                </div>
              );
            })}
      </div>

      <div
        style={{
          backgroundColor: 'var(--color-surface)',
          borderRadius: 'var(--radius-card)',
          border: '1px solid var(--color-border)',
          padding: 'var(--spacing-lg)',
          marginBottom: 24,
        }}
      >
        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>
          Clientes en riesgo
        </h2>

        {loading && (
          <div>
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} height={48} borderRadius={8} style={{ marginBottom: 8 }} />
            ))}
          </div>
        )}

        {!loading && atRiskClients.length === 0 && (
          <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', padding: '16px 0' }}>
            No hay clientes en riesgo actualmente.
          </p>
        )}

        {!loading && atRiskClients.length > 0 && (
          <div>
            {atRiskClients.map((client) => (
              <div
                key={client.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px 0',
                  borderBottom: '1px solid var(--color-border)',
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    backgroundColor: '#FEE2E2',
                    color: '#991B1B',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: 14,
                    marginRight: 12,
                    flexShrink: 0,
                  }}
                >
                  {client.user.firstName[0]}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>
                    {client.user.firstName} {client.user.lastName}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>
                    Adherencia: {client.adherenceRate}% &middot; Racha: {client.currentStreak}d
                  </div>
                </div>
                <button
                  onClick={() => router.push(`/clients/${client.id}`)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    padding: '6px 12px',
                    backgroundColor: 'transparent',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-button)',
                    fontSize: 13,
                    cursor: 'pointer',
                    color: 'var(--color-text-secondary)',
                  }}
                >
                  Ver perfil
                  <ChevronRight size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div
        style={{
          backgroundColor: 'var(--color-surface)',
          borderRadius: 'var(--radius-card)',
          border: '1px solid var(--color-border)',
          padding: 'var(--spacing-lg)',
        }}
      >
        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>
          Actividad reciente
        </h2>
        <p style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>
          Próximamente
        </p>
      </div>
    </div>
  );
}
