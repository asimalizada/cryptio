export function formatCurrency(value: number | null) {
  if (value === null) {
    return "—";
  }

  const digits = value >= 1000 ? 0 : value >= 1 ? 2 : 4;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: digits,
  }).format(value);
}

export function formatCompactCurrency(value: number | null) {
  if (value === null) {
    return "—";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatPercent(value: number | null) {
  if (value === null) {
    return "—";
  }

  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}

export function formatRelativeTime(dateString: string | null) {
  if (!dateString) {
    return "—";
  }

  const deltaSeconds = Math.round((new Date(dateString).getTime() - Date.now()) / 1000);

  const formatter = new Intl.RelativeTimeFormat("en", {
    numeric: "auto",
  });

  const ranges: Array<[Intl.RelativeTimeFormatUnit, number]> = [
    ["minute", 60],
    ["hour", 3600],
    ["day", 86400],
  ];

  for (const [unit, seconds] of ranges) {
    if (Math.abs(deltaSeconds) < seconds * (unit === "minute" ? 60 : 24)) {
      const divisor =
        unit === "minute" ? 60 : unit === "hour" ? 3600 : 86400;
      return formatter.format(Math.round(deltaSeconds / divisor), unit);
    }
  }

  return formatter.format(Math.round(deltaSeconds / 86400), "day");
}

export function formatNumber(value: number | null, maximumFractionDigits = 0) {
  if (value === null) {
    return "—";
  }

  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits,
  }).format(value);
}
