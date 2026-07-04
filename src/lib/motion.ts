// Shared motion vocabulary. Every animation in FABLE should draw from here —
// consistency is what makes motion feel like a language rather than decoration.

import type { Variants, Transition } from "framer-motion";

export const easing = {
  organic: [0.22, 0.61, 0.36, 1] as [number, number, number, number],
  breath: [0.4, 0, 0.2, 1] as [number, number, number, number],
};

export const durations = {
  instant: 0.12,
  calm: 0.6,
  drift: 1.4,
  ceremony: 2.4,
};

export const t: Record<string, Transition> = {
  calm: { duration: durations.calm, ease: easing.organic },
  drift: { duration: durations.drift, ease: easing.organic },
  ceremony: { duration: durations.ceremony, ease: easing.organic },
};

export const surfaceReveal: Variants = {
  hidden: { opacity: 0, y: 16, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: durations.drift, ease: easing.organic },
  },
  exit: {
    opacity: 0,
    y: -8,
    filter: "blur(10px)",
    transition: { duration: durations.calm, ease: easing.organic },
  },
};

export const softFade: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: durations.drift, ease: easing.organic } },
  exit: { opacity: 0, transition: { duration: durations.calm, ease: easing.organic } },
};

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
}
