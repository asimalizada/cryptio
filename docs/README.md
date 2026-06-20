# Cryptio

## How to run

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

For a production check:

```bash
npm run build
npm run start
```

## What was implemented

Cryptio is a single-screen crypto market scanner built with Next.js, React, TypeScript, and Tailwind CSS.

Implemented features:

- premium dark market-scanner layout
- market overview cards derived from live market data
- auto-moving top movers rail
- searchable scanner table
- sortable table columns
- compare workflow for up to 3 assets
- right-side comparison panel with metric grid
- multi-asset 7D comparison chart
- loading, error, retry, refresh, and stale-data handling
- responsive layout that keeps the scanner usable on smaller screens

## API / data source

Primary source:

- CoinGecko public API

Current data flow:

- the app fetches market data server-side through `GET /api/market`
- the UI reads only from the internal app route
- the response is normalized before it reaches the interface

Used market fields include:

- rank
- price
- market cap
- volume
- 1h / 24h / 7d price change
- 7d sparkline data

## Important tradeoffs and limitations

- realtime streaming was not implemented because it was not required by the task; the app uses refresh + stale-state handling instead
- overview cards are derived from the fetched market dataset instead of a second global market endpoint, to keep the solution focused and resilient
- compare chart currently uses only `7D` data because that is the sparkline window available in the current normalized dataset
- header search remains a visual shell; the functional search lives in the main scanner area to avoid duplicate active controls
- the current scanner scope prioritizes search, sorting, and compare over extra controls like favorites persistence or category filtering
