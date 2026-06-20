"use client";

export function MarketCompareRail({ isLoading }: { isLoading: boolean }) {
  return (
    <aside className="xl:sticky xl:top-4 xl:self-start">
      <section className="market-panel stagger-in h-full rounded-[var(--radius-panel)]">
        <div className="flex items-center justify-between border-b border-[var(--color-border)] px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold tracking-[-0.03em] text-white">
              Compare (0/3)
            </h2>
            <p className="mt-1 text-sm text-[var(--color-muted)]">
              Select assets from the scanner.
            </p>
          </div>

          <button
            type="button"
            className="focus-ring interactive-surface rounded-[12px] border border-white/10 bg-white/6 px-3 py-1.5 text-xs font-medium text-white/80 hover:border-white/16 hover:bg-white/10"
          >
            Clear
          </button>
        </div>

        <div className="px-5 py-5">
          <div className="rounded-[16px] border border-dashed border-white/12 bg-white/[0.02] p-5">
            <p className="text-sm font-medium text-white">
              Select up to 3 assets from the scanner to compare price, movement,
              and liquidity.
            </p>
          </div>

          <div className="mt-5 space-y-3">
            {isLoading ? (
              <>
                <CompareSkeleton />
                <CompareSkeleton />
                <CompareSkeleton />
              </>
            ) : (
              <>
                <CompareMetricRow label="Price" />
                <CompareMetricRow label="24h %" />
                <CompareMetricRow label="7d %" />
                <CompareMetricRow label="Market Cap" />
                <CompareMetricRow label="Volume (24h)" />
              </>
            )}
          </div>
        </div>
      </section>
    </aside>
  );
}

function CompareMetricRow({ label }: { label: string }) {
  return (
    <div className="interactive-surface flex items-center justify-between rounded-[14px] border border-white/8 bg-white/[0.02] px-4 py-3 hover:border-white/14 hover:bg-white/[0.04]">
      <span className="text-sm text-[var(--color-muted)]">{label}</span>
      <span className="text-sm font-medium text-white/75">—</span>
    </div>
  );
}

function CompareSkeleton() {
  return <div className="h-[46px] animate-pulse rounded-[14px] bg-white/[0.04]" />;
}
