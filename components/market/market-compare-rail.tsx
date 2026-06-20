"use client";

export function MarketCompareRail({ isLoading }: { isLoading: boolean }) {
  return (
    <aside className="xl:sticky xl:top-4 xl:self-start">
      <section className="market-panel h-full rounded-[1.65rem]">
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
            className="rounded-full border border-white/10 bg-white/6 px-3 py-1.5 text-xs font-medium text-white/80"
          >
            Clear
          </button>
        </div>

        <div className="px-5 py-5">
          <div className="rounded-[1.4rem] border border-dashed border-white/12 bg-white/[0.02] p-5">
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
    <div className="flex items-center justify-between rounded-[1.05rem] border border-white/8 bg-white/[0.02] px-4 py-3">
      <span className="text-sm text-[var(--color-muted)]">{label}</span>
      <span className="text-sm font-medium text-white/75">—</span>
    </div>
  );
}

function CompareSkeleton() {
  return <div className="h-[46px] animate-pulse rounded-[1.05rem] bg-white/[0.04]" />;
}
