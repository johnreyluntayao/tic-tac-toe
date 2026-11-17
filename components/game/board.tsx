import { useRef, type KeyboardEvent } from "react";
import type { Board as BoardValue, Player } from "@/lib/game";
import { PlayerMark } from "./player-mark";

type Props = { board: BoardValue; turn: Player; line: number[]; locked: boolean; onPlay: (index: number) => void };

export function Board({ board, turn, line, locked, onPlay }: Props) {
  const cells = useRef<(HTMLButtonElement | null)[]>([]);
  function navigate(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const moves: Record<string, number> = {
      ArrowRight: index % 3 === 2 ? index - 2 : index + 1,
      ArrowLeft: index % 3 === 0 ? index + 2 : index - 1,
      ArrowDown: (index + 3) % 9,
      ArrowUp: (index + 6) % 9,
      Home: 0, End: 8,
    };
    if (event.key in moves) {
      event.preventDefault();
      cells.current[moves[event.key]]?.focus();
    }
  }
  return (
    <div className="board" role="group" aria-label="Tic-tac-toe board" aria-describedby="keyboard-help">
      {board.map((mark, index) => (
        <button key={index} ref={(node) => { cells.current[index] = node; }}
          type="button" className={`board-cell ${line.includes(index) ? "winning-cell" : ""}`}
          aria-label={`Row ${Math.floor(index / 3) + 1}, column ${index % 3 + 1}: ${mark ?? "empty"}${line.includes(index) ? ", winning square" : ""}`}
          aria-disabled={locked || Boolean(mark)}
          onKeyDown={(event) => navigate(event, index)}
          onClick={() => { if (!locked && !mark) onPlay(index); }}>
          {mark ? <PlayerMark player={mark} className="placed-mark" /> :
            !locked && <PlayerMark player={turn} className="preview-mark" />}
        </button>
      ))}
    </div>
  );
}
