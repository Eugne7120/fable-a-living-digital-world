// The opening reveal. Only meaningful on the Field (/) route on first arrival.
// Provides:
//   • Beat 1 breath — single point of warm light
//   • Beat 2 bloom cue (particles are handled by the canvas)
//   • A skip affordance for returning visitors (any interaction advances)

import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

import { useWorld } from "@/lib/world-state";

export function OpeningSequence() {
  const { beat, advanceBeat, skipReveal } = useWorld();

  // Any interaction gently nudges the reveal forward.
  useEffect(() => {
    if (beat >= 5) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") skipReveal();
      else if (e.key === " " || e.key === "Enter") advanceBeat();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [beat, advanceBeat, skipReveal]);

  return (
    <>
      {/* Beat 0: pure void — a fade-out veil that lifts as beat rises */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-10"
        style={{ backgroundColor: "var(--ink)" }}
        initial={{ opacity: 1 }}
        animate={{ opacity: beat < 1 ? 1 : beat < 3 ? 0.75 : 0 }}
        transition={{ duration: 2.2, ease: [0.22, 0.61, 0.36, 1] }}
      />
      {/* Beat 1 / 2: the single point of light — a breath */}
      <AnimatePresence>
        {beat < 3 && (
          <motion.div
            key="breath"
            className="pointer-events-none fixed inset-0 z-15 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: beat >= 1 ? 1 : 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.8, ease: [0.22, 0.61, 0.36, 1] }}
          >
            <div
              aria-hidden
              className="h-2 w-2 rounded-full"
              style={{
                background: "var(--ember)",
                boxShadow:
                  "0 0 24px color-mix(in oklab, var(--ember) 60%, transparent), 0 0 80px color-mix(in oklab, var(--ember) 30%, transparent)",
                animation: beat >= 1 ? "fable-breath 4.2s var(--ease-breath) infinite" : "none",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ignorable skip affordance in the corner for returning visitors */}
      {beat < 5 && beat >= 2 && (
        <button
          type="button"
          onClick={skipReveal}
          className="fixed bottom-5 left-5 z-40 font-mono-fable text-[10px] uppercase tracking-[0.28em] drift"
          style={{ color: "var(--parchment-dim)", opacity: 0.35 }}
          aria-label="Skip the opening"
        >
          skip
        </button>
      )}
    </>
  );
}
