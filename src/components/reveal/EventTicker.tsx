import { AnimatePresence, motion } from "framer-motion";
import { useRouterState } from "@tanstack/react-router";

import { useWorld } from "@/lib/world-state";

export function EventTicker() {
  const { currentEvent, beat } = useWorld();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  // Only appear on the Field. District surfaces carry their own ground signal.
  if (pathname !== "/" || beat < 6) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-24 z-20 flex justify-center px-6">
      <AnimatePresence mode="wait">
        <motion.p
          key={currentEvent.id}
          initial={{ opacity: 0, y: 6, filter: "blur(6px)" }}
          animate={{ opacity: 0.65, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -4, filter: "blur(6px)" }}
          transition={{ duration: 1.2, ease: [0.22, 0.61, 0.36, 1] }}
          className="font-mono-fable text-[10px] uppercase tracking-[0.32em]"
          style={{ color: "var(--parchment-dim)" }}
        >
          <span aria-hidden className="mr-2 opacity-50">
            {"◦"}
          </span>
          {currentEvent.text}
          <span aria-hidden className="ml-3 opacity-30">
            · day {String(currentEvent.day).padStart(3, "0")}
          </span>
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
