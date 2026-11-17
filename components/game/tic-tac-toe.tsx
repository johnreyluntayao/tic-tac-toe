"use client";

import { useState } from "react";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  CircleHelp,
  RotateCcw,
  ShieldCheck,
  Users,
  AlertCircle,
  GlassPanel,
  ConfirmDialog,
  Board,
  PlayerMark,
  PlayerCard,
  Scoreboard,
  ResultDialog,
  HelpDialog,
} from "@/lib/imports";
import { useGame } from "@/hooks/use-game";
import { PLAYERS } from "@/lib/players";
import { getResult } from "@/lib/game";
import "@/styles/game.css";

export function TicTacToe() {
  const { state, send, storageAvailable, result } = useGame();
  const [popup, setPopup] = useState<"round" | "scores" | "help" | null>(null);
  const [resultDismissed, setResultDismissed] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const finished = Boolean(result.winner || result.draw);
  const nextStarter = state.starter === "X" ? "O" : "X";
  const moves = state.history.length;
  const status = !state.ready
    ? "Setting the table..."
    : result.winner
      ? `${PLAYERS[result.winner].name} wins this round`
      : result.draw
        ? "A draw. Well played, both."
        : `${PLAYERS[state.turn].name}'s move`;

  function startRound() {
    send({ type: "new-round" });
    setResultDismissed(false);
    setCelebrate(false);
    setPopup(null);
  }

  function play(index: number) {
    const next = send({ type: "play", index });
    if (!next) return;
    const outcome = getResult(next.board);
    if (outcome.winner || outcome.draw) {
      setResultDismissed(false);
      setCelebrate(true);
    }
  }

  return (
    <MotionConfig reducedMotion="user">
      <main id="main-content" className="game-page">
        <div className="ambient-orbit orbit-one" aria-hidden="true" />
        <div className="ambient-orbit orbit-two" aria-hidden="true" />
        <motion.div
          className="game-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.45 }}
        >
          <div className="game-intro">
            <span className="edition-label">
              <span /> A TWO-PLAYER LITTLE ESCAPE
            </span>
            <h1>
              Moon <em>&</em> Bloom
              <span className="title-star" aria-hidden="true">
                *
              </span>
            </h1>
            <p>Opposite sides. Same little obsession.</p>
            <span className="game-subtitle">TIC-TAC-TOE, WITH A LITTLE PERSONALITY</span>
          </div>

          <div className="game-table">
            <Scoreboard
              scores={state.scores}
              ready={state.ready}
              onReset={() => setPopup("scores")}
            />
            <PlayerCard
              player="X"
              active={state.ready && !finished && state.turn === "X"}
              winner={result.winner === "X"}
              score={state.scores.X}
              ready={state.ready}
            />
            <GlassPanel className="play-panel" aria-label="Game board">
              <div className="board-topline">
                <span>
                  <Users size={14} aria-hidden="true" /> YOU + A FRIEND
                </span>
                <button
                  className="icon-button"
                  aria-label="How to play"
                  onClick={() => setPopup("help")}
                >
                  <CircleHelp size={19} aria-hidden="true" />
                </button>
              </div>
              <div className="turn-status" role="status" aria-live="polite" aria-atomic="true">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={status}
                    className="turn-status-inner"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.13 }}
                  >
                    {finished ? (
                      <Check size={20} aria-hidden="true" />
                    ) : (
                      <PlayerMark player={state.turn} />
                    )}
                    <h2>{status}</h2>
                  </motion.div>
                </AnimatePresence>
                <p>
                  {finished
                    ? "A little rivalry deserves a rematch."
                    : "Find your square. Make it yours."}
                </p>
              </div>
              <Board
                board={state.board}
                turn={state.turn}
                line={result.line}
                locked={!state.ready || finished}
                onPlay={play}
              />
              <div className="board-bottomline">
                <span>
                  {String(moves).padStart(2, "0")} <span>/ 09 moves</span>
                </span>
                <span>{finished ? "Round complete" : "Three in a row wins"}</span>
              </div>
              <button
                className={`new-game ${finished ? "primary-button" : "secondary-button"}`}
                disabled={!state.ready}
                onClick={() => (moves > 0 && !finished ? setPopup("round") : startRound())}
              >
                {finished ? (
                  <ArrowRight size={16} aria-hidden="true" />
                ) : (
                  <RotateCcw size={15} aria-hidden="true" />
                )}
                {finished ? "Play another round" : "New Game"}
              </button>
              <span id="keyboard-help" className="sr-only">
                Use Tab or arrow keys to choose a square. Press Enter or Space to play.
              </span>
            </GlassPanel>
            <PlayerCard
              player="O"
              active={state.ready && !finished && state.turn === "O"}
              winner={result.winner === "O"}
              score={state.scores.O}
              ready={state.ready}
            />
          </div>

          <div className={`save-status ${storageAvailable ? "" : "save-warning"}`} role="status">
            {storageAvailable ? (
              <ShieldCheck size={13} aria-hidden="true" />
            ) : (
              <AlertCircle size={15} aria-hidden="true" />
            )}
            <span>
              {!state.ready
                ? "Restoring your game..."
                : storageAvailable
                  ? "Your round is saved. Come back whenever."
                  : "This browser cannot save changes. Refreshing may lose your latest board or scores; a browser warning will appear when supported."}
            </span>
          </div>
          <footer className="game-footer">
            <a className="portfolio-credit" href="https://johnreyluntayao.vercel.app">
              A little game by <strong>Johnrey</strong>
              <ArrowRight size={13} aria-hidden="true" />
            </a>
            <span>Made for the rematch.</span>
          </footer>
        </motion.div>
      </main>

      {finished && !resultDismissed && state.ready && !popup && (
        <ResultDialog
          winner={result.winner}
          nextStarter={nextStarter}
          celebrate={celebrate}
          onNext={startRound}
          onClose={() => {
            setResultDismissed(true);
            setCelebrate(false);
          }}
        />
      )}
      {popup === "help" && <HelpDialog onClose={() => setPopup(null)} />}
      {(popup === "round" || popup === "scores") && (
        <ConfirmDialog
          title={popup === "round" ? "A fresh start?" : "Reset the rivalry?"}
          description={
            popup === "round"
              ? "This round is still in play. Starting again clears the board, keeps your scores, and lets the other player go first."
              : "Moon's wins, Bloom's wins, and all draws will return to zero. Your current board stays right here."
          }
          confirmLabel={popup === "round" ? "Start new game" : "Reset scores"}
          onClose={() => setPopup(null)}
          onConfirm={() => {
            if (popup === "round") startRound();
            else {
              send({ type: "reset-scores" });
              setPopup(null);
            }
          }}
        />
      )}
    </MotionConfig>
  );
}
