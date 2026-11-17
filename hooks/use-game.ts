"use client";

import { useCallback, useEffect, useReducer, useRef } from "react";
import {
  gameReducer,
  getResult,
  initialState,
  restoreGame,
  serializeGame,
  type GameAction,
} from "@/lib/game";

const GAME_KEY = "johnrey-tic-tac-toe:game:v1";
const LEGACY_KEY = "johnrey-tic-tac-toe:scores:v1";

export function useGame() {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const [storageAvailable, reportStorage] = useReducer((_: boolean, next: boolean) => next, true);
  const [hasUnsavedChanges, reportUnsavedChanges] = useReducer(
    (_: boolean, next: boolean) => next,
    false,
  );
  const current = useRef(initialState);

  useEffect(() => {
    let restored = restoreGame(null);
    try {
      restored = restoreGame(localStorage.getItem(GAME_KEY), localStorage.getItem(LEGACY_KEY));
      localStorage.setItem(GAME_KEY, serializeGame(restored));
    } catch {
      reportStorage(false);
    }
    current.current = restored;
    dispatch({ type: "hydrate", restored, scores: restored.scores });
  }, []);

  // Save during the action, not on a later effect: even an immediate refresh
  // after a move retains the new board. Reducer functions stay side-effect free.
  const send = useCallback((action: GameAction) => {
    const next = gameReducer(current.current, action);
    if (next === current.current) return null;
    current.current = next;
    try {
      localStorage.setItem(GAME_KEY, serializeGame(next));
      reportStorage(true);
      reportUnsavedChanges(false);
    } catch {
      reportStorage(false);
      reportUnsavedChanges(true);
    }
    dispatch(action);
    return next;
  }, []);

  useEffect(() => {
    if (!hasUnsavedChanges) return;
    function warnBeforeLeaving(event: BeforeUnloadEvent) {
      event.preventDefault();
      event.returnValue = "";
    }
    window.addEventListener("beforeunload", warnBeforeLeaving);
    return () => window.removeEventListener("beforeunload", warnBeforeLeaving);
  }, [hasUnsavedChanges]);

  return { state, send, storageAvailable, result: getResult(state.board) };
}
