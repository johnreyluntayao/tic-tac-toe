# Moon & Bloom

A two-player tic-tac-toe game by Johnrey, built with React, Next.js App Router,
TypeScript, Tailwind CSS, Lucide, Framer Motion, and canvas-confetti.

## Run locally

Use Node.js 24 LTS for the app and the TypeScript-based logic tests.

```sh
npm ci
npm run dev
```

Open the URL printed by Next.js (normally http://localhost:3000).
Inter uses next/font/google and needs network access on the first build.

## The game

Moon, a lavender crescent, and Bloom, a warm flower, replace the traditional
marks. Their original SVG artwork lives in components/game/player-mark.tsx;
there are no external image services or downloads. Stable internal X/O IDs
preserve scores saved before the redesign.

- Two people share the screen, taking turns to claim an empty square.
- Three in a row wins, including diagonals. A full board without a winner draws.
- A result popup offers a rematch or a look at the completed board.
- Wins launch a full-viewport confetti celebration. Reduced-motion preferences
  disable confetti and reduce Framer Motion animations.
- The next starting player alternates on each new game.
- Restarting an unfinished round and resetting scores require confirmation.
- The help button explains rules and keyboard controls without crowding the board.

## Saving and refreshing

The board, move history, starting player, turn, and scores restore on refresh.
Each action saves synchronously to localStorage. Saved moves are replayed and
validated before restoration, and finished rounds are never counted twice.
Existing scores from the previous version migrate automatically.

If localStorage is blocked or full, play still works in memory. A visible warning
explains the limitation, and an unsaved nonempty board registers a native
beforeunload warning. Browsers control its wording and availability; some mobile
browsers may not show it. No custom modal can reliably replace that browser dialog.

Storage is local to this browser and origin. Clearing browser data removes saved
progress. There is no account sync; simultaneous tabs do not synchronize games.

## Accessibility and layout

- Native modal dialogs provide focus trapping, Escape dismissal, and focus return.
- Board cells announce coordinates, character names, and winning squares.
- Tab reaches the board, arrow keys navigate, and Enter/Space places a mark.
- Home/End jump to the first/last square; live status announces turn changes.
- Desktop uses a three-column game table. Tablet/mobile move the compact player
  cards above the board. Dialogs scroll within short viewports.
- Reduced-motion and forced-color styles are included.

## Checks

```sh
npm run lint
npm test
npm run build
npm run format:check
```

The build checks TypeScript. Tests cover all winning lines, invalid moves, draws,
score resets, every one of the 255,168 completed X-starting game sequences,
refresh restoration, old-score migration, and invalid save histories.
Run npm start after building to preview the production app locally.

## Structure

```text
app/                 Home route, metadata, root layout, global theme
components/game/     Game, board, character art, player cards, results, celebration
components/ui/       Glass surface, accessible modal, confirmation dialog
hooks/use-game.ts    Game state, synchronous persistence, refresh protection
lib/game.ts          Pure game rules, reducer, saved-game validation
lib/players.ts       Character names, themes, colors
lib/imports.ts       Public component and icon exports
styles/              Glass surfaces and responsive game styling
tests/               Game and persistence tests
```

Pages use `@/lib/imports` as the public component and icon entry point. Components
exported by that barrel use direct imports: importing their own barrel would
create a circular dependency. ESLint enforces this boundary. React, Next.js,
Framer Motion, game logic, and CSS imports remain direct.

Run `npm run format` to apply the shared Prettier formatting. Keep the formatting
check in the review workflow so JSX, styles, and configuration stay consistent.

## Manual review before submission

Test Moon and Bloom wins, a draw, rematches, reset confirmations, refresh midway
through a round, refresh after a win, keyboard-only controls, reduced motion,
and storage disabled. Check 320px, 390px, 768px, 1024px, and wide desktop layouts,
plus landscape phones and browser zoom.

Live browser checks completed: win popup, rematch, mid-round refresh restoration,
full-page win confetti, 320px phone layout, 768px tablet popup, 667px landscape
popup scrolling, and 1440px desktop layout. No horizontal overflow was found in
the checked narrow/wide layouts and no browser console errors were reported.
Storage-disabled behavior, assistive-technology testing, and deployment still
need manual review; these checks are not a claim of testing every device.
