"use client";

import type { MarketAsset } from "@/lib/types/market";

import type { OverviewVisual as OverviewVisualType } from "../market-view-model";

export function OverviewVisual({
  visual,
  assets,
}: {
  visual: OverviewVisualType;
  assets: MarketAsset[];
}) {
  if (visual === "breadth") {
    const valid24hMoves = assets
      .map((asset) => asset.priceChangePercentage24h)
      .filter((value): value is number => value !== null);
    const positiveMoves = valid24hMoves.filter((value) => value > 0).length;
    const ratio =
      valid24hMoves.length > 0 ? (positiveMoves / valid24hMoves.length) * 100 : null;

    return <BreadthMeter ratio={ratio} />;
  }

  if (visual === "volume") {
    return <VolumeBar values={assets.slice(0, 12).map((asset) => asset.totalVolume)} />;
  }

  const values =
    visual === "dominance"
      ? assets.slice(0, 12).map((asset) => asset.priceChangePercentage7d)
      : assets.slice(0, 12).map((asset) => asset.priceChangePercentage24h);

  return (
    <MicroTrendBar
      values={values}
      tone={visual === "dominance" ? "neutral" : "up"}
    />
  );
}

function MicroTrendBar({
  values,
  tone,
}: {
  values: Array<number | null>;
  tone: "up" | "neutral";
}) {
  const filtered = values.filter((value): value is number => value !== null);
  const color =
    tone === "neutral" ? "rgba(168,85,247,0.95)" : "rgba(74,222,128,0.95)";

  if (filtered.length === 0) {
    return <div className="h-12 rounded-2xl bg-white/[0.04]" />;
  }

  return (
    <div className="flex h-12 items-end gap-1">
      {filtered.slice(0, 14).map((value, index) => {
        const height = Math.max(10, Math.min(48, Math.abs(value) * 4 + 10));

        return (
          <div
            key={`${value}-${index}`}
            className="w-full rounded-full"
            style={{
              height,
              background: `linear-gradient(180deg, ${color}, rgba(255,255,255,0.08))`,
              opacity: 0.9,
            }}
          />
        );
      })}
    </div>
  );
}

function VolumeBar({ values }: { values: Array<number | null> }) {
  const filtered = values.filter((value): value is number => value !== null);
  const max = Math.max(...filtered, 1);

  if (filtered.length === 0) {
    return <div className="h-12 rounded-2xl bg-white/[0.04]" />;
  }

  return (
    <div className="flex h-12 items-end gap-1">
      {filtered.slice(0, 14).map((value, index) => (
        <div
          key={`${value}-${index}`}
          className="w-full rounded-t-full bg-[linear-gradient(180deg,rgba(37,99,235,0.96),rgba(37,99,235,0.2))]"
          style={{
            height: `${Math.max(20, (value / max) * 100)}%`,
          }}
        />
      ))}
    </div>
  );
}

function BreadthMeter({ ratio }: { ratio: number | null }) {
  const width = ratio === null ? 0 : Math.max(8, Math.min(100, ratio));

  return (
    <div>
      <div className="h-2 rounded-full bg-white/[0.06]">
        <div
          className="h-full rounded-full bg-[linear-gradient(90deg,rgba(74,222,128,0.95),rgba(251,191,36,0.95))]"
          style={{ width: `${width}%` }}
        />
      </div>
      <div className="mt-2 flex items-center justify-between text-xs text-[var(--color-dim)]">
        <span>0</span>
        <span>100</span>
      </div>
    </div>
  );
}
