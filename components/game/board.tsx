"use client";

import { useRef, type KeyboardEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PlayerMark } from "@/lib/imports";
import type { Board as BoardValue, Player } from "@/lib/game";
import { PLAYERS } from "@/lib/players";

type Props = {
  board: BoardValue;
  turn: Player;
  line: number[];
  locked: boolean;
  onPlay: (index: number) => void;
};

export function Board({ board, turn, line, locked, onPlay }: Props) {
  const cells = useRef<(HTMLButtonElement | null)[]>([]);
  function navigate(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const moves: Record<string, number> = {
      ArrowRight: index % 3 === 2 ? index - 2 : index + 1,
      ArrowLeft: index % 3 === 0 ? index + 2 : index - 1,
      ArrowDown: (index + 3) % 9,
      ArrowUp: (index + 6) % 9,
      Home: 0,
      End: 8,
    };
    if (event.key in moves) {
      event.preventDefault();
      cells.current[moves[event.key]]?.focus();
    }
  }
  return (
    <div
      className={`board turn-${PLAYERS[turn].theme}`}
      role="group"
      aria-label="Tic-tac-toe board"
      aria-describedby="keyboard-help"
    >
      {board.map((mark, index) => (
        <motion.button
          key={index}
          ref={(node) => {
            cells.current[index] = node;
          }}
          type="button"
          className={`board-cell ${line.includes(index) ? "winning-cell" : ""} ${mark ? `claimed-${PLAYERS[mark].theme}` : ""}`}
          aria-label={`Row ${Math.floor(index / 3) + 1}, column ${(index % 3) + 1}: ${mark ? PLAYERS[mark].name : "empty"}${line.includes(index) ? ", winning square" : ""}`}
          aria-disabled={locked || Boolean(mark)}
          whileTap={!locked && !mark ? { scale: 0.94 } : undefined}
          onKeyDown={(event) => navigate(event, index)}
          onClick={() => {
            if (!locked && !mark) onPlay(index);
          }}
        >
          <span className="cell-coordinate" aria-hidden="true">
            {String(index + 1).padStart(2, "0")}
          </span>
          <AnimatePresence>
            {mark && (
              <motion.span
                key={mark}
                className="placed-mark"
                initial={{ scale: 0.45, opacity: 0, rotate: -15 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                exit={{ scale: 0.6, opacity: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                <PlayerMark player={mark} />
              </motion.span>
            )}
          </AnimatePresence>
          {!mark && !locked && <PlayerMark player={turn} className="preview-mark" />}
        </motion.button>
      ))}
    </div>
  );
}
