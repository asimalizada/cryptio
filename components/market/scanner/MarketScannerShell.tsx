"use client";

import { ArrowDown, ArrowUp, ArrowUpDown, Filter, Search } from "lucide-react";

import type { MarketAsset } from "@/lib/types/market";
import { formatRelativeTime } from "@/lib/utils/format";

import type {
  MarketSortDirection,
  MarketSortKey,
} from "../market-view-model";
import { IconSurface, ScannerRow, TabButton } from "../shared/market-ui";

const LOADING_ROWS = Array.from({ length: 8 }, (_, index) => index);

export function MarketScannerShell({
  compareLimit,
  error,
  hasReachedCompareLimit,
  isError,
  isLoading,
  isStale,
  lastUpdated,
  onRetry,
  onSearchChange,
  onSort,
  onToggleCompare,
  searchQuery,
  selectedCompareIds,
  sortDirection,
  sortKey,
  totalAssetsCount,
  visibleAssets,
}: {
  compareLimit: number;
  error: string | null;
  hasReachedCompareLimit: boolean;
  isError: boolean;
  isLoading: boolean;
  isStale: boolean;
  lastUpdated: string | null;
  onRetry: () => void;
  onSearchChange: (value: string) => void;
  onSort: (key: MarketSortKey) => void;
  onToggleCompare: (assetId: string) => void;
  searchQuery: string;
  selectedCompareIds: string[];
  sortDirection: MarketSortDirection;
  sortKey: MarketSortKey;
  totalAssetsCount: number;
  visibleAssets: MarketAsset[];
}) {
  const isEmpty = !isLoading && !isError && visibleAssets.length === 0;

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
            <label className="market-panel-soft focus-ring interactive-surface flex h-11 min-w-[280px] items-center gap-3 rounded-[var(--radius-pill)] px-4">
              <Search className="h-4 w-4 text-[var(--color-dim)]" />
              <input
                value={searchQuery}
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder="Search assets by name or symbol..."
                className="w-full bg-transparent text-sm text-white placeholder:text-[var(--color-muted)] focus:outline-none"
              />
            </label>

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
          <div className="rounded-[12px] border border-rose-400/18 bg-rose-400/8 p-5">
            <p className="text-sm font-medium text-white">
              {error ?? "Market data could not be loaded. Try refreshing the scanner."}
            </p>
            <button
              type="button"
              onClick={onRetry}
              className="focus-ring interactive-surface mt-4 rounded-[9px] border border-white/12 bg-white/8 px-4 py-2 text-sm font-medium text-white hover:bg-white/12"
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
                <SortHeader
                  activeKey={sortKey}
                  direction={sortDirection}
                  label="#"
                  onSort={onSort}
                  sortKeyValue="marketCapRank"
                />
                <span>Asset</span>
                <SortHeader
                  activeKey={sortKey}
                  direction={sortDirection}
                  label="Price"
                  onSort={onSort}
                  sortKeyValue="currentPrice"
                />
                <SortHeader
                  activeKey={sortKey}
                  direction={sortDirection}
                  label="1h"
                  onSort={onSort}
                  sortKeyValue="priceChangePercentage1h"
                />
                <SortHeader
                  activeKey={sortKey}
                  direction={sortDirection}
                  label="24h"
                  onSort={onSort}
                  sortKeyValue="priceChangePercentage24h"
                />
                <SortHeader
                  activeKey={sortKey}
                  direction={sortDirection}
                  label="Market Cap"
                  onSort={onSort}
                  sortKeyValue="marketCap"
                />
                <SortHeader
                  activeKey={sortKey}
                  direction={sortDirection}
                  label="Volume"
                  onSort={onSort}
                  sortKeyValue="totalVolume"
                />
                <span>7d trend</span>
                <span />
              </div>

              {isLoading ? (
                <div className="divide-y divide-white/6">
                  {LOADING_ROWS.map((row) => (
                    <ScannerRowSkeleton key={row} />
                  ))}
                </div>
              ) : isEmpty ? (
                <div className="px-4 py-8 sm:px-5">
                  <div className="rounded-[12px] border border-white/8 bg-white/[0.02] px-5 py-6 text-sm text-[var(--color-muted)]">
                    No assets match your search.
                  </div>
                </div>
              ) : (
                <div className="divide-y divide-white/6">
                  {visibleAssets.map((asset) => (
                    <ScannerRow
                      key={asset.id}
                      asset={asset}
                      isCompareDisabled={
                        hasReachedCompareLimit &&
                        !selectedCompareIds.includes(asset.id)
                      }
                      isSelected={selectedCompareIds.includes(asset.id)}
                      onToggleCompare={onToggleCompare}
                    />
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
              <span>{`Showing ${visibleAssets.length} of ${totalAssetsCount} assets`}</span>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              {hasReachedCompareLimit ? (
                <span>{`Compare limit reached (${selectedCompareIds.length}/${compareLimit})`}</span>
              ) : null}
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

function SortHeader({
  activeKey,
  direction,
  label,
  onSort,
  sortKeyValue,
}: {
  activeKey: MarketSortKey;
  direction: MarketSortDirection;
  label: string;
  onSort: (key: MarketSortKey) => void;
  sortKeyValue: MarketSortKey;
}) {
  const isActive = activeKey === sortKeyValue;
  const Icon = !isActive ? ArrowUpDown : direction === "asc" ? ArrowUp : ArrowDown;

  return (
    <button
      type="button"
      onClick={() => onSort(sortKeyValue)}
      className={`flex items-center gap-1 text-left transition hover:text-white ${
        isActive ? "text-white" : ""
      }`}
    >
      <span>{label}</span>
      <Icon className="h-3.5 w-3.5" />
    </button>
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
      <div className="h-10 animate-pulse rounded-[10px] bg-white/[0.04]" />
      <div className="h-9 w-9 animate-pulse rounded-[9px] bg-white/8" />
    </div>
  );
}
