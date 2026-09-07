export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-[3/4] bg-ink/5" />
          <div className="mt-3 h-3 w-2/3 bg-ink/10" />
          <div className="mt-2 h-3 w-1/3 bg-ink/10" />
        </div>
      ))}
    </div>
  );
}

export function Spinner({ className = '' }) {
  return (
    <div className={`inline-block h-5 w-5 border-2 border-burgundy/30 border-t-burgundy rounded-full animate-spin ${className}`} />
  );
}
