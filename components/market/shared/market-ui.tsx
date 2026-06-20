"use client";

import Image from "next/image";
import type { ReactNode } from "react";

import type { MarketAsset } from "@/lib/types/market";
import {
  formatCompactCurrency,
  formatCurrency,
  formatPercent,
} from "@/lib/utils/format";

import { toneClassFromValue } from "../market-view-model";

export function AssetIcon({
  asset,
  size,
}: {
  asset: MarketAsset;
  size: "sm" | "md";
}) {
  const sizeClass = size === "sm" ? "h-8 w-8" : "h-10 w-10";

  if (!asset.image) {
    return (
      <div
        className={`flex ${sizeClass} items-center justify-center rounded-[9px] bg-white/8 text-xs font-semibold text-white`}
      >
        {asset.symbol.slice(0, 2)}
      </div>
    );
  }

  return (
    <div className={`relative ${sizeClass} overflow-hidden rounded-[9px] bg-white/8`}>
      <Image
        src={asset.image}
        alt={asset.name}
        fill
        sizes={size === "sm" ? "32px" : "40px"}
        className="object-cover"
      />
    </div>
  );
}

export function MetricValue({ value }: { value: number | null }) {
  return (
    <p className={`text-sm font-medium ${toneClassFromValue(value)}`}>
      {formatPercent(value)}
    </p>
  );
}

export function Sparkline({ asset }: { asset: MarketAsset }) {
  const prices = asset.sparkline7d;

  if (prices.length < 2) {
    return <div className="h-10 rounded-2xl bg-white/[0.03]" />;
  }

  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min || 1;
  const tone =
    (asset.priceChangePercentage7d ?? 0) < 0
      ? "var(--color-down)"
      : "var(--color-up)";

  const points = prices
    .map((price, index) => {
      const x = (index / (prices.length - 1)) * 116;
      const y = 34 - ((price - min) / range) * 26;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg viewBox="0 0 116 34" className="h-10 w-[116px]">
      <polyline
        fill="none"
        stroke={tone}
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
        points={points}
      />
    </svg>
  );
}

export function TabButton({
  label,
  isActive = false,
}: {
  label: string;
  isActive?: boolean;
}) {
  return (
    <button
      type="button"
      className={`focus-ring interactive-surface rounded-[var(--radius-pill)] px-4 py-2 text-sm font-medium ${
        isActive
          ? "border border-cyan-400/30 bg-cyan-400/10 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
          : "border border-white/8 bg-white/[0.03] text-[var(--color-muted)] hover:bg-white/[0.06] hover:text-white"
      }`}
    >
      {label}
    </button>
  );
}

export function IconSurface({ children }: { children: ReactNode }) {
  return (
    <button
      type="button"
      className="focus-ring interactive-surface flex h-10 w-10 items-center justify-center rounded-[9px] border border-white/8 bg-white/[0.03] text-[var(--color-muted)] hover:border-white/14 hover:bg-white/[0.06] hover:text-white"
    >
      {children}
    </button>
  );
}

export function CompactStatus({
  isLoading,
  isStale,
  lastUpdatedLabel,
}: {
  isLoading: boolean;
  isStale: boolean;
  lastUpdatedLabel: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-[9px] border border-white/10 bg-white/5 px-3 py-2">
      <span
        className={`h-2 w-2 rounded-full ${
          isLoading
            ? "bg-[var(--color-cyan)]"
            : isStale
              ? "bg-[var(--color-amber)]"
              : "bg-[var(--color-up)]"
        }`}
      />
      <span className="text-xs text-[var(--color-muted)]">{lastUpdatedLabel}</span>
    </div>
  );
}

export function ScannerRow({ asset }: { asset: MarketAsset }) {
  return (
    <div className="grid grid-cols-[48px_68px_1.7fr_1fr_0.9fr_0.9fr_1.1fr_1.05fr_124px_56px] items-center gap-3 px-4 py-4 transition-[background-color,transform] duration-200 hover:bg-white/[0.025] sm:px-5">
      <div className="text-[var(--color-muted)]">☆</div>
      <div className="text-sm font-medium text-white">
        {asset.marketCapRank ?? "—"}
      </div>

      <div className="flex items-center gap-3">
        <AssetIcon asset={asset} size="md" />
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-white">{asset.symbol}</p>
          <p className="truncate text-sm text-[var(--color-muted)]">{asset.name}</p>
        </div>
      </div>

      <p className="text-sm font-medium text-white">{formatCurrency(asset.currentPrice)}</p>
      <MetricValue value={asset.priceChangePercentage1h} />
      <MetricValue value={asset.priceChangePercentage24h} />
      <p className="text-sm text-white">{formatCompactCurrency(asset.marketCap)}</p>
      <p className="text-sm text-white">{formatCompactCurrency(asset.totalVolume)}</p>
      <Sparkline asset={asset} />

      <button
        type="button"
        className="focus-ring interactive-surface flex h-9 w-9 items-center justify-center rounded-[9px] border border-white/10 bg-white/[0.04] text-[var(--color-muted)] hover:border-cyan-400/20 hover:bg-cyan-400/[0.08] hover:text-white"
        aria-label={`Add ${asset.name} to compare`}
      >
        +
      </button>
    </div>
  );
}
