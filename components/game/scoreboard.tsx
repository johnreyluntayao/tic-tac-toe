import { Equal, Flag, RotateCcw } from "lucide-react";
import type { Scores } from "@/lib/game";

export function Scoreboard({
  scores,
  ready,
  onReset,
}: {
  scores: Scores;
  ready: boolean;
  onReset: () => void;
}) {
  const total = scores.X + scores.O + scores.draws;
  return (
    <section className="scoreboard-strip glass-container" aria-label="Match totals">
      <div className="match-stat">
        <span className="stat-label">
          <Flag size={14} aria-hidden="true" /> Rounds played
        </span>
        <strong>{ready ? total : "-"}</strong>
      </div>
      <div className="match-stat draw-total">
        <span className="stat-label">
          <Equal size={15} aria-hidden="true" /> Draws
        </span>
        <strong>{ready ? scores.draws : "-"}</strong>
      </div>
      <button className="reset-scores-button" disabled={!ready || total === 0} onClick={onReset}>
        <RotateCcw size={16} aria-hidden="true" /> Reset scores
      </button>
    </section>
  );
}
