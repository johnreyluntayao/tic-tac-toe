# Tic-Tac-Toe

A local two-player game built with React, Next.js App Router, TypeScript,
Tailwind CSS, and Lucide icons. The glass surfaces, Inter typography, and navy,
blue, and violet theme follow Johnrey's portfolio.

## Run locally

Use Node.js 24 LTS for the app and the TypeScript-based logic tests.

```sh
npm ci
npm run dev
```

Open the local URL printed in the terminal (normally http://localhost:3000).
Inter uses next/font/google, which needs network access on the first build.

## Play

- Two people share the screen, taking turns as X and O.
- Connect three marks horizontally, vertically, or diagonally to win.
- A full board without a winner is a draw.
- New Game clears the board and alternates the starting player. An unfinished
  round asks for confirmation before clearing.
- Wins and draws save in this browser when local storage is available.
  Refreshing starts a fresh board while retaining scores.
- Reset scores clears the scoreboard after confirmation and preserves the board.
- Tab reaches the board, arrow keys navigate squares, and Enter or Space places
  a mark. Home and End jump to the first and last squares.

## Checks

```sh
npm run lint
npm test
npm run build
```

The build checks TypeScript. Tests cover winning lines, draws, invalid moves,
score validation, resets, and all 255,168 completed game sequences starting with X.
Run npm start after building to preview the production app locally.

## Project structure

```text
app/                 Home route, root layout, and global theme
components/game/     Game controller, board, marks, and scoreboard
components/ui/       Glass panel and confirmation dialog
lib/game.ts          Game rules, reducer, and score validation
lib/imports.ts       Public component and icon exports
styles/              Glass surfaces and responsive game styling
tests/              Logic tests using Node's built-in test runner
```

Pages consume shared UI through @/lib/imports. Exported components use direct
internal imports to avoid importing their own barrel, and import icons directly
from lucide-react. React, Next.js, and CSS imports remain direct.

## Manual review

Check a win, a draw, New Game, both confirmation dialogs, score persistence after
refresh, keyboard navigation, and mobile layout. Browser visual QA and deployment
are not yet complete. No accounts, backend, or online multiplayer are required.
