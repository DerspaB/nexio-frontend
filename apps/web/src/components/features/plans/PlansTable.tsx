'use client';

import { useRouter } from 'next/navigation';
import { ChevronRight, Copy, Trash2 } from 'lucide-react';
import type { Plan } from '@nexio/types';
import { Skeleton } from '@/components/ui/Skeleton';
import { PlanStatusPill } from './PlanStatusPill';
import type { PlanStatus } from '@nexio/constants';

interface PlansTableProps {
  plans: Plan[];
  isLoading: boolean;
  onDuplicate?: (id: string) => void;
  onDelete?: (id: string) => void;
}

function SkeletonRow() {
  return (
    <tr>
      <td style={cellStyle}><Skeleton width={160} height={14} /></td>
      <td style={cellStyle}><Skeleton width={70} height={14} /></td>
      <td style={cellStyle}><Skeleton width={120} height={14} /></td>
      <td style={cellStyle}><Skeleton width={80} height={14} /></td>
      <td style={cellStyle}><Skeleton width={70} height={14} /></td>
      <td style={cellStyle}><Skeleton width={60} height={14} /></td>
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

export function PlansTable({ plans, isLoading, onDuplicate, onDelete }: PlansTableProps) {
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
            <th style={headerStyle}>Tipo</th>
            <th style={headerStyle}>Cliente</th>
            <th style={headerStyle}>Duración</th>
            <th style={headerStyle}>Estado</th>
            <th style={{ ...headerStyle, width: 80 }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {isLoading &&
            Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)}

          {!isLoading &&
            plans.map((plan) => (
              <tr
                key={plan.id}
                onClick={() => router.push(`/plans/${plan.id}`)}
                style={{ cursor: 'pointer' }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = '#FAFBFC';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = '';
                }}
              >
                <td style={{ ...cellStyle, fontWeight: 500 }}>
                  {plan.name}
                </td>
                <td style={cellStyle}>
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '2px 10px',
                      borderRadius: 9999,
                      fontSize: 12,
                      fontWeight: 600,
                      backgroundColor: plan.isTemplate ? '#EEF2FF' : '#FEF3C7',
                      color: plan.isTemplate ? '#4338CA' : '#92400E',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {plan.isTemplate ? 'Template' : 'Asignado'}
                  </span>
                </td>
                <td style={{ ...cellStyle, color: 'var(--color-text-secondary)' }}>
                  {plan.client
                    ? `${plan.client.user?.firstName ?? ''} ${plan.client.user?.lastName ?? ''}`.trim()
                    : '—'}
                </td>
                <td style={cellStyle}>
                  {plan.durationWeeks} sem.
                </td>
                <td style={cellStyle}>
                  <PlanStatusPill status={plan.status as PlanStatus} />
                </td>
                <td style={{ ...cellStyle, textAlign: 'center' }}>
                  <div style={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
                    <button
                      title="Duplicar"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDuplicate?.(plan.id);
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 4,
                        color: 'var(--color-text-secondary)',
                        borderRadius: 4,
                      }}
                    >
                      <Copy size={15} />
                    </button>
                    <button
                      title="Eliminar"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete?.(plan.id);
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 4,
                        color: 'var(--color-text-secondary)',
                        borderRadius: 4,
                      }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
