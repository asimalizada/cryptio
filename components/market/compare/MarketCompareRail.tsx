"use client";

import { X } from "lucide-react";

import type { MarketAsset } from "@/lib/types/market";
import {
  formatCompactCurrency,
  formatCurrency,
  formatPercent,
} from "@/lib/utils/format";

import { AssetIcon } from "../shared/market-ui";

const COMPARE_METRICS: Array<{
  key:
    | "currentPrice"
    | "priceChangePercentage24h"
    | "priceChangePercentage7d"
    | "marketCap"
    | "totalVolume"
    | "priceChangePercentage1h";
  label: string;
}> = [
  { key: "currentPrice", label: "Price" },
  { key: "priceChangePercentage24h", label: "24h %" },
  { key: "priceChangePercentage7d", label: "7d %" },
  { key: "marketCap", label: "Market Cap" },
  { key: "totalVolume", label: "Volume (24h)" },
  { key: "priceChangePercentage1h", label: "1h %" },
];

export function MarketCompareRail({
  compareLimit,
  isLoading,
  onClear,
  onRemove,
  selectedAssets,
}: {
  compareLimit: number;
  isLoading: boolean;
  onClear: () => void;
  onRemove: (assetId: string) => void;
  selectedAssets: MarketAsset[];
}) {
  const hasSelection = selectedAssets.length > 0;

  return (
    <aside className="xl:sticky xl:top-4 xl:self-start">
      <section className="market-panel stagger-in overflow-hidden rounded-[var(--radius-panel)]">
        <div className="flex items-start justify-between gap-4 border-b border-[var(--color-border)] px-5 py-5">
          <div>
            <h2 className="text-[1.05rem] font-semibold uppercase tracking-[0.06em] text-white">
              {`Compare (${selectedAssets.length}/${compareLimit})`}
            </h2>
            <p className="mt-2 text-sm text-[var(--color-muted)]">
              {hasSelection
                ? "Compare price, movement, and liquidity."
                : "Select assets from the scanner."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClear}
            disabled={!hasSelection}
            className={`focus-ring interactive-surface rounded-[9px] border border-cyan-400/16 bg-cyan-400/[0.05] px-3 py-1.5 text-xs font-medium text-white hover:border-cyan-400/26 hover:bg-cyan-400/[0.1] ${
              !hasSelection ? "cursor-not-allowed opacity-45 hover:translate-y-0" : ""
            }`}
          >
            Clear
          </button>
        </div>

        <div className="px-5 py-4">
          {hasSelection ? (
            <div className="overflow-hidden rounded-[10px] border border-white/8 bg-white/[0.02]">
              {selectedAssets.map((asset, index) => (
                <SelectedAssetRow
                  key={asset.id}
                  asset={asset}
                  isLast={index === selectedAssets.length - 1}
                  onRemove={onRemove}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-[12px] border border-dashed border-white/12 bg-white/[0.02] p-5">
              <p className="text-sm font-medium text-white">
                Select up to 3 assets from the scanner to compare price, movement,
                and liquidity.
              </p>
            </div>
          )}
        </div>

        <div className="border-t border-[var(--color-border)] px-5 py-4">
          {isLoading ? (
            <div className="space-y-3">
              <CompareGridSkeleton />
              <CompareGridSkeleton />
              <CompareGridSkeleton />
              <CompareGridSkeleton />
            </div>
          ) : hasSelection ? (
            <div className="space-y-1">
              <CompareColumnHeader selectedAssets={selectedAssets} />
              <div className="space-y-0.5">
                {COMPARE_METRICS.map((metric) => (
                  <CompareMetricRow
                    key={metric.key}
                    label={metric.label}
                    metricKey={metric.key}
                    selectedAssets={selectedAssets}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="rounded-[10px] border border-white/8 bg-white/[0.02] px-4 py-4 text-sm text-[var(--color-muted)]">
              Comparison metrics will appear here once you select assets.
            </div>
          )}
        </div>
      </section>
    </aside>
  );
}

function SelectedAssetRow({
  asset,
  isLast,
  onRemove,
}: {
  asset: MarketAsset;
  isLast: boolean;
  onRemove: (assetId: string) => void;
}) {
  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 ${
        isLast ? "" : "border-b border-white/8"
      }`}
    >
      <AssetIcon asset={asset} size="sm" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-white">{asset.symbol}</p>
        <p className="truncate text-xs text-[var(--color-muted)]">{asset.name}</p>
      </div>
      <button
        type="button"
        onClick={() => onRemove(asset.id)}
        className="focus-ring interactive-surface flex h-8 w-8 items-center justify-center rounded-[8px] border border-white/8 bg-white/[0.03] text-[var(--color-muted)] hover:border-white/14 hover:bg-white/[0.08] hover:text-white"
        aria-label={`Remove ${asset.name} from comparison`}
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

function CompareColumnHeader({
  selectedAssets,
}: {
  selectedAssets: MarketAsset[];
}) {
  const iconOnly = selectedAssets.length >= 3;

  return (
    <div
      className="grid items-center gap-4 border-b border-white/8 pb-3"
      style={{ gridTemplateColumns: `90px repeat(${selectedAssets.length}, minmax(0, 1fr))` }}
    >
      <div />
      {selectedAssets.map((asset) => (
        <div
          key={asset.id}
          className={`flex items-center ${iconOnly ? "justify-center" : "gap-2"}`}
        >
          <AssetIcon asset={asset} size="sm" />
          {!iconOnly ? (
            <span className="truncate text-sm font-medium text-white">
              {asset.symbol}
            </span>
          ) : null}
        </div>
      ))}
    </div>
  );
}

function CompareMetricRow({
  label,
  metricKey,
  selectedAssets,
}: {
  label: string;
  metricKey: (typeof COMPARE_METRICS)[number]["key"];
  selectedAssets: MarketAsset[];
}) {
  return (
    <div
      className="grid items-center gap-4 border-b border-white/6 py-3 last:border-b-0"
      style={{ gridTemplateColumns: `90px repeat(${selectedAssets.length}, minmax(0, 1fr))` }}
    >
      <div className="text-sm text-[var(--color-muted)]">{label}</div>
      {selectedAssets.map((asset) => (
        <div
          key={`${asset.id}-${metricKey}`}
          className={`truncate text-sm font-medium ${
            metricKey.includes("priceChangePercentage")
              ? toneClassFromMetric(asset[metricKey] as number | null)
              : "text-white"
          }`}
        >
          {formatCompareValue(metricKey, asset)}
        </div>
      ))}
    </div>
  );
}

function CompareGridSkeleton() {
  return <div className="h-10 animate-pulse rounded-[8px] bg-white/[0.04]" />;
}

function formatCompareValue(
  metricKey: (typeof COMPARE_METRICS)[number]["key"],
  asset: MarketAsset,
) {
  switch (metricKey) {
    case "currentPrice":
      return formatCurrency(asset.currentPrice);
    case "priceChangePercentage24h":
      return formatPercent(asset.priceChangePercentage24h);
    case "priceChangePercentage7d":
      return formatPercent(asset.priceChangePercentage7d);
    case "marketCap":
      return formatCompactCurrency(asset.marketCap);
    case "totalVolume":
      return formatCompactCurrency(asset.totalVolume);
    case "priceChangePercentage1h":
      return formatPercent(asset.priceChangePercentage1h);
  }
}

function toneClassFromMetric(value: number | null) {
  if (value === null) {
    return "text-white/75";
  }

  if (value < 0) {
    return "text-[var(--color-down)]";
  }

  if (value > 0) {
    return "text-[var(--color-up)]";
  }

  return "text-white";
}
