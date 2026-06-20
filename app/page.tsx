const previewRows = [
  { symbol: "BTC", name: "Bitcoin", price: "$104,240", move: "+2.84%" },
  { symbol: "ETH", name: "Ethereum", price: "$5,180", move: "+4.12%" },
  { symbol: "SOL", name: "Solana", price: "$188.34", move: "-1.36%" },
  { symbol: "ONDO", name: "Ondo", price: "$1.28", move: "+9.41%" },
];

export default function Home() {
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

          <div className="hidden rounded-full border border-white/10 bg-white/6 px-4 py-2 text-xs font-medium text-[var(--color-muted)] md:block">
            Market scanner
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
                  <MetricCard label="Momentum" value="187 assets rising" tone="up" />
                  <MetricCard label="Pressure" value="53 sharp reversals" tone="down" />
                  <MetricCard label="Rotation" value="$98B active volume" tone="neutral" />
                </div>
              </div>

              <div className="hidden h-24 w-24 rounded-full border border-emerald-400/25 bg-emerald-300/10 blur-[2px] lg:block" />
            </div>

            <div className="mt-10 overflow-hidden rounded-[1.5rem] border border-white/8 bg-black/20">
              <div className="grid grid-cols-[1.2fr_1fr_0.9fr_0.8fr] gap-3 border-b border-white/8 px-4 py-3 text-[0.68rem] font-medium uppercase tracking-[0.18em] text-[var(--color-dim)]">
                <span>Asset</span>
                <span>Price</span>
                <span>24h</span>
                <span>Bias</span>
              </div>

              <div className="divide-y divide-white/6">
                {previewRows.map((asset) => (
                  <div
                    key={asset.symbol}
                    className="grid grid-cols-[1.2fr_1fr_0.9fr_0.8fr] items-center gap-3 px-4 py-4"
                  >
                    <div>
                      <p className="font-medium text-white">{asset.symbol}</p>
                      <p className="text-sm text-[var(--color-muted)]">
                        {asset.name}
                      </p>
                    </div>
                    <p className="font-medium text-white">{asset.price}</p>
                    <p
                      className={
                        asset.move.startsWith("-")
                          ? "font-medium text-[var(--color-down)]"
                          : "font-medium text-[var(--color-up)]"
                      }
                    >
                      {asset.move}
                    </p>
                    <div className="h-8 overflow-hidden rounded-full bg-white/[0.04]">
                      <div
                        className={`h-full rounded-full ${
                          asset.move.startsWith("-")
                            ? "bg-[linear-gradient(90deg,rgba(248,113,113,0.92),rgba(248,113,113,0.22))]"
                            : "bg-[linear-gradient(90deg,rgba(74,222,128,0.92),rgba(74,222,128,0.18))]"
                        }`}
                        style={{
                          width: asset.move.startsWith("-") ? "41%" : "72%",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <aside className="grid gap-6">
            <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(17,24,39,0.92),rgba(10,14,20,0.96))] p-6">
              <p className="text-[0.7rem] font-medium uppercase tracking-[0.22em] text-[var(--color-dim)]">
                Build target
              </p>
              <div className="mt-5 space-y-5">
                <StatusRow label="Overview" value="Market pulse first" />
                <StatusRow label="Scanner" value="Search, sort, compare" />
                <StatusRow label="Movement" value="1h, 24h, 7d + trend" />
                <StatusRow label="Resilience" value="Retry and stale states" />
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6">
              <p className="text-[0.7rem] font-medium uppercase tracking-[0.22em] text-[var(--color-dim)]">
                Design frame
              </p>
              <div className="mt-6 space-y-4">
                <PaletteSwatch
                  label="Rising"
                  color="bg-[linear-gradient(135deg,#4ade80,#86efac)]"
                />
                <PaletteSwatch
                  label="Falling"
                  color="bg-[linear-gradient(135deg,#f87171,#fca5a5)]"
                />
                <PaletteSwatch
                  label="Calm"
                  color="bg-[linear-gradient(135deg,#94a3b8,#e2e8f0)]"
                />
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
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

function PaletteSwatch({ label, color }: { label: string; color: string }) {
  return (
    <div className="flex items-center gap-4">
      <div className={`h-10 flex-1 rounded-full ${color}`} />
      <p className="w-20 text-sm text-[var(--color-muted)]">{label}</p>
    </div>
  );
}
