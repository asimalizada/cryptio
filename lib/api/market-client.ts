"use client";

import { startTransition, useEffect, useState } from "react";

import type { MarketResponse } from "@/lib/types/market";

type MarketQueryState = {
  data: MarketResponse | null;
  error: string | null;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  isStale: boolean;
  lastUpdated: string | null;
  retry: () => void;
};

export async function fetchMarketData() {
  const response = await fetch("/api/market", {
    cache: "no-store",
  });

  const payload = (await response.json()) as MarketResponse;

  if (!response.ok || payload.error) {
    throw new Error(payload.error ?? "Market data is unavailable right now.");
  }

  return payload;
}

export function useMarketData(): MarketQueryState {
  const [data, setData] = useState<MarketResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let isCancelled = false;

    async function loadMarketData() {
      try {
        const payload = await fetchMarketData();

        if (isCancelled) {
          return;
        }

        setData(payload);
        setError(null);
      } catch (caughtError) {
        if (isCancelled) {
          return;
        }

        const message =
          caughtError instanceof Error
            ? caughtError.message
            : "Market data is unavailable right now.";

        setError(message);
        setData(null);
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadMarketData();

    return () => {
      isCancelled = true;
    };
  }, [refreshKey]);

  const lastUpdated = data?.fetchedAt ?? null;

  return {
    data,
    error,
    isLoading,
    isError: error !== null,
    isSuccess: data !== null && error === null,
    isStale: Boolean(data?.isStale),
    lastUpdated,
    retry: () => {
      setIsLoading(true);
      setError(null);
      startTransition(() => {
        setRefreshKey((current) => current + 1);
      });
    },
  };
}
