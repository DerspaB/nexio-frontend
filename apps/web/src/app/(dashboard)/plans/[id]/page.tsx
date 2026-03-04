'use client';

import { useParams } from 'next/navigation';
import { usePlan } from '@/hooks/use-plan';
import { PlanEditor } from '@/components/features/plans/PlanEditor';

export default function PlanDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { plan, isLoading, mutate } = usePlan(id);

  if (isLoading || !plan) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <div
          style={{
            padding: '12px 24px',
            borderBottom: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-surface)',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
          }}
        >
          <div style={{ width: 24, height: 24, backgroundColor: 'var(--color-border)', borderRadius: 4, animation: 'pulse 1.5s ease-in-out infinite' }} />
          <div style={{ width: 200, height: 20, backgroundColor: 'var(--color-border)', borderRadius: 4, animation: 'pulse 1.5s ease-in-out infinite' }} />
        </div>
        <div style={{ display: 'flex', flex: 1 }}>
          <div style={{ width: 250, borderRight: '1px solid var(--color-border)', padding: 16 }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} style={{ width: '100%', height: 32, backgroundColor: 'var(--color-border)', borderRadius: 8, marginBottom: 8, animation: 'pulse 1.5s ease-in-out infinite' }} />
            ))}
          </div>
          <div style={{ flex: 1, padding: 24 }}>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} style={{ width: '100%', height: 80, backgroundColor: 'var(--color-border)', borderRadius: 12, marginBottom: 8, animation: 'pulse 1.5s ease-in-out infinite' }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return <PlanEditor plan={plan} onMutate={() => mutate()} />;
}
