import type { ClientStatus } from '@nexio/constants';

const STATUS_CONFIG: Record<
  ClientStatus,
  { label: string; bg: string; color: string }
> = {
  ACTIVE: { label: 'Activo', bg: '#DCFCE7', color: '#166534' },
  AT_RISK: { label: 'En riesgo', bg: '#FEE2E2', color: '#991B1B' },
  TRIAL: { label: 'Prueba', bg: '#F3E8FF', color: '#6B21A8' },
  INACTIVE: { label: 'Inactivo', bg: '#F3F4F6', color: '#6B7280' },
};

interface ClientStatusPillProps {
  status: ClientStatus;
}

export function ClientStatusPill({ status }: ClientStatusPillProps) {
  const config = STATUS_CONFIG[status];

  return (
    <span
      style={{
        display: 'inline-block',
        padding: '2px 10px',
        borderRadius: 9999,
        fontSize: 12,
        fontWeight: 600,
        backgroundColor: config.bg,
        color: config.color,
        whiteSpace: 'nowrap',
      }}
    >
      {config.label}
    </span>
  );
}
