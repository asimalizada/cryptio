"use client";

import {
  CandlestickChart,
  Coins,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

import type { MarketAsset } from "@/lib/types/market";

import {
  deriveOverviewMetrics,
  type OverviewMetric,
} from "./market-view-model";

const LOADING_CARD_IDS = ["cap", "volume", "dominance", "breadth"];
const OVERVIEW_ICONS = {
  "market-cap": Coins,
  volume: CandlestickChart,
  dominance: ShieldCheck,
  breadth: TrendingUp,
} as const;

export function MarketOverview({
  assets,
  isLoading,
}: {
  assets: MarketAsset[];
  isLoading: boolean;
}) {
  const overview = deriveOverviewMetrics(assets);

  return (
    <section className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
      {isLoading
        ? LOADING_CARD_IDS.map((id) => <OverviewCardSkeleton key={id} />)
        : overview.map((item) => (
            <OverviewCard key={item.label} item={item} assets={assets} />
          ))}
    </section>
  );
}

function OverviewCard({
  item,
  assets,
}: {
  item: OverviewMetric;
  assets: MarketAsset[];
}) {
  const Icon = OVERVIEW_ICONS[item.visual];

  return (
    <article className="market-panel rounded-[1.55rem] p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[0.72rem] font-medium uppercase tracking-[0.22em] text-[var(--color-dim)]">
            {item.label}
          </p>
          <p className="mt-3 text-[1.9rem] font-semibold tracking-[-0.04em] text-white">
            {item.value}
          </p>
          <div className="mt-2 flex items-center gap-2 text-sm">
            <span className={resolveToneClass(item.tone)}>{item.change}</span>
            <span className="text-[var(--color-muted)]">{item.caption}</span>
          </div>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-[var(--color-muted)]">
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-5">
        <OverviewVisual visual={item.visual} assets={assets} />
      </div>
    </article>
  );
}

function OverviewCardSkeleton() {
  return (
    <article className="market-panel rounded-[1.55rem] p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="h-3 w-24 animate-pulse rounded-full bg-white/8" />
          <div className="mt-4 h-8 w-36 animate-pulse rounded-full bg-white/8" />
          <div className="mt-3 h-4 w-28 animate-pulse rounded-full bg-white/6" />
        </div>
        <div className="h-11 w-11 animate-pulse rounded-full bg-white/8" />
      </div>
      <div className="mt-5 h-12 animate-pulse rounded-2xl bg-white/[0.04]" />
    </article>
  );
}

function OverviewVisual({
  visual,
  assets,
}: {
  visual: OverviewMetric["visual"];
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

  return <MicroTrendBar values={values} tone={visual === "dominance" ? "neutral" : "up"} />;
}

function resolveToneClass(tone: OverviewMetric["tone"]) {
  switch (tone) {
    case "up":
      return "text-[var(--color-up)]";
    case "down":
      return "text-[var(--color-down)]";
    default:
      return "text-[var(--color-muted)]";
  }
}

function MicroTrendBar({
  values,
  tone,
}: {
  values: Array<number | null>;
  tone: "up" | "neutral";
}) {
  const filtered = values.filter((value): value is number => value !== null);
  const color = tone === "neutral" ? "rgba(168,85,247,0.95)" : "rgba(74,222,128,0.95)";

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
