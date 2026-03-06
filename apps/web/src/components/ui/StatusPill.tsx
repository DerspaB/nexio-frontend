export interface StatusConfig {
  label: string;
  bg: string;
  color: string;
}

interface StatusPillProps {
  status: string;
  configMap: Record<string, StatusConfig>;
  fallback?: StatusConfig;
}

const DEFAULT_FALLBACK: StatusConfig = { label: 'Desconocido', bg: '#F3F4F6', color: '#6B7280' };

export function StatusPill({ status, configMap, fallback = DEFAULT_FALLBACK }: StatusPillProps) {
  const config = configMap[status] ?? fallback;

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
