'use client';

import { useParams } from 'next/navigation';
import { usePlan } from '@/hooks/use-plan';
import { Skeleton } from '@/components/ui/Skeleton';
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
          <Skeleton width={24} height={24} />
          <Skeleton width={200} height={20} />
        </div>
        <div style={{ display: 'flex', flex: 1 }}>
          <div style={{ width: 250, borderRight: '1px solid var(--color-border)', padding: 16 }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} width="100%" height={32} borderRadius={8} style={{ marginBottom: 8 }} />
            ))}
          </div>
          <div style={{ flex: 1, padding: 24 }}>
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} width="100%" height={80} borderRadius={12} style={{ marginBottom: 8 }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return <PlanEditor plan={plan} onMutate={() => mutate()} />;
}
