import { Circle, X } from "lucide-react";
import type { Player } from "@/lib/game";

export function PlayerMark({ player, className = "" }: { player: Player; className?: string }) {
  const Icon = player === "X" ? X : Circle;
  return <Icon aria-hidden="true" strokeWidth={2.5} className={`player-mark mark-${player.toLowerCase()} ${className}`} />;
}
