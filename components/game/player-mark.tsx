import { useId } from "react";
import type { Player } from "@/lib/game";

/** Original vector characters: readable at cell size, with no image downloads. */
export function PlayerMark({ player, className = "" }: { player: Player; className?: string }) {
  const id = useId().replace(/:/g, "");
  const moon = player === "X";
  return (
    <svg
      viewBox="0 0 120 120"
      aria-hidden="true"
      focusable="false"
      className={`player-mark ${moon ? "mark-moon" : "mark-bloom"} ${className}`}
    >
      <defs>
        <linearGradient id={`${id}-fill`} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor={moon ? "#f0e9ff" : "#ffe9b8"} />
          <stop offset=".5" stopColor={moon ? "#c6afff" : "#ffc477"} />
          <stop offset="1" stopColor={moon ? "#8b70d7" : "#ee9065"} />
        </linearGradient>
      </defs>
      {moon ? (
        <>
          <path
            d="M80 15C48-1 15 21 15 57c0 29 22 50 49 50 21 0 37-11 43-28-20 7-42-1-49-18-8-18 0-38 22-46Z"
            fill={`url(#${id}-fill)`}
            stroke="#eee3ff"
            strokeWidth="1.5"
          />
          <path d="M86 21l3 9 9 3-9 3-3 9-3-9-9-3 9-3Z" fill="#e7dcff" />
          <path d="M103 48l2 5 5 2-5 2-2 5-2-5-5-2 5-2Z" fill="#bea7fa" />
          <ellipse cx="37" cy="66" rx="3" ry="4.5" fill="#473763" />
          <ellipse cx="57" cy="77" rx="3" ry="4.5" fill="#473763" />
          <path
            d="M38 81q4 8 11 5"
            fill="none"
            stroke="#62437e"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <ellipse cx="27" cy="76" rx="6" ry="3.5" fill="#f8c4df" opacity=".6" />
        </>
      ) : (
        <>
          <g fill={`url(#${id}-fill)`} stroke="#ffdfad" strokeWidth="1.2">
            {[0, 45, 90, 135].map((angle) => (
              <ellipse
                key={angle}
                cx="60"
                cy="60"
                rx="24"
                ry="49"
                transform={`rotate(${angle} 60 60)`}
              />
            ))}
          </g>
          <circle cx="60" cy="60" r="30" fill="#ffe6ad" />
          <ellipse cx="49" cy="57" rx="3" ry="4.5" fill="#775033" />
          <ellipse cx="71" cy="57" rx="3" ry="4.5" fill="#775033" />
          <path
            d="M54 68q6 7 12 0"
            fill="none"
            stroke="#93613a"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <ellipse cx="39" cy="66" rx="6" ry="3.5" fill="#ef9d80" opacity=".6" />
          <ellipse cx="81" cy="66" rx="6" ry="3.5" fill="#ef9d80" opacity=".6" />
        </>
      )}
    </svg>
  );
}
