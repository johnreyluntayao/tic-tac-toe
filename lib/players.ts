import type { Player } from "./game";

// Internal player IDs stay stable so existing scores survive the visual redesign.
export const PLAYERS: Record<
  Player,
  { name: string; title: string; theme: string; color: string }
> = {
  X: { name: "Moon", title: "A little night magic", theme: "moon", color: "#c5b6ff" },
  O: { name: "Bloom", title: "A little sunshine", theme: "bloom", color: "#ffc889" },
};
