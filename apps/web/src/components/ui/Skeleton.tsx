interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  borderRadius?: number | string;
  style?: React.CSSProperties;
}

export function Skeleton({ width, height = 16, borderRadius = 4, style }: SkeletonProps) {
  return (
    <div
      style={{
        width,
        height,
        borderRadius,
        backgroundColor: 'var(--color-border)',
        animation: 'pulse 1.5s ease-in-out infinite',
        ...style,
      }}
    />
  );
}
