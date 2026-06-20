"use client";

import { ArrowUpDown, Filter, Search } from "lucide-react";

import type { MarketAsset } from "@/lib/types/market";
import { formatRelativeTime } from "@/lib/utils/format";

import { IconSurface, ScannerRow, TabButton } from "../shared/market-ui";

const LOADING_ROWS = Array.from({ length: 8 }, (_, index) => index);

export function MarketScannerShell({
  assets,
  error,
  isError,
  isLoading,
  isStale,
  lastUpdated,
  onRetry,
}: {
  assets: MarketAsset[];
  error: string | null;
  isError: boolean;
  isLoading: boolean;
  isStale: boolean;
  lastUpdated: string | null;
  onRetry: () => void;
}) {
  return (
    <section className="market-panel stagger-in rounded-[var(--radius-panel)]">
      <div className="border-b border-[var(--color-border)] px-4 py-4 sm:px-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h2 className="text-[1.28rem] font-semibold tracking-[-0.03em] text-white">
              Market scanner
            </h2>
            <p className="mt-1 text-sm text-[var(--color-muted)]">
              Scan market leaders, pressure points, and recent movement.
            </p>
          </div>

          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="market-panel-soft focus-ring interactive-surface flex h-11 min-w-[280px] items-center gap-3 rounded-[var(--radius-pill)] px-4">
              <Search className="h-4 w-4 text-[var(--color-dim)]" />
              <p className="truncate text-sm text-[var(--color-muted)]">
                Search assets by name or symbol...
              </p>
            </div>

            <div className="flex items-center gap-2">
              <TabButton label="All Coins" isActive />
              <TabButton label="Top 100" />
              <IconSurface>
                <Filter className="h-4 w-4" />
              </IconSurface>
            </div>
          </div>
        </div>
      </div>

      {isError ? (
        <div className="px-4 py-5 sm:px-5">
          <div className="rounded-[16px] border border-rose-400/18 bg-rose-400/8 p-5">
            <p className="text-sm font-medium text-white">
              {error ?? "Market data could not be loaded. Try refreshing the scanner."}
            </p>
            <button
              type="button"
              onClick={onRetry}
              className="focus-ring interactive-surface mt-4 rounded-[12px] border border-white/12 bg-white/8 px-4 py-2 text-sm font-medium text-white hover:bg-white/12"
            >
              Retry
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <div className="min-w-[980px]">
              <div className="grid grid-cols-[48px_68px_1.7fr_1fr_0.9fr_0.9fr_1.1fr_1.05fr_124px_56px] items-center gap-3 border-b border-[var(--color-border)] px-4 py-3 text-[0.72rem] font-medium uppercase tracking-[0.16em] text-[var(--color-dim)] sm:px-5">
                <span />
                <span>#</span>
                <span>Asset</span>
                <span className="flex items-center gap-1">
                  Price
                  <ArrowUpDown className="h-3.5 w-3.5" />
                </span>
                <span>1h</span>
                <span>24h</span>
                <span>Market Cap</span>
                <span>Volume</span>
                <span>7d trend</span>
                <span />
              </div>

              {isLoading ? (
                <div className="divide-y divide-white/6">
                  {LOADING_ROWS.map((row) => (
                    <ScannerRowSkeleton key={row} />
                  ))}
                </div>
              ) : (
                <div className="divide-y divide-white/6">
                  {assets.slice(0, 10).map((asset) => (
                    <ScannerRow key={asset.id} asset={asset} />
                  ))}
                </div>
              )}
            </div>
          </div>

          <footer className="flex flex-col gap-3 border-t border-[var(--color-border)] px-4 py-4 text-sm text-[var(--color-muted)] sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <div className="flex flex-wrap items-center gap-4">
              <span className="flex items-center gap-2">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    isLoading
                      ? "bg-[var(--color-cyan)]"
                      : isStale
                        ? "bg-[var(--color-amber)]"
                        : "bg-[var(--color-up)]"
                  }`}
                />
                {isLoading ? "Refreshing market data" : "Data from CoinGecko"}
              </span>
              <span>{`Showing 1-${Math.min(assets.length, 10)} of ${assets.length} assets`}</span>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <span>{isStale ? "Data may be stale" : "Market data loaded"}</span>
              <span>
                {lastUpdated ? `Updated ${formatRelativeTime(lastUpdated)}` : "Pending sync"}
              </span>
            </div>
          </footer>
        </>
      )}
    </section>
  );
}

function ScannerRowSkeleton() {
  return (
    <div className="grid grid-cols-[48px_68px_1.7fr_1fr_0.9fr_0.9fr_1.1fr_1.05fr_124px_56px] items-center gap-3 px-4 py-4 sm:px-5">
      <div className="h-4 w-4 animate-pulse rounded-full bg-white/8" />
      <div className="h-4 w-8 animate-pulse rounded-full bg-white/8" />
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 animate-pulse rounded-full bg-white/8" />
        <div className="space-y-2">
          <div className="h-4 w-16 animate-pulse rounded-full bg-white/8" />
          <div className="h-3 w-24 animate-pulse rounded-full bg-white/6" />
        </div>
      </div>
      <div className="h-4 w-20 animate-pulse rounded-full bg-white/8" />
      <div className="h-4 w-14 animate-pulse rounded-full bg-white/8" />
      <div className="h-4 w-14 animate-pulse rounded-full bg-white/8" />
      <div className="h-4 w-20 animate-pulse rounded-full bg-white/8" />
      <div className="h-4 w-20 animate-pulse rounded-full bg-white/8" />
      <div className="h-10 animate-pulse rounded-2xl bg-white/[0.04]" />
      <div className="h-9 w-9 animate-pulse rounded-full bg-white/8" />
    </div>
  );
}
