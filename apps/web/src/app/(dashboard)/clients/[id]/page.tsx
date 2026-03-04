'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useClient } from '@/hooks/use-client';
import { ClientHeader } from '@/components/features/clients/ClientHeader';
import { ClientGeneralTab } from '@/components/features/clients/ClientGeneralTab';
import { ClientPlanTab } from '@/components/features/clients/ClientPlanTab';
import { ClientCheckInsTab } from '@/components/features/clients/ClientCheckInsTab';

const TABS = [
  { key: 'general', label: 'General' },
  { key: 'plan', label: 'Plan' },
  { key: 'checkins', label: 'Check-ins' },
] as const;

type TabKey = (typeof TABS)[number]['key'];

export default function ClientDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { client, isLoading, mutate } = useClient(id);
  const [activeTab, setActiveTab] = useState<TabKey>('general');

  if (isLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Header skeleton */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
          <div
            style={{
              width: 36,
              height: 36,
              backgroundColor: 'var(--color-border)',
              borderRadius: 'var(--radius-button)',
            }}
          />
          <div style={{ flex: 1 }}>
            <div
              style={{
                width: 200,
                height: 24,
                backgroundColor: 'var(--color-border)',
                borderRadius: 4,
                marginBottom: 8,
              }}
            />
            <div
              style={{
                width: 160,
                height: 14,
                backgroundColor: 'var(--color-border)',
                borderRadius: 4,
              }}
            />
          </div>
        </div>
        {/* Cards skeleton */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                height: 100,
                backgroundColor: 'var(--color-border)',
                borderRadius: 'var(--radius-card)',
                opacity: 0.5,
              }}
            />
          ))}
        </div>
        <div
          style={{
            height: 200,
            backgroundColor: 'var(--color-border)',
            borderRadius: 'var(--radius-card)',
            opacity: 0.5,
          }}
        />
      </div>
    );
  }

  if (!client) {
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
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>
          Cliente no encontrado
        </h3>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 14 }}>
          El cliente que buscas no existe o no tienes acceso.
        </p>
      </div>
    );
  }

  return (
    <div>
      <ClientHeader client={client} onUpdate={() => mutate()} />

      {/* Tabs */}
      <div
        style={{
          display: 'flex',
          gap: 0,
          borderBottom: '2px solid var(--color-border)',
          marginBottom: 24,
        }}
      >
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: '10px 20px',
              border: 'none',
              borderBottom:
                activeTab === tab.key
                  ? '2px solid var(--color-primary)'
                  : '2px solid transparent',
              marginBottom: -2,
              backgroundColor: 'transparent',
              color:
                activeTab === tab.key
                  ? 'var(--color-primary)'
                  : 'var(--color-text-secondary)',
              fontSize: 14,
              fontWeight: activeTab === tab.key ? 600 : 500,
              cursor: 'pointer',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'general' && (
        <ClientGeneralTab client={client} onUpdate={() => mutate()} />
      )}
      {activeTab === 'plan' && <ClientPlanTab clientId={id} />}
      {activeTab === 'checkins' && <ClientCheckInsTab clientId={id} />}
    </div>
  );
}
