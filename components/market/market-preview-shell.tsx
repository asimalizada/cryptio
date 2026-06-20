"use client";

import Image from "next/image";
import {
  Activity,
  ArrowUpDown,
  CandlestickChart,
  Coins,
  Filter,
  Flame,
  Gauge,
  Layers3,
  RefreshCcw,
  Search,
  ShieldCheck,
  Star,
  TrendingUp,
} from "lucide-react";

import { useMarketData } from "@/lib/api/market-client";
import type { MarketAsset } from "@/lib/types/market";
import {
  formatCompactCurrency,
  formatCurrency,
  formatNumber,
  formatPercent,
  formatRelativeTime,
} from "@/lib/utils/format";

const LOADING_CARD_IDS = ["cap", "volume", "dominance", "breadth"];
const LOADING_MOVERS = Array.from({ length: 6 }, (_, index) => index);
const LOADING_ROWS = Array.from({ length: 8 }, (_, index) => index);

export function MarketPreviewShell() {
  const { data, error, isError, isLoading, isStale, lastUpdated, retry } =
    useMarketData();

  const assets = data?.assets ?? [];
  const overview = deriveOverviewMetrics(assets);
  const movers = deriveTopMovers(assets);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--color-bg)] text-[var(--color-text)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.08),transparent_24%),radial-gradient(circle_at_85%_12%,rgba(96,165,250,0.14),transparent_18%),linear-gradient(180deg,rgba(7,17,31,0.4),rgba(7,17,31,0.96))]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/10" />

      <section className="relative mx-auto flex min-h-screen w-full max-w-[1600px] flex-col px-4 py-4 sm:px-6 lg:px-8">
        <Header
          isLoading={isLoading}
          isStale={isStale}
          lastUpdated={lastUpdated}
          onRefresh={retry}
        />

        <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="min-w-0 space-y-4">
            <OverviewSection overview={overview} isLoading={isLoading} />
            <MoversSection movers={movers} isLoading={isLoading} />

            <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)]">
              <ScannerShell
                assets={assets}
                error={error}
                isError={isError}
                isLoading={isLoading}
                isStale={isStale}
                lastUpdated={lastUpdated}
                onRetry={retry}
              />
            </div>
          </div>

          <CompareRail isLoading={isLoading} />
        </div>
      </section>
    </main>
  );
}

function Header({
  isLoading,
  isStale,
  lastUpdated,
  onRefresh,
}: {
  isLoading: boolean;
  isStale: boolean;
  lastUpdated: string | null;
  onRefresh: () => void;
}) {
  return (
    <header className="market-panel-soft flex h-[72px] items-center justify-between rounded-[1.65rem] px-4 sm:px-5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[linear-gradient(135deg,rgba(34,211,238,0.88),rgba(74,222,128,0.88))] text-[var(--color-bg)] shadow-[0_0_40px_rgba(34,211,238,0.15)]">
          <Activity className="h-5 w-5" />
        </div>
        <div>
          <p className="text-[0.72rem] font-medium uppercase tracking-[0.34em] text-white/70">
            Cryptio
          </p>
          <p className="text-xs text-[var(--color-muted)]">
            Market scanner
          </p>
        </div>
      </div>

      <div className="hidden min-w-0 flex-1 px-6 lg:block">
        <div className="market-panel-soft flex h-12 items-center gap-3 rounded-full px-4">
          <Search className="h-4 w-4 text-[var(--color-dim)]" />
          <p className="min-w-0 truncate text-sm text-[var(--color-muted)]">
            Search assets by name or symbol...
          </p>
          <div className="ml-auto rounded-full border border-white/10 bg-white/6 px-2.5 py-1 text-[11px] font-medium text-[var(--color-muted)]">
            K
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 md:flex">
          <span
            className={`h-2 w-2 rounded-full ${
              isLoading
                ? "bg-[var(--color-cyan)]"
                : isStale
                  ? "bg-[var(--color-amber)]"
                  : "bg-[var(--color-up)]"
            }`}
          />
          <span className="text-xs text-[var(--color-muted)]">
            {isLoading
              ? "Refreshing market"
              : lastUpdated
                ? `Updated ${formatRelativeTime(lastUpdated)}`
                : "Syncing market"}
          </span>
        </div>

        <button
          type="button"
          onClick={onRefresh}
          className="flex h-11 items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 text-sm font-medium text-white transition hover:bg-white/10"
        >
          <RefreshCcw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          <span className="hidden sm:inline">Refresh</span>
        </button>

        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/6 text-[var(--color-muted)] transition hover:bg-white/10 hover:text-white"
          aria-label="Scanner status"
        >
          <Gauge className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}

function OverviewSection({
  overview,
  isLoading,
}: {
  overview: OverviewMetric[];
  isLoading: boolean;
}) {
  return (
    <section className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
      {isLoading
        ? LOADING_CARD_IDS.map((id) => <OverviewCardSkeleton key={id} />)
        : overview.map((item) => <OverviewCard key={item.label} item={item} />)}
    </section>
  );
}

function OverviewCard({ item }: { item: OverviewMetric }) {
  const Icon = item.icon;

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
            <span className={item.changeToneClass}>{item.change}</span>
            <span className="text-[var(--color-muted)]">{item.caption}</span>
          </div>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-[var(--color-muted)]">
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-5">
        {item.visual}
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

function MoversSection({
  movers,
  isLoading,
}: {
  movers: MarketAsset[];
  isLoading: boolean;
}) {
  return (
    <section className="market-panel rounded-[1.55rem] px-4 py-4 sm:px-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Flame className="h-4 w-4 text-[var(--color-amber)]" />
          <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-white/90">
            Top movers
          </h2>
        </div>

        <div className="rounded-full border border-white/10 bg-white/6 px-3 py-1.5 text-xs font-medium text-white/80">
          24h
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {isLoading
          ? LOADING_MOVERS.map((item) => <MoverSkeleton key={item} />)
          : movers.map((asset) => <MoverPill key={asset.id} asset={asset} />)}
      </div>
    </section>
  );
}

function MoverPill({ asset }: { asset: MarketAsset }) {
  const move = asset.priceChangePercentage24h;
  const toneClass =
    move !== null && move < 0 ? "text-[var(--color-down)]" : "text-[var(--color-up)]";

  return (
    <article className="rounded-[1.15rem] border border-white/8 bg-white/[0.03] px-3 py-3">
      <div className="flex items-center gap-3">
        <AssetIcon asset={asset} size="sm" />
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-white">{asset.symbol}</p>
          <p className="truncate text-xs text-[var(--color-muted)]">{asset.name}</p>
        </div>
        <p className={`ml-auto text-sm font-semibold ${toneClass}`}>
          {formatPercent(move)}
        </p>
      </div>
    </article>
  );
}

function MoverSkeleton() {
  return <div className="h-[62px] animate-pulse rounded-[1.15rem] bg-white/[0.04]" />;
}

function ScannerShell({
  assets,
  error,
  isError,
  isLoading,
  isStale,
  lastUpdated,
  onRetry,
}: {
  assets: MarketAsset[];
  error: string | null;
  isError: boolean;
  isLoading: boolean;
  isStale: boolean;
  lastUpdated: string | null;
  onRetry: () => void;
}) {
  return (
    <section className="market-panel rounded-[1.65rem]">
      <div className="border-b border-[var(--color-border)] px-4 py-4 sm:px-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h2 className="text-[1.28rem] font-semibold tracking-[-0.03em] text-white">
              Market scanner
            </h2>
            <p className="mt-1 text-sm text-[var(--color-muted)]">
              Scan market leaders, pressure points, and recent movement.
            </p>
          </div>

          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="market-panel-soft flex h-11 min-w-[280px] items-center gap-3 rounded-full px-4">
              <Search className="h-4 w-4 text-[var(--color-dim)]" />
              <p className="truncate text-sm text-[var(--color-muted)]">
                Search assets by name or symbol...
              </p>
            </div>

            <div className="flex items-center gap-2">
              <TabButton label="All Coins" isActive />
              <TabButton label="Top 100" />
              <IconSurface>
                <Filter className="h-4 w-4" />
              </IconSurface>
            </div>
          </div>
        </div>
      </div>

      {isError ? (
        <div className="px-4 py-5 sm:px-5">
          <div className="rounded-[1.35rem] border border-rose-400/18 bg-rose-400/8 p-5">
            <p className="text-sm font-medium text-white">
              {error ?? "Market data could not be loaded. Try refreshing the scanner."}
            </p>
            <button
              type="button"
              onClick={onRetry}
              className="mt-4 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/12"
            >
              Retry
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <div className="min-w-[980px]">
              <div className="grid grid-cols-[48px_68px_1.7fr_1fr_0.9fr_0.9fr_1.1fr_1.05fr_124px_56px] items-center gap-3 border-b border-[var(--color-border)] px-4 py-3 text-[0.72rem] font-medium uppercase tracking-[0.16em] text-[var(--color-dim)] sm:px-5">
                <span />
                <span>#</span>
                <span>Asset</span>
                <span className="flex items-center gap-1">
                  Price
                  <ArrowUpDown className="h-3.5 w-3.5" />
                </span>
                <span>1h</span>
                <span>24h</span>
                <span>Market Cap</span>
                <span>Volume</span>
                <span>7d trend</span>
                <span />
              </div>

              {isLoading ? (
                <div className="divide-y divide-white/6">
                  {LOADING_ROWS.map((row) => (
                    <ScannerRowSkeleton key={row} />
                  ))}
                </div>
              ) : (
                <div className="divide-y divide-white/6">
                  {assets.slice(0, 10).map((asset) => (
                    <ScannerRow key={asset.id} asset={asset} />
                  ))}
                </div>
              )}
            </div>
          </div>

          <footer className="flex flex-col gap-3 border-t border-[var(--color-border)] px-4 py-4 text-sm text-[var(--color-muted)] sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <div className="flex flex-wrap items-center gap-4">
              <span className="flex items-center gap-2">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    isLoading
                      ? "bg-[var(--color-cyan)]"
                      : isStale
                        ? "bg-[var(--color-amber)]"
                        : "bg-[var(--color-up)]"
                  }`}
                />
                {isLoading ? "Refreshing market data" : "Data from CoinGecko"}
              </span>
              <span>{`Showing 1-${Math.min(assets.length, 10)} of ${assets.length} assets`}</span>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <span>{isStale ? "Data may be stale" : "Market data loaded"}</span>
              <span>{lastUpdated ? `Updated ${formatRelativeTime(lastUpdated)}` : "Pending sync"}</span>
            </div>
          </footer>
        </>
      )}
    </section>
  );
}

function ScannerRow({ asset }: { asset: MarketAsset }) {
  return (
    <div className="grid grid-cols-[48px_68px_1.7fr_1fr_0.9fr_0.9fr_1.1fr_1.05fr_124px_56px] items-center gap-3 px-4 py-4 transition hover:bg-white/[0.025] sm:px-5">
      <div className="text-[var(--color-muted)]">
        <Star className="h-4 w-4" />
      </div>
      <div className="text-sm font-medium text-white">{formatNumber(asset.marketCapRank)}</div>

      <div className="flex items-center gap-3">
        <AssetIcon asset={asset} size="md" />
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-white">{asset.symbol}</p>
          <p className="truncate text-sm text-[var(--color-muted)]">{asset.name}</p>
        </div>
      </div>

      <p className="text-sm font-medium text-white">{formatCurrency(asset.currentPrice)}</p>
      <MetricValue value={asset.priceChangePercentage1h} />
      <MetricValue value={asset.priceChangePercentage24h} />
      <p className="text-sm text-white">{formatCompactCurrency(asset.marketCap)}</p>
      <p className="text-sm text-white">{formatCompactCurrency(asset.totalVolume)}</p>
      <Sparkline asset={asset} />

      <button
        type="button"
        className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-[var(--color-muted)] transition hover:bg-white/[0.08] hover:text-white"
        aria-label={`Add ${asset.name} to compare`}
      >
        <Layers3 className="h-4 w-4" />
      </button>
    </div>
  );
}

function ScannerRowSkeleton() {
  return (
    <div className="grid grid-cols-[48px_68px_1.7fr_1fr_0.9fr_0.9fr_1.1fr_1.05fr_124px_56px] items-center gap-3 px-4 py-4 sm:px-5">
      <div className="h-4 w-4 animate-pulse rounded-full bg-white/8" />
      <div className="h-4 w-8 animate-pulse rounded-full bg-white/8" />
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 animate-pulse rounded-full bg-white/8" />
        <div className="space-y-2">
          <div className="h-4 w-16 animate-pulse rounded-full bg-white/8" />
          <div className="h-3 w-24 animate-pulse rounded-full bg-white/6" />
        </div>
      </div>
      <div className="h-4 w-20 animate-pulse rounded-full bg-white/8" />
      <div className="h-4 w-14 animate-pulse rounded-full bg-white/8" />
      <div className="h-4 w-14 animate-pulse rounded-full bg-white/8" />
      <div className="h-4 w-20 animate-pulse rounded-full bg-white/8" />
      <div className="h-4 w-20 animate-pulse rounded-full bg-white/8" />
      <div className="h-10 animate-pulse rounded-2xl bg-white/[0.04]" />
      <div className="h-9 w-9 animate-pulse rounded-full bg-white/8" />
    </div>
  );
}

function CompareRail({ isLoading }: { isLoading: boolean }) {
  return (
    <aside className="xl:sticky xl:top-4 xl:self-start">
      <section className="market-panel h-full rounded-[1.65rem]">
        <div className="flex items-center justify-between border-b border-[var(--color-border)] px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold tracking-[-0.03em] text-white">
              Compare (0/3)
            </h2>
            <p className="mt-1 text-sm text-[var(--color-muted)]">
              Select assets from the scanner.
            </p>
          </div>

          <button
            type="button"
            className="rounded-full border border-white/10 bg-white/6 px-3 py-1.5 text-xs font-medium text-white/80"
          >
            Clear
          </button>
        </div>

        <div className="px-5 py-5">
          <div className="rounded-[1.4rem] border border-dashed border-white/12 bg-white/[0.02] p-5">
            <p className="text-sm font-medium text-white">
              Select up to 3 assets from the scanner to compare price, movement, and liquidity.
            </p>
          </div>

          <div className="mt-5 space-y-3">
            {isLoading ? (
              <>
                <CompareSkeleton />
                <CompareSkeleton />
                <CompareSkeleton />
              </>
            ) : (
              <>
                <CompareMetricRow label="Price" />
                <CompareMetricRow label="24h %" />
                <CompareMetricRow label="7d %" />
                <CompareMetricRow label="Market Cap" />
                <CompareMetricRow label="Volume (24h)" />
              </>
            )}
          </div>
        </div>
      </section>
    </aside>
  );
}

function CompareMetricRow({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-between rounded-[1.05rem] border border-white/8 bg-white/[0.02] px-4 py-3">
      <span className="text-sm text-[var(--color-muted)]">{label}</span>
      <span className="text-sm font-medium text-white/75">—</span>
    </div>
  );
}

function CompareSkeleton() {
  return <div className="h-[46px] animate-pulse rounded-[1.05rem] bg-white/[0.04]" />;
}

function AssetIcon({
  asset,
  size,
}: {
  asset: MarketAsset;
  size: "sm" | "md";
}) {
  const sizeClass = size === "sm" ? "h-8 w-8" : "h-10 w-10";

  if (!asset.image) {
    return (
      <div
        className={`flex ${sizeClass} items-center justify-center rounded-full bg-white/8 text-xs font-semibold text-white`}
      >
        {asset.symbol.slice(0, 2)}
      </div>
    );
  }

  return (
    <div className={`relative ${sizeClass} overflow-hidden rounded-full bg-white/8`}>
      <Image
        src={asset.image}
        alt={asset.name}
        fill
        sizes={size === "sm" ? "32px" : "40px"}
        className="object-cover"
      />
    </div>
  );
}

function MetricValue({ value }: { value: number | null }) {
  const toneClass =
    value === null
      ? "text-[var(--color-muted)]"
      : value < 0
        ? "text-[var(--color-down)]"
        : value > 0
          ? "text-[var(--color-up)]"
          : "text-[var(--color-muted)]";

  return <p className={`text-sm font-medium ${toneClass}`}>{formatPercent(value)}</p>;
}

function Sparkline({ asset }: { asset: MarketAsset }) {
  const prices = asset.sparkline7d;

  if (prices.length < 2) {
    return <div className="h-10 rounded-2xl bg-white/[0.03]" />;
  }

  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min || 1;
  const tone = (asset.priceChangePercentage7d ?? 0) < 0 ? "var(--color-down)" : "var(--color-up)";

  const points = prices
    .map((price, index) => {
      const x = (index / (prices.length - 1)) * 116;
      const y = 34 - ((price - min) / range) * 26;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg viewBox="0 0 116 34" className="h-10 w-[116px]">
      <polyline
        fill="none"
        stroke={tone}
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
        points={points}
      />
    </svg>
  );
}

function TabButton({
  label,
  isActive = false,
}: {
  label: string;
  isActive?: boolean;
}) {
  return (
    <button
      type="button"
      className={`rounded-full px-4 py-2 text-sm font-medium transition ${
        isActive
          ? "border border-cyan-400/30 bg-cyan-400/10 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
          : "border border-white/8 bg-white/[0.03] text-[var(--color-muted)] hover:bg-white/[0.06] hover:text-white"
      }`}
    >
      {label}
    </button>
  );
}

function IconSurface({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="button"
      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/8 bg-white/[0.03] text-[var(--color-muted)] transition hover:bg-white/[0.06] hover:text-white"
    >
      {children}
    </button>
  );
}

type OverviewMetric = {
  label: string;
  value: string;
  change: string;
  caption: string;
  changeToneClass: string;
  icon: React.ComponentType<{ className?: string }>;
  visual: React.ReactNode;
};

function deriveOverviewMetrics(assets: MarketAsset[]): OverviewMetric[] {
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
      changeToneClass: toneClassFromValue(average24hMove),
      icon: Coins,
      visual: <MicroTrendBar values={assets.slice(0, 12).map((asset) => asset.priceChangePercentage24h)} tone="up" />,
    },
    {
      label: "24h Volume",
      value: formatCompactCurrency(totalVolume || null),
      change: `${formatNumber(assets.filter((asset) => (asset.totalVolume ?? 0) > 0).length)} active`,
      caption: "tracked leaders",
      changeToneClass: "text-[var(--color-up)]",
      icon: CandlestickChart,
      visual: <VolumeBar values={assets.slice(0, 12).map((asset) => asset.totalVolume)} />,
    },
    {
      label: "BTC Dominance",
      value: btcDominance === null ? "—" : `${btcDominance.toFixed(2)}%`,
      change: btc?.priceChangePercentage24h ? formatPercent(btc.priceChangePercentage24h) : "—",
      caption: "Bitcoin 24h move",
      changeToneClass: toneClassFromValue(btc?.priceChangePercentage24h ?? null),
      icon: ShieldCheck,
      visual: <MicroTrendBar values={assets.slice(0, 12).map((asset) => asset.priceChangePercentage7d)} tone="neutral" />,
    },
    {
      label: "Market Breadth",
      value:
        breadthRatio === null
          ? "—"
          : `${formatNumber(positiveMoves)}/${formatNumber(negativeMoves)}`,
      change: breadthRatio === null ? "—" : `${breadthRatio.toFixed(0)}% positive`,
      caption: "24h participation",
      changeToneClass: toneClassFromValue(breadthRatio === null ? null : breadthRatio - 50),
      icon: TrendingUp,
      visual: <BreadthMeter ratio={breadthRatio} />,
    },
  ];
}

function deriveTopMovers(assets: MarketAsset[]) {
  return [...assets]
    .filter((asset) => asset.priceChangePercentage24h !== null)
    .sort(
      (left, right) =>
        Math.abs(right.priceChangePercentage24h ?? 0) -
        Math.abs(left.priceChangePercentage24h ?? 0),
    )
    .slice(0, 6);
}

function toneClassFromValue(value: number | null) {
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
