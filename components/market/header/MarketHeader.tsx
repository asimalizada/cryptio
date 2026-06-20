"use client";

import { Activity, Gauge, RefreshCcw, Search } from "lucide-react";

import { CompactStatus } from "../shared/market-ui";

export function MarketHeader({
  isLoading,
  isStale,
  lastUpdatedLabel,
  onRefresh,
}: {
  isLoading: boolean;
  isStale: boolean;
  lastUpdatedLabel: string;
  onRefresh: () => void;
}) {
  return (
    <header className="market-panel-soft flex h-[72px] items-center justify-between rounded-[1.65rem] px-4 sm:px-5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[linear-gradient(135deg,rgba(34,211,238,0.88),rgba(74,222,128,0.88))] text-[var(--color-bg)] shadow-[0_0_40px_rgba(34,211,238,0.15)]">
          <Activity className="h-5 w-5" />
        </div>
        <div>
          <p className="text-[0.72rem] font-medium uppercase tracking-[0.34em] text-white/70">
            Cryptio
          </p>
          <p className="text-xs text-[var(--color-muted)]">Market scanner</p>
        </div>
      </div>

      <div className="hidden min-w-0 flex-1 px-6 lg:block">
        <div className="market-panel-soft flex h-12 items-center gap-3 rounded-full px-4">
          <Search className="h-4 w-4 text-[var(--color-dim)]" />
          <p className="min-w-0 truncate text-sm text-[var(--color-muted)]">
            Search assets by name or symbol...
          </p>
          <div className="ml-auto rounded-full border border-white/10 bg-white/6 px-2.5 py-1 text-[11px] font-medium text-[var(--color-muted)]">
            K
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <div className="hidden md:block">
          <CompactStatus
            isLoading={isLoading}
            isStale={isStale}
            lastUpdatedLabel={lastUpdatedLabel}
          />
        </div>

        <button
          type="button"
          onClick={onRefresh}
          className="flex h-11 items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 text-sm font-medium text-white transition hover:bg-white/10"
        >
          <RefreshCcw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          <span className="hidden sm:inline">Refresh</span>
        </button>

        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/6 text-[var(--color-muted)] transition hover:bg-white/10 hover:text-white"
          aria-label="Scanner status"
        >
          <Gauge className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
