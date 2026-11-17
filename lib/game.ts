export type Player = "X" | "O";
export type Board = (Player | null)[];
export type Scores = { X: number; O: number; draws: number };
export const WINNING_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
] as const;

export function getResult(board: Board) {
  for (const line of WINNING_LINES) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line: [...line], draw: false };
    }
  }
  return { winner: null, line: [] as number[], draw: board.every(Boolean) };
}

export type GameState = {
  board: Board;
  turn: Player;
  starter: Player;
  scores: Scores;
  ready: boolean;
};
export const initialState: GameState = {
  board: Array(9).fill(null), turn: "X", starter: "X",
  scores: { X: 0, O: 0, draws: 0 }, ready: false,
};
export type GameAction =
  | { type: "play"; index: number }
  | { type: "new-round" }
  | { type: "reset-scores" }
  | { type: "hydrate"; scores: Scores };

export function parseScores(value: string | null): Scores {
  try {
    const data = JSON.parse(value ?? "null");
    if (data && [data.X, data.O, data.draws].every(
      (score) => Number.isSafeInteger(score) && score >= 0,
    )) return { X: data.X, O: data.O, draws: data.draws };
  } catch { /* Invalid saved data falls back to a fresh scoreboard. */ }
  return { X: 0, O: 0, draws: 0 };
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  if (action.type === "hydrate") {
    return state.ready ? state : { ...state, scores: action.scores, ready: true };
  }
  if (!state.ready) return state;
  if (action.type === "reset-scores") {
    return { ...state, scores: { X: 0, O: 0, draws: 0 } };
  }
  if (action.type === "new-round") {
    const starter = state.starter === "X" ? "O" : "X";
    return { ...state, board: Array(9).fill(null), starter, turn: starter };
  }
  const result = getResult(state.board);
  if (!Number.isInteger(action.index) || action.index < 0 || action.index > 8 ||
      state.board[action.index] || result.winner || result.draw) return state;
  const board = [...state.board];
  board[action.index] = state.turn;
  const next = getResult(board);
  const scores = { ...state.scores };
  if (next.winner) scores[next.winner] += 1;
  else if (next.draw) scores.draws += 1;
  return { ...state, board, scores, turn: state.turn === "X" ? "O" : "X" };
}
