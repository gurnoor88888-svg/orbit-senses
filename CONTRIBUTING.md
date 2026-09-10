# Contributing to Orbit Sense

Thanks for your interest in contributing to this prototype!

## Development Setup

1. Install [Bun](https://bun.sh).
2. `bun install`
3. `bunx convex dev --once` — provisions a Convex backend and prints `VITE_CONVEX_URL`.
4. `bun run dev` — starts the Vite dev server.

## Before Opening a PR

```bash
bun tsc -b --noEmit   # typecheck (CI enforces this)
bun run lint          # eslint
```

Keep changes minimal and consistent with the existing mission-control theme
(deep navy, glassmorphism panels, cyan accents — see `src/index.css` for tokens).

## Conventions

- Pages live in `src/pages`, routed from `src/main.tsx`.
- Shared mission simulation state lives in `src/components/mission/store.ts`.
- shadcn/ui primitives live in `src/components/ui` — prefer reusing them.
- Do not commit `.env` files or secrets.

## Scope Reminder

Orbit Sense is a software demo. Do not present simulated features as space-qualified or
connected to real spacecraft hardware.
