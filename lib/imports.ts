// Public UI entry point for pages. Components exported here use direct internal
// imports so this module never becomes part of a circular dependency.
export { Board } from "@/components/game/board";
export { PlayerMark } from "@/components/game/player-mark";
export { Scoreboard } from "@/components/game/scoreboard";
export { PlayerCard } from "@/components/game/player-card";
export { ResultDialog } from "@/components/game/result-dialog";
export { HelpDialog } from "@/components/game/help-dialog";
export { Celebration } from "@/components/game/celebration";
export { TicTacToe } from "@/components/game/tic-tac-toe";
export { ConfirmDialog } from "@/components/ui/confirm-dialog";
export { GlassPanel } from "@/components/ui/glass-panel";
export { Modal } from "@/components/ui/modal";

export {
  AlertCircle,
  ArrowRight,
  Check,
  CircleHelp,
  Equal,
  Flag,
  Keyboard,
  MousePointer2,
  RefreshCw,
  RotateCcw,
  ShieldCheck,
  Trophy,
  Users,
  X,
} from "lucide-react";
