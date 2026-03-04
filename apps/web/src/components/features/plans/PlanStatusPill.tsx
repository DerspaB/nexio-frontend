import type { PlanStatus } from "@nexio/constants";

const STATUS_CONFIG: Record<
  PlanStatus,
  { label: string; bg: string; color: string }
> = {
  TEMPLATE: { label: "Template", bg: "#EEF2FF", color: "#4338CA" },
  ACTIVE: { label: "Activo", bg: "#DCFCE7", color: "#166534" },
  PAUSED: { label: "Pausado", bg: "#FEF3C7", color: "#92400E" },
  COMPLETED: { label: "Completado", bg: "#DBEAFE", color: "#1E40AF" },
};

interface PlanStatusPillProps {
  status: PlanStatus;
}

const FALLBACK = { label: "Desconocido", bg: "#F3F4F6", color: "#6B7280" };

export function PlanStatusPill({ status }: PlanStatusPillProps) {
  const config = STATUS_CONFIG[status] ?? FALLBACK;

  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 10px",
        borderRadius: 9999,
        fontSize: 12,
        fontWeight: 600,
        backgroundColor: config.bg,
        color: config.color,
        whiteSpace: "nowrap",
      }}
    >
      {config.label}
    </span>
  );
}
