export type MarketAsset = {
  id: string;
  symbol: string;
  name: string;
  image: string | null;
  currentPrice: number | null;
  marketCap: number | null;
  marketCapRank: number | null;
  totalVolume: number | null;
  priceChangePercentage1h: number | null;
  priceChangePercentage24h: number | null;
  priceChangePercentage7d: number | null;
  sparkline7d: number[];
};

export type MarketSource = "coingecko" | "fallback";

export type MarketResponse = {
  assets: MarketAsset[];
  fetchedAt: string;
  isStale: boolean;
  source: MarketSource;
  error?: string;
};
