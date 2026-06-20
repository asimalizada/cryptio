"use client";

import { Activity, Gauge, RefreshCcw } from "lucide-react";

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
    <header className="market-panel-soft stagger-in flex h-[72px] items-center justify-between rounded-[var(--radius-panel)] px-4 sm:px-5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[linear-gradient(135deg,rgba(34,211,238,0.88),rgba(74,222,128,0.88))] text-[var(--color-bg)] shadow-[0_0_40px_rgba(34,211,238,0.15)] transition-transform duration-200 hover:scale-[1.02]">
          <Activity className="h-5 w-5" />
        </div>
        <div>
          <p className="text-[0.72rem] font-medium uppercase tracking-[0.34em] text-white/70">
            Cryptio
          </p>
          <p className="text-xs text-[var(--color-muted)]">Market scanner</p>
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
          className="focus-ring interactive-surface flex h-11 items-center gap-2 rounded-[var(--radius-pill)] border border-white/10 bg-white/6 px-4 text-sm font-medium text-white hover:border-white/16 hover:bg-white/10"
        >
          <RefreshCcw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          <span className="hidden sm:inline">Refresh</span>
        </button>

        <button
          type="button"
          className="focus-ring interactive-surface flex h-11 w-11 items-center justify-center rounded-[10px] border border-white/10 bg-white/6 text-[var(--color-muted)] hover:border-white/16 hover:bg-white/10 hover:text-white"
          aria-label="Scanner status"
        >
          <Gauge className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
