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
