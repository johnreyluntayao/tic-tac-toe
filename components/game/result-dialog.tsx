"use client";

import { ArrowRight, Equal, Modal, PlayerMark, Celebration } from "@/lib/imports";
import type { Player } from "@/lib/game";
import { PLAYERS } from "@/lib/players";

export function ResultDialog({
  winner,
  nextStarter,
  celebrate,
  onNext,
  onClose,
}: {
  winner: Player | null;
  nextStarter: Player;
  celebrate: boolean;
  onNext: () => void;
  onClose: () => void;
}) {
  return (
    <Modal
      title={winner ? `${PLAYERS[winner].name} takes the round.` : "Evenly matched."}
      className={`result-dialog ${winner ? PLAYERS[winner].theme : "draw"}-result`}
      onClose={onClose}
      delay={celebrate ? 600 : 0}
      overlay={winner && celebrate ? <Celebration /> : undefined}
    >
      <div className="result-art" aria-hidden="true">
        {winner ? (
          <PlayerMark player={winner} />
        ) : (
          <>
            <PlayerMark player="X" />
            <Equal size={24} />
            <PlayerMark player="O" />
          </>
        )}
      </div>
      <p className="result-kicker">
        {winner ? "THREE IN A ROW. BEAUTIFULLY DONE." : "NINE SQUARES. TWO WORTHY RIVALS."}
      </p>
      <p className="modal-description">
        {winner
          ? "A small victory. A very good reason for a rematch."
          : "It's a draw! Neither side is giving an inch."}
      </p>
      <button autoFocus className="primary-button rematch-button" onClick={onNext}>
        Play again <ArrowRight size={18} aria-hidden="true" />
      </button>
      <p className="next-player">{PLAYERS[nextStarter].name} gets the first move.</p>
      <button className="quiet-button" onClick={onClose}>
        Take a look at the board
      </button>
    </Modal>
  );
}
