// Interpolates atmosphere tokens on documentElement whenever the route
// changes, so the persistent WorldCanvas drifts between district states.
//
// This is the single place that decides "what does the world look like right
// now?" — every other consumer reads the CSS variables it writes.

import { useEffect, useRef } from "react";
import { useRouterState } from "@tanstack/react-router";

import { districtForPath } from "@/data/districts";
import {
  ATMOSPHERE,
  REVEAL_START,
  applyAtmosphere,
  lerpAtmosphere,
  type Atmosphere,
} from "@/lib/atmosphere";
import { useWorld } from "@/lib/world-state";
import { easing, prefersReducedMotion } from "@/lib/motion";

function easeOrganic(t: number) {
  // Approximate the cubic-bezier(0.22, 0.61, 0.36, 1)
  const [, , x2, y2] = easing.organic;
  void x2; void y2;
  return 1 - Math.pow(1 - t, 3);
}

export function TransitionDirector() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { beat } = useWorld();
  const currentRef = useRef<Atmosphere>({ ...REVEAL_START });
  const rafRef = useRef(0);

  // Apply reveal-start atmosphere immediately on first mount so we never
  // flash the default field state before beat 3.
  useEffect(() => {
    applyAtmosphere(document.documentElement, currentRef.current);
  }, []);

  useEffect(() => {
    // During the opening reveal (beats 0-2), the world stays hushed.
    // From beat 3 onward, we drift toward the current district atmosphere.
    let target: Atmosphere;
    if (beat < 3) {
      target = REVEAL_START;
    } else if (beat === 3) {
      // Halfway bloom — particles resolving out of the dark.
      const field = ATMOSPHERE.field;
      target = {
        ...field,
        brightness: 0.7,
        density: 0.55,
        cameraScale: 0.9,
      };
    } else {
      target = ATMOSPHERE[districtForPath(pathname).id];
    }

    const from = { ...currentRef.current };
    const duration = prefersReducedMotion() ? 200 : 2200;
    const start = performance.now();

    cancelAnimationFrame(rafRef.current);
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = easeOrganic(t);
      const cur = lerpAtmosphere(from, target, eased);
      currentRef.current = cur;
      applyAtmosphere(document.documentElement, cur);
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(rafRef.current);
  }, [pathname, beat]);

  return null;
}
