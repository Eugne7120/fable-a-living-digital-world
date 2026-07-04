// Interpolates atmosphere tokens on documentElement whenever the route
// changes, so the persistent WorldCanvas drifts between district states.
//
// Navigation feels like traveling through the world, not switching pages:
// the veil briefly deepens as you depart (a passage through the membrane),
// then settles into the arrival district's atmosphere.

import { useEffect, useRef } from "react";
import { useRouterState } from "@tanstack/react-router";

import { districtForPath } from "@/data/districts";
import {
  ATMOSPHERE,
  REVEAL_START,
  applyAtmosphere,
  type Atmosphere,
} from "@/lib/atmosphere";
import { useWorld } from "@/lib/world-state";
import { prefersReducedMotion } from "@/lib/motion";

function easeOut(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

// Slight spring overshoot for camera values — arrival feels organic, not mechanical
function easeSpring(t: number): number {
  return 1 - Math.pow(1 - t, 3) + Math.sin(t * Math.PI) * 0.04 * (1 - t);
}

// Veil rises above target mid-transit (the "passage" sensation), then settles
function passageVeil(from: number, to: number, t: number): number {
  const peak = Math.min(0.84, Math.max(from, to) + 0.20);
  if (t < 0.38) {
    return from + (peak - from) * easeOut(t / 0.38);
  }
  return peak + (to - peak) * easeOut((t - 0.38) / 0.62);
}

export function TransitionDirector() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { beat } = useWorld();
  const currentRef = useRef<Atmosphere>({ ...REVEAL_START });
  const rafRef = useRef(0);

  useEffect(() => {
    applyAtmosphere(document.documentElement, currentRef.current);
  }, []);

  useEffect(() => {
    let target: Atmosphere;
    if (beat < 3) {
      target = REVEAL_START;
    } else if (beat === 3) {
      target = {
        ...ATMOSPHERE.field,
        brightness: 0.68,
        density: 0.52,
        cameraScale: 0.88,
      };
    } else {
      target = ATMOSPHERE[districtForPath(pathname).id];
    }

    const from = { ...currentRef.current };
    const rm = prefersReducedMotion();
    const duration = rm ? 150 : 2400;
    const start = performance.now();

    cancelAnimationFrame(rafRef.current);

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const te = easeOut(t);
      const ts = easeSpring(t);
      const lerp = (a: number, b: number, x: number) => a + (b - a) * x;

      const cur: Atmosphere = {
        density:     lerp(from.density,     target.density,     te),
        hueShift:    lerp(from.hueShift,    target.hueShift,    te),
        brightness:  lerp(from.brightness,  target.brightness,  te),
        cameraScale: lerp(from.cameraScale, target.cameraScale, ts),
        shiftX:      lerp(from.shiftX,      target.shiftX,      ts),
        shiftY:      lerp(from.shiftY,      target.shiftY,      ts),
        veil: rm
          ? lerp(from.veil, target.veil, te)
          : passageVeil(from.veil, target.veil, t),
        bloom: lerp(from.bloom, target.bloom, te),
        bed: t < 0.5 ? from.bed : target.bed,
      };

      currentRef.current = cur;
      applyAtmosphere(document.documentElement, cur);
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [pathname, beat]);

  return null;
}
