import test from "node:test";
import assert from "node:assert/strict";
import {
  gameReducer,
  initialState,
  getResult,
  parseScores,
  restoreGame,
  serializeGame,
  WINNING_LINES,
} from "../lib/game.ts";

const fresh = () =>
  gameReducer(initialState, { type: "hydrate", scores: { X: 0, O: 0, draws: 0 } });
const play = (state, moves) =>
  moves.reduce((s, index) => gameReducer(s, { type: "play", index }), state);

test("detects every winning line for both players", () => {
  for (const player of ["X", "O"])
    for (const line of WINNING_LINES) {
      const board = Array(9).fill(null);
      line.forEach((i) => {
        board[i] = player;
      });
      assert.deepEqual(getResult(board), { winner: player, line: [...line], draw: false });
    }
});
test("alternates turns and rejects occupied or invalid squares", () => {
  const state = play(fresh(), [0, 4]);
  assert.equal(state.turn, "X");
  assert.deepEqual(state.board.slice(0, 5), ["X", null, null, null, "O"]);
  for (const index of [0, 4, -1, 9, 1.5])
    assert.equal(gameReducer(state, { type: "play", index }), state);
});
test("a win is counted once and locks the board", () => {
  const state = play(fresh(), [0, 3, 1, 4, 2]);
  assert.deepEqual(state.scores, { X: 1, O: 0, draws: 0 });
  assert.equal(play(state, [5, 8]), state);
});
test("draws count once and new rounds alternate starters while keeping scores", () => {
  const state = play(fresh(), [0, 1, 2, 4, 3, 5, 7, 6, 8]);
  assert.equal(getResult(state.board).draw, true);
  assert.deepEqual(state.scores, { X: 0, O: 0, draws: 1 });
  assert.equal(play(state, [0]), state);
  const next = gameReducer(state, { type: "new-round" });
  assert.deepEqual(next.board, Array(9).fill(null));
  assert.equal(next.turn, "O");
  assert.deepEqual(next.scores, state.scores);
  assert.equal(gameReducer(next, { type: "new-round" }).turn, "X");
});
test("a ninth-move win takes precedence over a draw", () => {
  const state = play(fresh(), [0, 1, 2, 3, 4, 5, 7, 6, 8]);
  assert.equal(getResult(state.board).winner, "X");
  assert.equal(state.scores.draws, 0);
});
test("resetting scores preserves board and turn", () => {
  const state = play(fresh(), [0, 3, 1, 4, 2]);
  const next = gameReducer(state, { type: "reset-scores" });
  assert.equal(next.board, state.board);
  assert.equal(next.turn, state.turn);
  assert.deepEqual(next.scores, { X: 0, O: 0, draws: 0 });
});
test("saved scores are validated and hydration cannot overwrite an active game", () => {
  for (const raw of [
    null,
    "broken",
    "null",
    "{}",
    '{"X":-1,"O":0,"draws":0}',
    '{"X":"2","O":0,"draws":0}',
  ]) {
    assert.deepEqual(parseScores(raw), { X: 0, O: 0, draws: 0 });
  }
  assert.deepEqual(parseScores('{"X":2,"O":3,"draws":4}'), { X: 2, O: 3, draws: 4 });
  const state = fresh();
  assert.equal(gameReducer(state, { type: "hydrate", scores: { X: 99, O: 0, draws: 0 } }), state);
});
test("all reachable games stop at a win or draw and count exactly one result", () => {
  let terminals = 0;
  function visit(state) {
    const result = getResult(state.board);
    if (result.winner || result.draw) {
      terminals++;
      assert.equal(state.scores.X + state.scores.O + state.scores.draws, 1);
      for (let i = 0; i < 9; i++)
        assert.equal(gameReducer(state, { type: "play", index: i }), state);
      return;
    }
    for (let i = 0; i < 9; i++)
      if (!state.board[i]) visit(gameReducer(state, { type: "play", index: i }));
  }
  visit(fresh());
  assert.equal(terminals, 255168);
});

test("refresh restores an unfinished round with the correct turn and scores", () => {
  const state = play(fresh(), [0, 4, 2]);
  assert.deepEqual(restoreGame(serializeGame(state)), state);
});

test("refresh restores completed rounds without awarding the result twice", () => {
  for (const moves of [
    [0, 3, 1, 4, 2],
    [0, 1, 2, 4, 3, 5, 7, 6, 8],
  ]) {
    const completed = play(fresh(), moves);
    const restored = restoreGame(serializeGame(completed));
    assert.deepEqual(restored, completed);
    assert.equal(play(restored, [8]), restored);
  }
});

test("refresh restores an O-starting round and preserves cleared scores", () => {
  const next = gameReducer(fresh(), { type: "new-round" });
  const won = play(next, [0, 3, 1, 4, 2]);
  assert.equal(getResult(won.board).winner, "O");
  const reset = gameReducer(won, { type: "reset-scores" });
  assert.deepEqual(restoreGame(serializeGame(reset)), reset);
});

test("corrupt, duplicate, out-of-range, and post-win saved moves are rejected", () => {
  for (const raw of [
    "broken",
    "null",
    "{}",
    ...[[0, 0], [-1], [9], [1.2], ["0"], [null], [0, 3, 1, 4, 2, 8]].map((history) =>
      JSON.stringify({ version: 1, starter: "X", history, scores: { X: 5, O: 3, draws: 1 } }),
    ),
  ]) {
    const restored = restoreGame(raw);
    assert.deepEqual(restored.board, Array(9).fill(null));
    assert.deepEqual(restored.history, []);
    assert.equal(restored.turn, "X");
  }
});

test("a damaged saved round preserves valid scores instead of erasing them", () => {
  const scores = { X: 5, O: 3, draws: 1 };
  for (const patch of [
    { history: [0, 0] },
    { history: [0, 3, 1, 4, 2, 8] },
    { history: "invalid" },
    { starter: "invalid" },
    { history: Array(10).fill(0) },
  ]) {
    const raw = JSON.stringify({ version: 1, history: [], starter: "X", scores, ...patch });
    const restored = restoreGame(raw);
    assert.deepEqual(restored.scores, scores);
    assert.deepEqual(restored.board, Array(9).fill(null));
    assert.deepEqual(restoreGame(serializeGame(restored)), restored);
  }
});

test("existing scoreboard data migrates into the new save format", () => {
  const restored = restoreGame(null, '{"X":4,"O":2,"draws":3}');
  assert.deepEqual(restored.scores, { X: 4, O: 2, draws: 3 });
  assert.deepEqual(restored.board, Array(9).fill(null));
  assert.deepEqual(restoreGame(serializeGame(restored)), restored);
});
