// The persistent world. Mounts once at __root and never unmounts.
// Reads atmosphere tokens each frame via ParticleField.

import { useEffect, useRef } from "react";

import { ParticleField, type BirthPhase } from "@/lib/particles";
import { prefersReducedMotion } from "@/lib/motion";
import { useWorld } from "@/lib/world-state";

// Beat → birth phase, driving "The Birth of Civilization" cinematic.
// Beats 6+ (identity onward) are all part of the settled, living world.
function birthPhaseForBeat(beat: number): BirthPhase {
  if (beat <= 0) return "void";
  if (beat === 1) return "signal";
  if (beat === 2) return "awaken";
  if (beat === 3) return "collapse";
  if (beat === 4) return "supernova";
  return "settle";
}

export function WorldCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fieldRef = useRef<ParticleField | null>(null);
  const { beat } = useWorld();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const field = new ParticleField(canvas, {
      reducedMotion: prefersReducedMotion(),
    });
    fieldRef.current = field;
    field.start();

    const onResize = () => field.resize();
    window.addEventListener("resize", onResize, { passive: true });

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      field.setCursor(e.clientX - rect.left, e.clientY - rect.top, true);
    };
    const onLeave = () => field.setCursor(-9999, -9999, false);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave, { passive: true });

    const onVis = () => {
      if (document.hidden) field.stop();
      else field.start();
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVis);
      field.dispose();
      fieldRef.current = null;
    };
  }, []);

  // Drive "The Birth of Civilization" — the field itself is the cinematic
  // engine, so it just needs to know which phase the reveal is in.
  useEffect(() => {
    fieldRef.current?.setBirthPhase(birthPhaseForBeat(beat));
  }, [beat]);

  return (
    <>
      <canvas
        ref={canvasRef}
        aria-hidden
        className="pointer-events-none fixed inset-0 h-full w-full"
        style={{
          zIndex: 0,
          // The universe awakens on the canvas itself (beat 2) — the void
          // and the first signal (beats 0-1) are handled by OpeningSequence.
          opacity: beat < 2 ? 0 : 1,
          transition: "opacity 1.4s var(--ease-organic)",
          mixBlendMode: "screen",
        }}
      />

      {/* Dream bloom — violet-rose radial when in dream district */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0"
        style={{
          zIndex: 1,
          background: [
            "radial-gradient(55% 45% at 50% 40%, color-mix(in oklab, oklch(0.66 0.18 315) calc(var(--dream-bloom) * 52%), transparent), transparent 68%)",
            "radial-gradient(40% 35% at 30% 65%, color-mix(in oklab, oklch(0.60 0.16 280) calc(var(--dream-bloom) * 30%), transparent), transparent 60%)",
          ].join(", "),
          opacity: "var(--dream-bloom)",
          transition: "opacity var(--dur-drift) var(--ease-organic)",
          mixBlendMode: "screen",
        }}
      />

      {/* Atmospheric haze — very faint warm center glow, always present */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0"
        style={{
          zIndex: 1,
          background:
            "radial-gradient(70% 55% at 50% 50%, oklch(0.22 0.04 45 / 0.18) 0%, transparent 70%)",
          mixBlendMode: "screen",
        }}
      />

      {/* Vignette — darkens edges so the world recedes into depth */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0"
        style={{
          zIndex: 2,
          background: [
            "radial-gradient(110% 85% at 50% 50%, transparent 50%, oklch(0.05 0.012 265 / 0.92) 100%)",
          ].join(", "),
        }}
      />

      {/* Film grain — ultra-subtle texture that breaks up the flatness */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0"
        style={{
          zIndex: 2,
          opacity: 0.028,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize: "256px 256px",
          mixBlendMode: "overlay",
        }}
      />
    </>
  );
}
