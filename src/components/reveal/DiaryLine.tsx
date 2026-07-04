import { AnimatePresence, motion } from "framer-motion";
import { useRouterState } from "@tanstack/react-router";

import { CITIZENS } from "@/data/citizens";
import { useWorld } from "@/lib/world-state";
import { surfaceReveal } from "@/lib/motion";

export function DiaryLine() {
  const { currentDiary, beat } = useWorld();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const citizen = CITIZENS.find((c) => c.id === currentDiary.citizenId);

  // Only appear on the Field. On district routes the Veil provides the surface.
  if (pathname !== "/" || beat < 6) return null;

  return (
    <div className="pointer-events-none fixed left-6 right-6 top-1/2 z-20 mx-auto max-w-2xl -translate-y-16 sm:left-16 sm:right-auto sm:max-w-lg sm:translate-y-0">
      <AnimatePresence mode="wait">
        <motion.figure
          key={currentDiary.id}
          variants={surfaceReveal}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="space-y-3"
        >
          <blockquote
            className="font-display text-2xl leading-[1.35] tracking-[-0.005em] sm:text-[28px]"
            style={{ color: "var(--parchment)" }}
          >
            <span aria-hidden style={{ color: "var(--ember)" }}>
              "
            </span>
            {currentDiary.text}
            <span aria-hidden style={{ color: "var(--ember)" }}>
              "
            </span>
          </blockquote>
          <figcaption
            className="font-mono-fable text-[10px] uppercase tracking-[0.28em]"
            style={{ color: "var(--parchment-dim)" }}
          >
            — {citizen?.name ?? currentDiary.citizenId} · day {currentDiary.day} ·{" "}
            cycle {currentDiary.cycle}
          </figcaption>
        </motion.figure>
      </AnimatePresence>
    </div>
  );
}
