// The persistent world. Mounts once at __root and never unmounts.
// Reads atmosphere tokens each frame via ParticleField.

import { useEffect, useRef } from "react";

import { ParticleField } from "@/lib/particles";
import { prefersReducedMotion } from "@/lib/motion";
import { useWorld } from "@/lib/world-state";

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

  return (
    <>
      <canvas
        ref={canvasRef}
        aria-hidden
        className="pointer-events-none fixed inset-0 h-full w-full"
        style={{
          zIndex: 0,
          opacity: beat < 1 ? 0 : 1,
          transition: "opacity 2.4s var(--ease-organic)",
          mixBlendMode: "screen",
        }}
      />
      {/* Dream bloom overlay — reacts to --dream-bloom */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0"
        style={{
          zIndex: 1,
          background:
            "radial-gradient(60% 50% at 50% 50%, color-mix(in oklab, oklch(0.68 0.16 315) calc(var(--dream-bloom) * 45%), transparent), transparent 70%)",
          opacity: "var(--dream-bloom)",
          transition: "opacity var(--dur-drift) var(--ease-organic)",
          mixBlendMode: "screen",
        }}
      />
      {/* Vignette — a permanent slight darkening at the edges */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0"
        style={{
          zIndex: 2,
          background:
            "radial-gradient(120% 90% at 50% 50%, transparent 55%, oklch(0.06 0.015 265 / 0.85) 100%)",
        }}
      />
    </>
  );
}
