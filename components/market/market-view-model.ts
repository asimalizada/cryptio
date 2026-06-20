import type { MarketAsset } from "@/lib/types/market";
import {
  formatCompactCurrency,
  formatNumber,
  formatPercent,
} from "@/lib/utils/format";

export type OverviewTone = "up" | "down" | "neutral";
export type OverviewVisual = "market-cap" | "volume" | "dominance" | "breadth";

export type OverviewMetric = {
  label: string;
  value: string;
  change: string;
  caption: string;
  tone: OverviewTone;
  visual: OverviewVisual;
};

export function deriveOverviewMetrics(assets: MarketAsset[]): OverviewMetric[] {
  const totalMarketCap = assets.reduce((sum, asset) => sum + (asset.marketCap ?? 0), 0);
  const totalVolume = assets.reduce((sum, asset) => sum + (asset.totalVolume ?? 0), 0);
  const btc = assets.find((asset) => asset.symbol === "BTC");
  const btcDominance =
    btc?.marketCap && totalMarketCap > 0
      ? (btc.marketCap / totalMarketCap) * 100
      : null;

  const valid24hMoves = assets
    .map((asset) => asset.priceChangePercentage24h)
    .filter((value): value is number => value !== null);
  const positiveMoves = valid24hMoves.filter((value) => value > 0).length;
  const negativeMoves = valid24hMoves.filter((value) => value < 0).length;
  const average24hMove =
    valid24hMoves.length > 0
      ? valid24hMoves.reduce((sum, value) => sum + value, 0) / valid24hMoves.length
      : null;
  const breadthRatio =
    valid24hMoves.length > 0 ? (positiveMoves / valid24hMoves.length) * 100 : null;

  return [
    {
      label: "Total Market Cap",
      value: formatCompactCurrency(totalMarketCap || null),
      change: formatPercent(average24hMove),
      caption: "24h average move",
      tone: toneFromValue(average24hMove),
      visual: "market-cap",
    },
    {
      label: "24h Volume",
      value: formatCompactCurrency(totalVolume || null),
      change: `${formatNumber(
        assets.filter((asset) => (asset.totalVolume ?? 0) > 0).length,
      )} active`,
      caption: "tracked leaders",
      tone: "up",
      visual: "volume",
    },
    {
      label: "BTC Dominance",
      value: btcDominance === null ? "—" : `${btcDominance.toFixed(2)}%`,
      change: btc?.priceChangePercentage24h
        ? formatPercent(btc.priceChangePercentage24h)
        : "—",
      caption: "Bitcoin 24h move",
      tone: toneFromValue(btc?.priceChangePercentage24h ?? null),
      visual: "dominance",
    },
    {
      label: "Market Breadth",
      value:
        breadthRatio === null
          ? "—"
          : `${formatNumber(positiveMoves)}/${formatNumber(negativeMoves)}`,
      change: breadthRatio === null ? "—" : `${breadthRatio.toFixed(0)}% positive`,
      caption: "24h participation",
      tone: toneFromValue(breadthRatio === null ? null : breadthRatio - 50),
      visual: "breadth",
    },
  ];
}

export function deriveTopMovers(assets: MarketAsset[]) {
  return [...assets]
    .filter((asset) => asset.priceChangePercentage24h !== null)
    .sort(
      (left, right) =>
        Math.abs(right.priceChangePercentage24h ?? 0) -
        Math.abs(left.priceChangePercentage24h ?? 0),
    )
    .slice(0, 6);
}

export function toneClassFromValue(value: number | null) {
  if (value === null) {
    return "text-[var(--color-muted)]";
  }

  if (value < 0) {
    return "text-[var(--color-down)]";
  }

  if (value > 0) {
    return "text-[var(--color-up)]";
  }

  return "text-[var(--color-muted)]";
}

function toneFromValue(value: number | null): OverviewTone {
  if (value === null) {
    return "neutral";
  }

  if (value < 0) {
    return "down";
  }

  if (value > 0) {
    return "up";
  }

  return "neutral";
}
