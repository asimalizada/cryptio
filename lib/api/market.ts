import type { MarketAsset, MarketResponse } from "@/lib/types/market";

const COINGECKO_MARKETS_URL =
  "https://api.coingecko.com/api/v3/coins/markets";

const MARKET_REVALIDATE_SECONDS = 60;
const MARKET_TIMEOUT_MS = 8000;
const MARKET_PAGE_SIZE = 100;

type CoinGeckoMarketRow = {
  id?: unknown;
  symbol?: unknown;
  name?: unknown;
  image?: unknown;
  current_price?: unknown;
  market_cap?: unknown;
  market_cap_rank?: unknown;
  total_volume?: unknown;
  price_change_percentage_1h_in_currency?: unknown;
  price_change_percentage_24h_in_currency?: unknown;
  price_change_percentage_7d_in_currency?: unknown;
  sparkline_in_7d?: {
    price?: unknown;
  } | null;
};

export { MARKET_REVALIDATE_SECONDS };

export async function getMarketResponse(): Promise<MarketResponse> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), MARKET_TIMEOUT_MS);

  try {
    const params = new URLSearchParams({
      vs_currency: "usd",
      order: "market_cap_desc",
      per_page: String(MARKET_PAGE_SIZE),
      page: "1",
      sparkline: "true",
      price_change_percentage: "1h,24h,7d",
    });

    const response = await fetch(`${COINGECKO_MARKETS_URL}?${params}`, {
      headers: {
        accept: "application/json",
      },
      next: {
        revalidate: MARKET_REVALIDATE_SECONDS,
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      return buildMarketErrorResponse(
        response.status === 429
          ? "Market data is temporarily rate-limited."
          : "Market data is unavailable right now.",
      );
    }

    const payload = (await response.json()) as unknown;

    if (!Array.isArray(payload)) {
      return buildMarketErrorResponse("Market data returned an invalid shape.");
    }

    const assets = payload
      .map((entry) => normalizeMarketAsset(entry as CoinGeckoMarketRow))
      .filter((asset): asset is MarketAsset => asset !== null);

    if (assets.length === 0) {
      return buildMarketErrorResponse("Market data is temporarily empty.");
    }

    return {
      assets,
      fetchedAt: new Date().toISOString(),
      isStale: false,
      source: "coingecko",
    };
  } catch (error) {
    if (isAbortError(error)) {
      return buildMarketErrorResponse("Market data request timed out.");
    }

    return buildMarketErrorResponse("Market data could not be loaded.");
  } finally {
    clearTimeout(timeoutId);
  }
}

function normalizeMarketAsset(entry: CoinGeckoMarketRow): MarketAsset | null {
  const id = toNonEmptyString(entry.id);
  const symbol = toNonEmptyString(entry.symbol);
  const name = toNonEmptyString(entry.name);

  if (!id || !symbol || !name) {
    return null;
  }

  return {
    id,
    symbol: symbol.toUpperCase(),
    name,
    image: toNullableString(entry.image),
    currentPrice: toNullableNumber(entry.current_price),
    marketCap: toNullableNumber(entry.market_cap),
    marketCapRank: toNullableInteger(entry.market_cap_rank),
    totalVolume: toNullableNumber(entry.total_volume),
    priceChangePercentage1h: toNullableNumber(
      entry.price_change_percentage_1h_in_currency,
    ),
    priceChangePercentage24h: toNullableNumber(
      entry.price_change_percentage_24h_in_currency,
    ),
    priceChangePercentage7d: toNullableNumber(
      entry.price_change_percentage_7d_in_currency,
    ),
    sparkline7d: normalizeSparkline(entry.sparkline_in_7d?.price),
  };
}

function normalizeSparkline(value: unknown): number[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((point) => toNullableNumber(point))
    .filter((point): point is number => point !== null);
}

function buildMarketErrorResponse(message: string): MarketResponse {
  return {
    assets: [],
    fetchedAt: new Date().toISOString(),
    isStale: true,
    source: "coingecko",
    error: message,
  };
}

function toNullableNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function toNullableInteger(value: unknown): number | null {
  return typeof value === "number" && Number.isInteger(value) ? value : null;
}

function toNullableString(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0 ? value : null;
}

function toNonEmptyString(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : null;
}

function isAbortError(error: unknown) {
  return error instanceof Error && error.name === "AbortError";
}
