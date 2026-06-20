# Cryptio Design Rules

This document is the visual and product UI contract for all next phases of `Cryptio`.

From this point forward, every UI decision should follow this file unless we explicitly revise it together.

## Primary Reference

Main visual reference:

- attached image provided by the user
- supporting note source: `C:\Users\asima\.codex\attachments\88ae4b4d-07c1-4b57-86e5-1df7708ccaf3\pasted-text.txt`

This reference should guide:

- visual mood
- spacing density
- layout hierarchy
- card treatment
- table treatment
- right-side compare panel
- loading, stale, refresh, and retry presentation

It should **inspire** the implementation, not be copied blindly.

## Product Shape

Cryptio is:

- a focused crypto market scanner
- a single-screen market exploration interface
- a lightweight comparison workflow

Cryptio is not:

- a generic admin dashboard
- a portfolio tracker
- an exchange terminal
- a multi-page SaaS product
- a marketing landing page

## Core UX Goal

The user should be able to:

- quickly scan the market
- understand the current market mood
- spot meaningful movement
- search and sort assets
- compare a few selected assets
- stay oriented during loading, error, retry, refresh, and stale-data states

## Visual Direction

### Mood

- premium dark interface
- off-black / deep navy / deep slate background
- layered gradient background, not flat black
- restrained glow accents only where useful
- modern and data-first
- sharp, dense, and intentional

### Styling Rules

- avoid generic admin-template feel
- avoid filler copy and decorative marketing text
- avoid oversized hero sections
- avoid heavy animation
- avoid excessive neon usage
- use bright white only for primary values and headings
- use muted slate/blue-gray for secondary information
- use green/red clearly and consistently for movement

### Color Language

- page background: very dark navy/slate/black
- panel background: slightly lighter dark slate
- border: low-opacity white/slate
- positive: bright green
- negative: red
- warning/stale: amber
- accent: subtle cyan/green gradient only where helpful

## Layout Contract

Desktop-first single-screen layout:

1. Top header
2. Market overview cards
3. Top movers strip
4. Main market scanner table
5. Right-side compare panel
6. Footer/status row

### Desktop Layout

- top full-width header
- below it: 4 overview cards
- below cards: compact top movers strip
- main area: 2 columns
- left side: scanner table, around 70-75%
- right side: compare panel, around 25-30%
- compare panel should stay visually fixed or sticky if simple
- scanner table is the main surface and gets the most space

### Responsive Rules

Tablet:

- overview cards can become 2 columns
- compare panel can move below the table

Mobile:

- compact header
- overview cards become 1 or 2 columns
- movers strip becomes horizontally scrollable
- table can scroll horizontally
- compare panel moves below scanner
- least important columns may be hidden first

## Component Rules

### Header

Include:

- product name/logo on the left
- small status text like live or updated state
- refresh button on the right
- optional trivial icon action only if it already exists or is nearly free

Do not add:

- large navigation
- fake tabs for unrelated pages
- sidebar product shells

Header style:

- height around 64-72px
- dark translucent surface
- thin bottom border
- small green live dot when healthy
- rounded, subtle refresh button

### Overview Cards

Four compact cards:

1. Total Market Cap
2. 24h Volume
3. BTC Dominance
4. Market Sentiment or Breadth

Each card should use:

- small uppercase label
- large primary value
- small change indicator
- optional tiny sparkline or bar
- optional icon only if quick

Card style:

- rounded 16-20px
- dark panel with subtle gradient
- soft border
- subtle inner depth only
- compact but breathable padding

### Top Movers Strip

- one compact rounded panel
- small header
- optional simple timeframe selector
- 5-6 compact mover pills/cards
- show symbol, optional name, percentage change
- use coin image if already available
- keep compact; do not let it dominate the page

### Market Scanner Table

This is the primary product surface.

Must feel:

- dense
- premium
- readable
- scanner-first

Expected section features:

- title: `Market scanner`
- search input
- simple useful tabs/filters only if functional
- sortable columns
- compare/add action

Preferred columns where data exists:

- favorite/star
- rank
- asset
- price
- 1h %
- 24h %
- 7d %
- market cap
- volume (24h)
- 7d sparkline
- compare/add action

Row rules:

- height around 58-68px
- subtle separators
- hover brightens slightly
- selected rows get subtle accent treatment
- asset cell contains icon, symbol, and name
- large numbers use compact formatting

Do not fake unavailable data.

### Compare Panel

Purpose:

- the main active interaction beyond scanning

Behavior:

- add/remove selected assets
- compare up to 3 or 4 assets
- if empty, show a useful empty state
- if populated, show selected assets and a dense metric table

Metrics priority:

- price
- 1h %
- 24h %
- 7d %
- market cap
- volume (24h)
- circulating supply if easily available

Panel style:

- same dark card language as the rest of the app
- header with count and clear action
- stacked selected asset rows
- dense readable metric comparison

## Data State Rules

The UI must visibly handle:

- loading
- error
- retry
- refreshing
- stale data

### Loading

- prefer skeletons matching final layout
- do not rely on a spinner alone

### Error

- show a clear inline error panel
- include retry button
- keep wording useful, not technical

### Refreshing

- keep old data visible if possible
- show a small refreshing signal near header/refresh action
- do not destroy layout during refresh

### Stale

- show last updated state
- use subtle amber indication
- visible but not alarming

## Typography and Spacing

Typography:

- section headings: 20-24px bold
- card values: 24-30px bold
- table body: 14-15px
- secondary labels: 12-13px muted
- uppercase labels used sparingly

Spacing:

- page padding: around 24-32px desktop
- card gap: 16-20px
- compact but readable table padding
- no giant empty areas

## Scope Protection

Do not build:

- full sidebar navigation
- multi-page routing
- authentication
- portfolio management
- alerts
- heatmap
- websocket/live streaming
- complex chart pages
- heavy settings
- unnecessary modals
- fake features

Do not add UI controls that imply functionality we did not implement.

## Implementation Priority

For the next UI phases, build in this order:

1. Main layout shell
2. Market overview cards
3. Top movers strip
4. Searchable/sortable market table
5. Compare panel
6. Loading/error/stale/refresh polish
7. Responsive tuning
8. Final visual polish

## Quality Bar

Every new UI phase should be checked against this bar:

- polished enough to impress visually
- realistic for a take-home task
- data-first, not decorative
- no placeholder-looking sections
- no dead buttons
- consistent spacing and colors
- clear workflow from overview to movers to scanner to compare
