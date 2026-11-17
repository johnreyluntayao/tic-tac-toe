"use client";

import { useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import { useReducedMotion } from "framer-motion";

export function Celebration() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useReducedMotion();
  useEffect(() => {
    if (!canvas.current || reducedMotion) return;
    const launch = confetti.create(canvas.current, { resize: true, useWorker: false });
    const timers = [650, 1000, 1350].map((delay) =>
      window.setTimeout(() => {
        const options = {
          particleCount: 65,
          spread: 75,
          startVelocity: 48,
          gravity: 0.85,
          ticks: 250,
          colors: ["#c5b6ff", "#ffc889", "#ecdcff", "#7cc7fd", "#fff2db"],
          disableForReducedMotion: true,
        };
        void launch({ ...options, angle: 55, origin: { x: 0, y: 0.65 } });
        void launch({ ...options, angle: 125, origin: { x: 1, y: 0.65 } });
      }, delay),
    );
    return () => {
      timers.forEach(window.clearTimeout);
      launch.reset();
    };
  }, [reducedMotion]);
  return <canvas ref={canvas} className="celebration-canvas" aria-hidden="true" />;
}
