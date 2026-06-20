"use client";

import type { MarketAsset } from "@/lib/types/market";

import { deriveOverviewMetrics } from "../market-view-model";
import { OverviewCard } from "./OverviewCard";
import { OverviewCardSkeleton } from "./OverviewCardSkeleton";

const LOADING_CARD_IDS = ["cap", "volume", "dominance", "breadth"];

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
