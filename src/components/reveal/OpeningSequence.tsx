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
    if (beat >= 6) return;
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
            exit={{ opacity: 0, scale: 0.96, filter: "blur(8px)" }}
            transition={{ duration: 2.0, ease: [0.22, 0.61, 0.36, 1] }}
          >
            {/* Outer halo — slower, larger, more transparent */}
            <div
              aria-hidden
              className="absolute rounded-full"
              style={{
                width: "80px",
                height: "80px",
                background: "radial-gradient(circle, color-mix(in oklab, var(--ember) 18%, transparent) 0%, transparent 70%)",
                animation: beat >= 1 ? "fable-breath 6s 0.3s cubic-bezier(0.4, 0, 0.2, 1) infinite" : "none",
              }}
            />
            {/* Inner halo */}
            <div
              aria-hidden
              className="absolute rounded-full"
              style={{
                width: "32px",
                height: "32px",
                background: "radial-gradient(circle, color-mix(in oklab, var(--ember) 35%, transparent) 0%, transparent 70%)",
                animation: beat >= 1 ? "fable-breath 4.8s cubic-bezier(0.4, 0, 0.2, 1) infinite" : "none",
              }}
            />
            {/* Core */}
            <div
              aria-hidden
              className="relative h-2 w-2 rounded-full"
              style={{
                background: "var(--ember)",
                boxShadow:
                  "0 0 20px color-mix(in oklab, var(--ember) 70%, transparent), 0 0 60px color-mix(in oklab, var(--ember) 35%, transparent)",
                animation: beat >= 1 ? "fable-breath 4.2s 0.15s cubic-bezier(0.4, 0, 0.2, 1) infinite" : "none",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ignorable skip affordance in the corner for returning visitors */}
      {beat < 6 && beat >= 2 && (
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
