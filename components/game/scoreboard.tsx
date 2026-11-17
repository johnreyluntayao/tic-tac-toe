import { Equal, RotateCcw, Trophy } from "lucide-react";
import type { Scores } from "@/lib/game";
import { GlassPanel } from "@/components/ui/glass-panel";
import { PlayerMark } from "./player-mark";

export function Scoreboard({ scores, ready, onReset }: { scores: Scores; ready: boolean; onReset: () => void }) {
  return (
    <GlassPanel className="score-panel" aria-labelledby="score-heading">
      <div className="panel-heading"><h2 id="score-heading"><Trophy size={17} aria-hidden="true" /> The scoreboard</h2><span className="eyebrow">ALL TIME</span></div>
      <div className="score-grid">
        <div className="score-item"><PlayerMark player="X" /><span>Player X</span><strong>{ready ? scores.X : "—"}</strong><small>WINS</small></div>
        <div className="score-item draw-score"><Equal aria-hidden="true" /><span>Draws</span><strong>{ready ? scores.draws : "—"}</strong><small>TIES</small></div>
        <div className="score-item"><PlayerMark player="O" /><span>Player O</span><strong>{ready ? scores.O : "—"}</strong><small>WINS</small></div>
      </div>
      <div className="score-footer"><span title="Scores save locally when browser storage is available.">Local browser scores</span><button className="text-button" disabled={!ready || scores.X + scores.O + scores.draws === 0} onClick={onReset}><RotateCcw size={13} aria-hidden="true" /> Reset scores</button></div>
    </GlassPanel>
  );
}
