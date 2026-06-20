# AI Usage

AI tools were used during this project.

## Tools used

- Codex / GPT-based coding assistant in the local coding environment

## What AI was used for

- planning the implementation phases
- shaping the market-scanner product direction
- generating and iterating on component structure
- drafting data normalization and UI interaction logic
- refining visual hierarchy, spacing, and motion decisions
- drafting documentation

## What output was accepted directly

- some initial code structure
- some utility and component scaffolding
- early implementation drafts for data flow and UI sections

## What was changed or rejected

- large components were later split into feature folders for cleaner boundaries
- compare panel UX was reworked after reviewing it against the intended reference
- motion, radius, and surface styling were refined after visual review
- phase boundaries were corrected in practice after some implementation decisions became too compressed
- any UI that felt noisy, overly rounded, or insufficiently dense was revised

## How the final result was verified

- manually reviewed the interface against the task goals and visual reference
- tested search, sorting, compare add/remove flow, and comparison chart behavior
- validated loading, error, retry, refresh, and stale-data states during implementation
- ran:

```bash
npm run lint
npm run build
```

## Final ownership note

AI accelerated implementation and iteration, but the final structure, tradeoffs, and accepted output were reviewed and shaped intentionally during development.
