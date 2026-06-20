"use client";

export function OverviewCardSkeleton() {
  return (
    <article className="market-panel rounded-[var(--radius-card)] p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="h-3 w-24 animate-pulse rounded-full bg-white/8" />
          <div className="mt-4 h-8 w-36 animate-pulse rounded-full bg-white/8" />
          <div className="mt-3 h-4 w-28 animate-pulse rounded-full bg-white/6" />
        </div>
        <div className="h-11 w-11 animate-pulse rounded-full bg-white/8" />
      </div>
      <div className="mt-5 h-12 animate-pulse rounded-[10px] bg-white/[0.04]" />
    </article>
  );
}
