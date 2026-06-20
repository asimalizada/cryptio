"use client";

import {
  CandlestickChart,
  Coins,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

import type { MarketAsset } from "@/lib/types/market";

import type { OverviewMetric } from "../market-view-model";
import { OverviewVisual } from "./OverviewVisual";

const OVERVIEW_ICONS = {
  "market-cap": Coins,
  volume: CandlestickChart,
  dominance: ShieldCheck,
  breadth: TrendingUp,
} as const;

export function OverviewCard({
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
