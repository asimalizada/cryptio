"use client";

import { useMarketData } from "@/lib/api/market-client";
import { formatRelativeTime } from "@/lib/utils/format";

import { MarketCompareRail } from "./market-compare-rail";
import { MarketHeader } from "./market-header";
import { MarketMovers } from "./market-movers";
import { MarketOverview } from "./market-overview";
import { MarketScannerShell } from "./market-scanner-shell";

export function MarketPreviewShell() {
  const { data, error, isError, isLoading, isStale, lastUpdated, retry } =
    useMarketData();

  const assets = data?.assets ?? [];
  const lastUpdatedLabel = isLoading
    ? "Refreshing market"
    : lastUpdated
      ? `Updated ${formatRelativeTime(lastUpdated)}`
      : "Syncing market";

  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--color-bg)] text-[var(--color-text)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.08),transparent_24%),radial-gradient(circle_at_85%_12%,rgba(96,165,250,0.14),transparent_18%),linear-gradient(180deg,rgba(7,17,31,0.4),rgba(7,17,31,0.96))]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/10" />

      <section className="relative mx-auto flex min-h-screen w-full max-w-[1600px] flex-col px-4 py-4 sm:px-6 lg:px-8">
        <MarketHeader
          isLoading={isLoading}
          isStale={isStale}
          lastUpdatedLabel={lastUpdatedLabel}
          onRefresh={retry}
        />

        <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="min-w-0 space-y-4">
            <MarketOverview assets={assets} isLoading={isLoading} />
            <MarketMovers assets={assets} isLoading={isLoading} />
            <MarketScannerShell
              assets={assets}
              error={error}
              isError={isError}
              isLoading={isLoading}
              isStale={isStale}
              lastUpdated={lastUpdated}
              onRetry={retry}
            />
          </div>

          <MarketCompareRail isLoading={isLoading} />
        </div>
      </section>
    </main>
  );
}
