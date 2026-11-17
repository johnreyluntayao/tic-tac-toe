"use client";

import { useEffect, useReducer, useState } from "react";
import { ArrowUpRight, Check, Equal, Gamepad2, Grid2X2, Keyboard, RotateCcw, Sparkles, Trophy, Users } from "lucide-react";
import { gameReducer, getResult, initialState, parseScores } from "@/lib/game";
import { GlassPanel } from "@/components/ui/glass-panel";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Board } from "./board";
import { PlayerMark } from "./player-mark";
import { Scoreboard } from "./scoreboard";
import "@/styles/game.css";

const STORAGE_KEY = "johnrey-tic-tac-toe:scores:v1";

export function TicTacToe() {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const [confirmation, setConfirmation] = useState<"round" | "scores" | null>(null);
  useEffect(() => {
    let saved = null;
    try { saved = localStorage.getItem(STORAGE_KEY); } catch { /* Play still works without storage. */ }
    dispatch({ type: "hydrate", scores: parseScores(saved) });
  }, []);
  useEffect(() => {
    if (!state.ready) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state.scores)); }
    catch { /* Storage can be blocked; the in-memory scoreboard still works. */ }
  }, [state.ready, state.scores]);
  const result = getResult(state.board);
  const finished = Boolean(result.winner || result.draw);
  const moves = state.board.filter(Boolean).length;
  const status = result.winner ? `Player ${result.winner} wins!` : result.draw ? "A perfect standoff." : `Player ${state.turn}, your move.`;
  function newRound() {
    if (moves && !finished) setConfirmation("round");
    else dispatch({ type: "new-round" });
  }
  return (
    <div className="game-shell page-container">
      <header className="site-header"><a href="#main-content" className="brand"><span className="brand-icon"><Grid2X2 size={20} aria-hidden="true" /></span>the little game<span className="brand-dot">.</span></a><span className="header-credit">A little friendly competition <ArrowUpRight size={14} aria-hidden="true" /></span></header>
      <main id="main-content">
        <div className="intro"><span className="intro-tag"><Sparkles size={13} aria-hidden="true" /> CLASSIC GAME. FRESH PERSPECTIVE.</span><h1>Three in a row.<br /><span>One more round.</span></h1><p>Grab a friend. Pick a square. Make your move.<br className="desktop-break" /> The classics never get old.</p></div>
        <div className="game-layout">
          <GlassPanel className="play-panel" aria-label="Game">
            <div className="board-heading"><span><Gamepad2 size={17} aria-hidden="true" /> TIC-TAC-TOE</span><span className="mode-badge"><span /> LOCAL 2-PLAYER</span></div>
            <div className={`turn-status ${finished ? "finished-status" : ""}`} role="status" aria-live="polite" aria-atomic="true">
              <span className="status-symbol">{result.winner ? <Trophy aria-hidden="true" /> : result.draw ? <Equal aria-hidden="true" /> : <PlayerMark player={state.turn} />}</span>
              <div><h2>{status}</h2><p>{result.winner ? "Three in a row. Nicely played." : result.draw ? "It's a draw. Great minds think alike." : "Choose an empty square to claim it."}</p></div>
            </div>
            <Board board={state.board} turn={state.turn} line={result.line} locked={!state.ready || finished} onPlay={(index) => dispatch({ type: "play", index })} />
            <div className="board-meta"><span>{finished ? <Check size={13} aria-hidden="true" /> : <span className="live-dot" />}{finished ? "Round complete" : "Game in progress"}</span><span>{moves} / 9 moves</span></div>
            <button className="primary-button new-game" disabled={!state.ready} onClick={newRound}><RotateCcw size={17} aria-hidden="true" /> New Game <span>↗</span></button>
            <p className="next-starter">{state.starter === "X" ? "O" : "X"} starts the next round. Keep it fair.</p>
          </GlassPanel>
          <aside className="side-panels" aria-label="Scores and game instructions">
            <Scoreboard scores={state.scores} ready={state.ready} onReset={() => setConfirmation("scores")} />
            <GlassPanel className="rules-panel" aria-labelledby="rules-heading"><div className="panel-heading"><h2 id="rules-heading"><Users size={17} aria-hidden="true" /> Small board. Big rivalry.</h2></div><ol className="rules-list"><li><span>01</span><p><strong>Take turns.</strong> X and O share the same screen.</p></li><li><span>02</span><p><strong>Connect three.</strong> Across, down, or diagonally. Your call.</p></li><li><span>03</span><p><strong>Run it back.</strong> A full board without a winner is a draw.</p></li></ol><div className="keyboard-tip" id="keyboard-help"><Keyboard size={18} aria-hidden="true" /><p>Keyboard player?<br /><span>Tab to the board, arrow keys to explore, Enter or Space to play.</span></p></div></GlassPanel>
            <div className="side-note"><span /> No sign-ups. No distractions. Just play.</div>
          </aside>
        </div>
      </main>
      <footer className="site-footer"><span>DESIGNED & BUILT BY <strong>JOHNREY</strong></span><span>Made for a little friendly competition.</span></footer>
      {confirmation && <ConfirmDialog title={confirmation === "round" ? "Start a fresh round?" : "Reset the scoreboard?"} description={confirmation === "round" ? "This round is still in progress. Starting over clears the board without changing your scores." : "Both players' wins and all draws will return to zero. Your current board stays as it is."} confirmLabel={confirmation === "round" ? "New Game" : "Reset scores"} onClose={() => setConfirmation(null)} onConfirm={() => { dispatch({ type: confirmation === "round" ? "new-round" : "reset-scores" }); setConfirmation(null); }} />}
    </div>
  );
}
