interface LoadingSkeletonProps {
  className?: string
  lines?: number
}

export function LoadingSkeleton({ className = '', lines = 3 }: LoadingSkeletonProps) {
  return (
    <div className={`animate-pulse space-y-3 ${className}`} aria-busy="true" aria-label="Cargando...">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="rounded-lg bg-[var(--color-bg-elevated)]"
          style={{ height: '1rem', width: i === lines - 1 ? '60%' : '100%', opacity: 1 - i * 0.15 }}
        />
      ))}
    </div>
  )
}

export function CardSkeleton() {
  return (
    <div className="animate-pulse rounded-xl bg-[var(--color-bg-surface)] p-5 border border-[var(--color-border)]">
      <div className="h-40 rounded-lg bg-[var(--color-bg-elevated)] mb-4" />
      <div className="h-4 bg-[var(--color-bg-elevated)] rounded mb-2 w-3/4" />
      <div className="h-3 bg-[var(--color-bg-elevated)] rounded mb-2" />
      <div className="h-3 bg-[var(--color-bg-elevated)] rounded w-5/6" />
      <div className="flex gap-2 mt-4">
        <div className="h-5 w-16 bg-[var(--color-bg-elevated)] rounded-full" />
        <div className="h-5 w-20 bg-[var(--color-bg-elevated)] rounded-full" />
      </div>
    </div>
  )
}
