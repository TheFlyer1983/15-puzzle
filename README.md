# 15 Puzzle

A Nuxt web app for playing the classic 15-puzzle. The goal is to arrange the numbered tiles from 1 to 15 by sliding them into the empty space until the board returns to solved order.

The MVP focuses on a clean, playable puzzle experience: solvable boards, simple controls, move tracking, reset/new game actions, and a completion message when the puzzle is solved.

## Gameplay

The puzzle starts with an easy randomized board created by making valid moves from the solved layout. This keeps every game solvable while avoiding puzzles that are too difficult for the MVP.

Click a tile next to the empty space to slide it into that space. Tiles that can move are highlighted, while tiles that cannot move are disabled. The move counter only increases after successful tile moves.

When the tiles return to solved order, the game shows a completion message and disables further tile movement.

Use **Reset** to return to the starting layout for the current game. Use **New game** to generate a fresh randomized puzzle.

## Setup

This project uses Node.js 22 or newer and pnpm.

```bash
pnpm install
```

Copy the example environment file and fill in the public Supabase project values:

```bash
cp .env.example .env
```

`NUXT_PUBLIC_SUPABASE_URL` should use the project API URL. `NUXT_PUBLIC_SUPABASE_KEY` should use the publishable/anon key only. Do not add Supabase service role or secret keys to `.env` values that use the `NUXT_PUBLIC_` prefix.

## Supabase Auth

Create or select a Supabase project, then configure Auth before deploying features that use sign-in:

1. In **Authentication > Providers**, enable the Email provider.
2. Keep email confirmation enabled for new registrations.
3. In **Authentication > URL Configuration**, set the Site URL to the production app URL.
4. Add Redirect URLs for local development and production:

```text
http://localhost:3000
http://localhost:3000/**
https://your-production-domain.example
https://your-production-domain.example/**
```

The Nuxt Supabase module is configured with global auth redirects disabled, so the puzzle remains playable for signed-out users.

## Development Server

Start the development server on `http://localhost:3000`:

```bash
pnpm dev
```

## Build

Build the application for production:

```bash
pnpm build
```

Preview the production build locally:

```bash
pnpm preview
```

## Quality Checks

Run the test suite:

```bash
pnpm test
```

Run coverage, linting, formatting checks, and type checking:

```bash
pnpm test:coverage
pnpm lint
pnpm fmt:check
pnpm typecheck
```
