# Decisions

## Screen structure

I chose a focused scanner layout instead of a generic crypto dashboard.

The screen is structured as:

1. Header
2. Overview cards
3. Top movers
4. Main scanner table
5. Compare panel

Why:

- the table is the main product surface for fast scanning
- overview cards give instant market context without slowing the user down
- the movers rail highlights unusual activity before the user inspects the full list
- the compare panel turns the page into an exploration tool, not just a read-only dashboard

## Data fetching and state

I used an internal Next.js API route as the frontend data boundary.

Why:

- keeps third-party API details out of the client
- gives one place to normalize CoinGecko responses
- makes loading, error, retry, and stale states easier to reason about

The UI uses a lean local state model instead of a heavier data library.

Why:

- the task scope is a single-page exploration tool
- local state was enough for search, sort, compare, and refresh behavior
- it kept implementation time focused on the product surface

## Market movement visualization

I used multiple levels of movement visualization instead of one heavy chart area:

- overview micro-visuals
- auto-moving top movers rail
- row-level 7D sparklines
- compare-panel multi-line 7D chart

Why:

- the user can first scan the market broadly
- then inspect asset-level recent movement in the table
- then compare a few assets directly in the side panel

This matched the task better than building one large chart page.

## Performance approach

I kept the dataset scoped to the top 100 market-cap assets for the first version.

Why:

- large enough to feel like a real market scanner
- small enough to keep the UI dense and responsive without introducing virtualization complexity

Other performance choices:

- server-side normalized API boundary
- no large chart dependency
- custom SVG sparkline and compare chart rendering
- client-side derived search/sort only on the already fetched dataset

## Tradeoffs

- no realtime websocket or polling layer; refresh and stale-state handling were prioritized instead
- no secondary global market endpoint; overview cards are dataset-derived
- no favorites persistence yet
- no category filters yet
- no multi-timeframe compare chart yet because current normalized sparkline data is 7D

## What I would improve with more time

- synchronize the header search with the main scanner search without creating control duplication
- add functional filter groups such as favorites, DeFi, Layer 1, or volume-based slices
- add optional local persistence for compare or favorites
- add more refined responsive behavior for the compare rail on smaller screens
- support additional comparison windows if more historical series data is added to the data pipeline
- add lightweight UI tests around search, sort, and compare state transitions
