"use client";

import { motion } from "framer-motion";
import { Trophy, PlayerMark } from "@/lib/imports";
import type { Player } from "@/lib/game";
import { PLAYERS } from "@/lib/players";

export function PlayerCard({
  player,
  active,
  winner,
  score,
  ready,
}: {
  player: Player;
  active: boolean;
  winner: boolean;
  score: number;
  ready: boolean;
}) {
  const details = PLAYERS[player];
  return (
    <section
      className={`player-card glass-container ${details.theme}-card ${active ? "is-active" : ""} ${winner ? "is-winner" : ""}`}
      aria-label={`${details.name}: ${score} ${score === 1 ? "win" : "wins"}${active ? ", your turn" : ""}`}
    >
      <span className="player-number">PLAYER {player === "X" ? "01" : "02"}</span>
      <motion.div
        className="character-portrait"
        animate={{ y: active ? -5 : 0, rotate: active ? (player === "X" ? -7 : 7) : 0 }}
        transition={{ type: "spring", stiffness: 180, damping: 14 }}
      >
        <div className="portrait-orbit" />
        <PlayerMark player={player} />
      </motion.div>
      <div className="player-identity">
        <h2>{details.name}</h2>
        <p>{details.title}</p>
      </div>
      <div className="player-score">
        <strong>{ready ? score : "-"}</strong>
        <span>{score === 1 ? "win" : "wins"}</span>
      </div>
      <span className={`player-state ${active || winner ? "highlight" : ""}`}>
        {winner ? <Trophy size={13} aria-hidden="true" /> : <span className="state-dot" />}
        {winner ? "Round winner" : active ? "Your turn" : "Taking a breather"}
      </span>
    </section>
  );
}
