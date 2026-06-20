"use client";

import { useMemo, useState } from "react";

import type { MarketAsset } from "@/lib/types/market";

import {
  filterAndSortAssets,
  type MarketSortDirection,
  type MarketSortKey,
} from "./market-view-model";

const COMPARE_LIMIT = 3;

export function useMarketScanner(assets: MarketAsset[]) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState<MarketSortKey>("marketCapRank");
  const [sortDirection, setSortDirection] = useState<MarketSortDirection>("asc");
  const [selectedCompareIds, setSelectedCompareIds] = useState<string[]>([]);

  const visibleAssets = useMemo(
    () =>
      filterAndSortAssets({
        assets,
        searchQuery,
        sortKey,
        sortDirection,
      }),
    [assets, searchQuery, sortDirection, sortKey],
  );

  const availableSelectedCompareIds = useMemo(() => {
    const assetIds = new Set(assets.map((asset) => asset.id));
    return selectedCompareIds.filter((id) => assetIds.has(id));
  }, [assets, selectedCompareIds]);

  const selectedAssets = useMemo(() => {
    const assetMap = new Map(assets.map((asset) => [asset.id, asset]));

    return availableSelectedCompareIds
      .map((id) => assetMap.get(id))
      .filter((asset): asset is MarketAsset => Boolean(asset));
  }, [assets, availableSelectedCompareIds]);

  function toggleSort(nextKey: MarketSortKey) {
    if (sortKey === nextKey) {
      setSortDirection((current) => (current === "asc" ? "desc" : "asc"));
      return;
    }

    setSortKey(nextKey);
    setSortDirection("asc");
  }

  function toggleCompare(assetId: string) {
    setSelectedCompareIds((current) => {
      if (current.includes(assetId)) {
        return current.filter((id) => id !== assetId);
      }

      if (current.length >= COMPARE_LIMIT) {
        return current;
      }

      return [...current, assetId];
    });
  }

  function clearCompare() {
    setSelectedCompareIds([]);
  }

  return {
    compareLimit: COMPARE_LIMIT,
    searchQuery,
    selectedAssets,
    selectedCompareIds: availableSelectedCompareIds,
    sortDirection,
    sortKey,
    visibleAssets,
    clearCompare,
    hasReachedCompareLimit: availableSelectedCompareIds.length >= COMPARE_LIMIT,
    setSearchQuery,
    toggleCompare,
    toggleSort,
  };
}
