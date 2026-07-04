// "The Birth of Civilization" — the opening cinematic. Not a loading screen:
// the visitor should feel they witnessed a world come into being.
//
// The canvas particle field (see ParticleField.setBirthPhase) handles the
// universe-awakens / gravitational-collapse / supernova-burst particle work
// once it becomes visible at beat 2. This component owns everything the
// canvas can't: the absolute black void, the single first-signal point of
// light, the supernova's white flash, and the skip affordance.
//
// Beats: 0 void · 1 first signal · 2 universe awakens · 3 gravitational
// collapse · 4 supernova · 5 birth of world · 6+ landing reveal.

import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

import { useWorld } from "@/lib/world-state";

export function OpeningSequence() {
  const { beat, advanceBeat, skipReveal } = useWorld();

  // Any interaction gently nudges the reveal forward. Always skippable.
  useEffect(() => {
    if (beat >= 8) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") skipReveal();
      else if (e.key === " " || e.key === "Enter") advanceBeat();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [beat, advanceBeat, skipReveal]);

  // Core intensity climbs through signal → awaken → collapse, so the point
  // of light reads as the same object that later becomes the supernova.
  const coreIntensity = Math.min(1, Math.max(0, beat - 1) / 2);

  return (
    <>
      {/* Beat 0: absolute nothing — a fade-out veil that lifts as beat rises */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-10"
        style={{ backgroundColor: "var(--ink)" }}
        initial={{ opacity: 1 }}
        animate={{ opacity: beat < 1 ? 1 : beat < 2 ? 0.65 : 0 }}
        transition={{ duration: 1.1, ease: [0.22, 0.61, 0.36, 1] }}
      />

      {/* Beats 1-3: the first signal — a single point of light that breathes,
          then brightens and swells as the universe awakens and collapses
          toward it. */}
      <AnimatePresence>
        {beat >= 1 && beat < 4 && (
          <motion.div
            key="first-signal"
            className="pointer-events-none fixed inset-0 z-15 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.4, filter: "blur(4px)" }}
            transition={{ duration: 0.5, ease: [0.22, 0.61, 0.36, 1] }}
          >
            {/* Outer halo — slower, larger, more transparent */}
            <div
              aria-hidden
              className="absolute rounded-full"
              style={{
                width: `${80 + coreIntensity * 140}px`,
                height: `${80 + coreIntensity * 140}px`,
                background:
                  "radial-gradient(circle, color-mix(in oklab, var(--ember) 18%, transparent) 0%, transparent 70%)",
                animation: "fable-breath 6s 0.3s cubic-bezier(0.4, 0, 0.2, 1) infinite",
                transition: "width 1.6s ease-out, height 1.6s ease-out",
              }}
            />
            {/* Inner halo */}
            <div
              aria-hidden
              className="absolute rounded-full"
              style={{
                width: `${32 + coreIntensity * 60}px`,
                height: `${32 + coreIntensity * 60}px`,
                background:
                  "radial-gradient(circle, color-mix(in oklab, var(--ember) 35%, transparent) 0%, transparent 70%)",
                animation: "fable-breath 4.8s cubic-bezier(0.4, 0, 0.2, 1) infinite",
                transition: "width 1.6s ease-out, height 1.6s ease-out",
              }}
            />
            {/* Core — brightens as the collapse accelerates toward supernova */}
            <div
              aria-hidden
              className="relative rounded-full"
              style={{
                width: `${8 + coreIntensity * 10}px`,
                height: `${8 + coreIntensity * 10}px`,
                background: "var(--ember)",
                boxShadow: `0 0 ${20 + coreIntensity * 40}px color-mix(in oklab, var(--ember) 70%, transparent), 0 0 ${60 + coreIntensity * 80}px color-mix(in oklab, var(--ember) 35%, transparent)`,
                animation: "fable-breath 4.2s 0.15s cubic-bezier(0.4, 0, 0.2, 1) infinite",
                transition: "width 1.6s ease-out, height 1.6s ease-out, box-shadow 1.6s ease-out",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Beat 4: supernova — a brief, pure-white flash under 200ms. No fire,
          no explosion effects; the burst itself lives on the canvas. */}
      <AnimatePresence>
        {beat === 4 && (
          <motion.div
            key="supernova-flash"
            aria-hidden
            className="pointer-events-none fixed inset-0 z-25"
            style={{ backgroundColor: "#fff" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.32, times: [0, 0.35, 1], ease: "easeOut" }}
          />
        )}
      </AnimatePresence>

      {/* Skip affordance — always available once the sequence has begun */}
      {beat < 8 && beat >= 1 && (
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
