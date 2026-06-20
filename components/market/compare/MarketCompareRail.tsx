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
    | "priceChangePercentage1h"
    | "priceChangePercentage24h"
    | "priceChangePercentage7d"
    | "marketCap"
    | "totalVolume";
  label: string;
}> = [
  { key: "currentPrice", label: "Price" },
  { key: "priceChangePercentage1h", label: "1h %" },
  { key: "priceChangePercentage24h", label: "24h %" },
  { key: "priceChangePercentage7d", label: "7d %" },
  { key: "marketCap", label: "Market Cap" },
  { key: "totalVolume", label: "Volume (24h)" },
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
  return (
    <aside className="xl:sticky xl:top-4 xl:self-start">
      <section className="market-panel stagger-in h-full rounded-[var(--radius-panel)]">
        <div className="flex items-center justify-between border-b border-[var(--color-border)] px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold tracking-[-0.03em] text-white">
              {`Compare (${selectedAssets.length}/${compareLimit})`}
            </h2>
            <p className="mt-1 text-sm text-[var(--color-muted)]">
              {selectedAssets.length === 0
                ? "Select assets from the scanner."
                : "Compare price, movement, and liquidity."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClear}
            disabled={selectedAssets.length === 0}
            className={`focus-ring interactive-surface rounded-[9px] border border-white/10 bg-white/6 px-3 py-1.5 text-xs font-medium text-white/80 hover:border-white/16 hover:bg-white/10 ${
              selectedAssets.length === 0 ? "cursor-not-allowed opacity-45 hover:translate-y-0" : ""
            }`}
          >
            Clear
          </button>
        </div>

        <div className="px-5 py-5">
          {selectedAssets.length === 0 ? (
            <div className="rounded-[12px] border border-dashed border-white/12 bg-white/[0.02] p-5">
              <p className="text-sm font-medium text-white">
                Select up to 3 assets from the scanner to compare price, movement,
                and liquidity.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {selectedAssets.map((asset) => (
                <SelectedAssetRow
                  key={asset.id}
                  asset={asset}
                  onRemove={onRemove}
                />
              ))}
            </div>
          )}

          <div className="mt-5 space-y-3">
            {isLoading ? (
              <>
                <CompareSkeleton />
                <CompareSkeleton />
                <CompareSkeleton />
              </>
            ) : (
              COMPARE_METRICS.map((metric) => (
                <CompareMetricRow
                  key={metric.key}
                  label={metric.label}
                  metricKey={metric.key}
                  selectedAssets={selectedAssets}
                />
              ))
            )}
          </div>
        </div>
      </section>
    </aside>
  );
}

function SelectedAssetRow({
  asset,
  onRemove,
}: {
  asset: MarketAsset;
  onRemove: (assetId: string) => void;
}) {
  return (
    <div className="interactive-surface flex items-center gap-3 rounded-[10px] border border-white/8 bg-white/[0.03] px-3 py-3 hover:border-white/14 hover:bg-white/[0.05]">
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
    <div className="interactive-surface rounded-[10px] border border-white/8 bg-white/[0.02] px-4 py-3 hover:border-white/14 hover:bg-white/[0.04]">
      <div className="mb-2 text-sm text-[var(--color-muted)]">{label}</div>
      <div
        className={
          selectedAssets.length >= 3
            ? "grid grid-cols-3 gap-3"
            : selectedAssets.length === 2
              ? "grid grid-cols-2 gap-3"
              : "grid grid-cols-1 gap-3"
        }
      >
        {selectedAssets.length === 0 ? (
          <span className="text-sm font-medium text-white/75">—</span>
        ) : (
          selectedAssets.map((asset) => (
            <span
              key={`${asset.id}-${metricKey}`}
              className={`text-sm font-medium ${
                metricKey.includes("priceChangePercentage")
                  ? toneClassFromMetric(asset[metricKey] as number | null)
                  : "text-white"
              }`}
            >
              {formatCompareValue(metricKey, asset)}
            </span>
          ))
        )}
      </div>
    </div>
  );
}

function CompareSkeleton() {
  return <div className="h-[46px] animate-pulse rounded-[10px] bg-white/[0.04]" />;
}

function formatCompareValue(
  metricKey: (typeof COMPARE_METRICS)[number]["key"],
  asset: MarketAsset,
) {
  switch (metricKey) {
    case "currentPrice":
      return formatCurrency(asset.currentPrice);
    case "priceChangePercentage1h":
      return formatPercent(asset.priceChangePercentage1h);
    case "priceChangePercentage24h":
      return formatPercent(asset.priceChangePercentage24h);
    case "priceChangePercentage7d":
      return formatPercent(asset.priceChangePercentage7d);
    case "marketCap":
      return formatCompactCurrency(asset.marketCap);
    case "totalVolume":
      return formatCompactCurrency(asset.totalVolume);
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
