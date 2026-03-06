import type { PlanStatus } from '@nexio/constants';
import { StatusPill } from '@/components/ui/StatusPill';

const PLAN_STATUS_CONFIG: Record<PlanStatus, { label: string; bg: string; color: string }> = {
  TEMPLATE: { label: 'Template', bg: '#EEF2FF', color: '#4338CA' },
  ACTIVE: { label: 'Activo', bg: '#DCFCE7', color: '#166534' },
  PAUSED: { label: 'Pausado', bg: '#FEF3C7', color: '#92400E' },
  COMPLETED: { label: 'Completado', bg: '#DBEAFE', color: '#1E40AF' },
};

interface PlanStatusPillProps {
  status: PlanStatus;
}

export function PlanStatusPill({ status }: PlanStatusPillProps) {
  return <StatusPill status={status} configMap={PLAN_STATUS_CONFIG} />;
}
