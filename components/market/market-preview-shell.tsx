"use client";

import Image from "next/image";

import { useMarketData } from "@/lib/api/market-client";
import type { MarketAsset } from "@/lib/types/market";
import {
  formatCompactCurrency,
  formatCurrency,
  formatPercent,
  formatRelativeTime,
} from "@/lib/utils/format";

export function MarketPreviewShell() {
  const { data, error, isError, isLoading, isStale, lastUpdated, retry } =
    useMarketData();

  const assets = data?.assets.slice(0, 4) ?? [];
  const metrics = deriveMetrics(data?.assets ?? []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--color-bg)] text-[var(--color-text)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(110,231,183,0.16),transparent_24%),radial-gradient(circle_at_85%_18%,rgba(96,165,250,0.18),transparent_18%),linear-gradient(180deg,rgba(11,15,22,0.4),rgba(11,15,22,0.96))]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/10" />

      <section className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 py-6 sm:px-8 lg:px-10">
        <header className="flex items-center justify-between border-b border-white/8 pb-5">
          <div>
            <p className="text-[0.7rem] font-medium uppercase tracking-[0.28em] text-[var(--color-muted)]">
              Cryptio
            </p>
            <h1 className="mt-3 max-w-3xl text-3xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
              Read the market before the market reads you.
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <StatusPill
              label={isLoading ? "Loading" : isStale ? "Stale" : "Live"}
              tone={isLoading ? "neutral" : isStale ? "down" : "up"}
            />
            <div className="hidden rounded-full border border-white/10 bg-white/6 px-4 py-2 text-xs font-medium text-[var(--color-muted)] md:block">
              {lastUpdated ? formatRelativeTime(lastUpdated) : "Fetching market"}
            </div>
          </div>
        </header>

        <div className="grid flex-1 gap-6 py-8 lg:grid-cols-[1.4fr_0.9fr]">
          <section className="rounded-[2rem] border border-white/10 bg-[var(--color-panel)] p-6 shadow-[0_30px_120px_rgba(0,0,0,0.35)] sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div className="max-w-2xl">
                <p className="text-sm text-[var(--color-muted)]">
                  Fast scan. Clear momentum. Cleaner decisions.
                </p>
                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                  <MetricCard
                    label="Momentum"
                    value={isLoading ? "Loading..." : metrics.risingCount}
                    tone="up"
                  />
                  <MetricCard
                    label="Pressure"
                    value={isLoading ? "Loading..." : metrics.fallingCount}
                    tone="down"
                  />
                  <MetricCard
                    label="Rotation"
                    value={isLoading ? "Loading..." : metrics.volume}
                    tone="neutral"
                  />
                </div>
              </div>

              <div className="hidden h-24 w-24 rounded-full border border-emerald-400/25 bg-emerald-300/10 blur-[2px] lg:block" />
            </div>

            <div className="mt-10 overflow-hidden rounded-[1.5rem] border border-white/8 bg-black/20">
              <div className="grid grid-cols-[1.35fr_1fr_0.9fr_0.8fr] gap-3 border-b border-white/8 px-4 py-3 text-[0.68rem] font-medium uppercase tracking-[0.18em] text-[var(--color-dim)]">
                <span>Asset</span>
                <span>Price</span>
                <span>24h</span>
                <span>Bias</span>
              </div>

              {isLoading ? (
                <LoadingRows />
              ) : isError ? (
                <ErrorState error={error ?? "Market data is unavailable."} retry={retry} />
              ) : (
                <div className="divide-y divide-white/6">
                  {assets.map((asset) => (
                    <AssetRow key={asset.id} asset={asset} />
                  ))}
                </div>
              )}
            </div>
          </section>

          <aside className="grid gap-6">
            <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(17,24,39,0.92),rgba(10,14,20,0.96))] p-6">
              <p className="text-[0.7rem] font-medium uppercase tracking-[0.22em] text-[var(--color-dim)]">
                Market pulse
              </p>
              <div className="mt-5 space-y-5">
                <StatusRow
                  label="Source"
                  value={data?.source === "coingecko" ? "CoinGecko" : "Fallback"}
                />
                <StatusRow
                  label="Coverage"
                  value={isLoading ? "Syncing" : `${data?.assets.length ?? 0} assets`}
                />
                <StatusRow
                  label="Updated"
                  value={lastUpdated ? formatRelativeTime(lastUpdated) : "Pending"}
                />
                <StatusRow
                  label="State"
                  value={isLoading ? "Refreshing" : isStale ? "Aged data" : "Fresh data"}
                />
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6">
              <p className="text-[0.7rem] font-medium uppercase tracking-[0.22em] text-[var(--color-dim)]">
                Leaders
              </p>
              <div className="mt-6 space-y-4">
                {isLoading ? (
                  <div className="space-y-3">
                    <MiniSkeleton />
                    <MiniSkeleton />
                    <MiniSkeleton />
                  </div>
                ) : (
                  metrics.leaders.map((asset) => (
                    <LeaderRow key={asset.id} asset={asset} />
                  ))
                )}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

function AssetRow({ asset }: { asset: MarketAsset }) {
  const move = asset.priceChangePercentage24h;
  const toneClass =
    move !== null && move < 0
      ? "text-[var(--color-down)]"
      : "text-[var(--color-up)]";

  return (
    <div className="grid grid-cols-[1.35fr_1fr_0.9fr_0.8fr] items-center gap-3 px-4 py-4">
      <div className="flex items-center gap-3">
        <AssetIcon asset={asset} />
        <div>
          <p className="font-medium text-white">{asset.symbol}</p>
          <p className="text-sm text-[var(--color-muted)]">{asset.name}</p>
        </div>
      </div>
      <p className="font-medium text-white">{formatCurrency(asset.currentPrice)}</p>
      <p className={`font-medium ${move === null ? "text-[var(--color-muted)]" : toneClass}`}>
        {formatPercent(move)}
      </p>
      <BiasBar value={move} />
    </div>
  );
}

function AssetIcon({ asset }: { asset: MarketAsset }) {
  if (!asset.image) {
    return (
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/8 text-xs font-semibold text-white">
        {asset.symbol.slice(0, 2)}
      </div>
    );
  }

  return (
    <div className="relative h-10 w-10 overflow-hidden rounded-full bg-white/8">
      <Image src={asset.image} alt={asset.name} fill sizes="40px" className="object-cover" />
    </div>
  );
}

function BiasBar({ value }: { value: number | null }) {
  if (value === null) {
    return <div className="h-8 rounded-full bg-white/[0.04]" />;
  }

  const width = Math.max(16, Math.min(100, Math.round(Math.abs(value) * 7)));
  const gradient =
    value < 0
      ? "bg-[linear-gradient(90deg,rgba(248,113,113,0.92),rgba(248,113,113,0.22))]"
      : "bg-[linear-gradient(90deg,rgba(74,222,128,0.92),rgba(74,222,128,0.18))]";

  return (
    <div className="h-8 overflow-hidden rounded-full bg-white/[0.04]">
      <div className={`h-full rounded-full ${gradient}`} style={{ width: `${width}%` }} />
    </div>
  );
}

function ErrorState({ error, retry }: { error: string; retry: () => void }) {
  return (
    <div className="px-4 py-8">
      <div className="rounded-[1.3rem] border border-rose-400/18 bg-rose-400/8 p-5">
        <p className="text-sm font-medium text-white">{error}</p>
        <button
          type="button"
          onClick={retry}
          className="mt-4 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/12"
        >
          Retry
        </button>
      </div>
    </div>
  );
}

function LoadingRows() {
  return (
    <div className="divide-y divide-white/6">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="grid grid-cols-[1.35fr_1fr_0.9fr_0.8fr] items-center gap-3 px-4 py-4"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 animate-pulse rounded-full bg-white/8" />
            <div className="space-y-2">
              <div className="h-4 w-16 animate-pulse rounded-full bg-white/8" />
              <div className="h-3 w-24 animate-pulse rounded-full bg-white/6" />
            </div>
          </div>
          <div className="h-4 w-20 animate-pulse rounded-full bg-white/8" />
          <div className="h-4 w-14 animate-pulse rounded-full bg-white/8" />
          <div className="h-8 animate-pulse rounded-full bg-white/[0.04]" />
        </div>
      ))}
    </div>
  );
}

function MiniSkeleton() {
  return <div className="h-11 animate-pulse rounded-full bg-white/[0.05]" />;
}

function LeaderRow({ asset }: { asset: MarketAsset }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-[1.3rem] border border-white/8 bg-white/[0.02] px-4 py-3">
      <div className="flex items-center gap-3">
        <AssetIcon asset={asset} />
        <div>
          <p className="text-sm font-medium text-white">{asset.symbol}</p>
          <p className="text-xs text-[var(--color-muted)]">{asset.name}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm font-medium text-[var(--color-up)]">
          {formatPercent(asset.priceChangePercentage24h)}
        </p>
        <p className="text-xs text-[var(--color-muted)]">
          {formatCurrency(asset.currentPrice)}
        </p>
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "up" | "down" | "neutral";
}) {
  const toneClass =
    tone === "up"
      ? "border-emerald-400/15 bg-emerald-400/8"
      : tone === "down"
        ? "border-rose-400/15 bg-rose-400/8"
        : "border-white/10 bg-white/[0.03]";

  return (
    <div className={`rounded-[1.4rem] border p-4 ${toneClass}`}>
      <p className="text-[0.7rem] font-medium uppercase tracking-[0.18em] text-[var(--color-dim)]">
        {label}
      </p>
      <p className="mt-3 text-lg font-semibold tracking-[-0.03em] text-white">
        {value}
      </p>
    </div>
  );
}

function StatusRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/8 pb-4 last:border-b-0 last:pb-0">
      <p className="text-sm text-[var(--color-muted)]">{label}</p>
      <p className="text-right text-sm font-medium text-white">{value}</p>
    </div>
  );
}

function StatusPill({
  label,
  tone,
}: {
  label: string;
  tone: "up" | "down" | "neutral";
}) {
  const toneClass =
    tone === "up"
      ? "border-emerald-400/15 bg-emerald-400/10 text-emerald-200"
      : tone === "down"
        ? "border-rose-400/15 bg-rose-400/10 text-rose-200"
        : "border-white/10 bg-white/6 text-[var(--color-muted)]";

  return (
    <div className={`rounded-full border px-4 py-2 text-xs font-medium ${toneClass}`}>
      {label}
    </div>
  );
}

function deriveMetrics(assets: MarketAsset[]) {
  const risingAssets = assets.filter(
    (asset) =>
      typeof asset.priceChangePercentage24h === "number" &&
      asset.priceChangePercentage24h > 0,
  );
  const fallingAssets = assets.filter(
    (asset) =>
      typeof asset.priceChangePercentage24h === "number" &&
      asset.priceChangePercentage24h < 0,
  );
  const totalVolume = assets.reduce((sum, asset) => sum + (asset.totalVolume ?? 0), 0);
  const leaders = [...risingAssets]
    .sort(
      (left, right) =>
        (right.priceChangePercentage24h ?? Number.NEGATIVE_INFINITY) -
        (left.priceChangePercentage24h ?? Number.NEGATIVE_INFINITY),
    )
    .slice(0, 3);

  return {
    risingCount: `${risingAssets.length} assets rising`,
    fallingCount: `${fallingAssets.length} assets fading`,
    volume: formatCompactCurrency(totalVolume),
    leaders,
  };
}
