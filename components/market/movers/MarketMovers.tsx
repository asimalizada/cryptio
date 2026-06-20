"use client";

import { Flame } from "lucide-react";

import type { MarketAsset } from "@/lib/types/market";
import { formatPercent } from "@/lib/utils/format";

import { AssetIcon } from "../shared/market-ui";
import { deriveTopMovers } from "../market-view-model";

const LOADING_MOVERS = Array.from({ length: 6 }, (_, index) => index);

export function MarketMovers({
  assets,
  isLoading,
}: {
  assets: MarketAsset[];
  isLoading: boolean;
}) {
  const movers = deriveTopMovers(assets);
  const marqueeAssets = [...movers, ...movers];

  return (
    <section className="market-panel stagger-in rounded-[var(--radius-card)] px-4 py-4 sm:px-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Flame className="h-4 w-4 text-[var(--color-amber)]" />
          <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-white/90">
            Top movers
          </h2>
        </div>

        <div className="rounded-[9px] border border-white/10 bg-white/6 px-3 py-1.5 text-xs font-medium text-white/80">
          24h
        </div>
      </div>

      {isLoading ? (
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
          {LOADING_MOVERS.map((item) => (
            <MoverSkeleton key={item} />
          ))}
        </div>
      ) : (
        <div className="relative mt-4 overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-[var(--color-bg-alt)] to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-[var(--color-bg-alt)] to-transparent" />

          <div className="movers-marquee flex w-max gap-3 pr-3">
            {marqueeAssets.map((asset, index) => (
              <MoverPill key={`${asset.id}-${index}`} asset={asset} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function MoverPill({ asset }: { asset: MarketAsset }) {
  const move = asset.priceChangePercentage24h;
  const toneClass =
    move !== null && move < 0 ? "text-[var(--color-down)]" : "text-[var(--color-up)]";

  return (
    <article className="interactive-surface w-[220px] shrink-0 rounded-[10px] border border-white/8 bg-white/[0.03] px-3 py-3 hover:border-white/14 hover:bg-white/[0.05]">
      <div className="flex items-center gap-3">
        <AssetIcon asset={asset} size="sm" />
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-white">{asset.symbol}</p>
          <p className="truncate text-xs text-[var(--color-muted)]">{asset.name}</p>
        </div>
        <p className={`ml-auto text-sm font-semibold ${toneClass}`}>
          {formatPercent(move)}
        </p>
      </div>
    </article>
  );
}

function MoverSkeleton() {
  return <div className="h-[62px] animate-pulse rounded-[10px] bg-white/[0.04]" />;
}
