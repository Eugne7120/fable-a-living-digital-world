// A translucent "veil" surface. The world remains faintly visible behind.
// The interface feels embedded in the world, not floating above it.
//
// Gradient design:
// - Dense at top (the content emerges from the field)
// - Thinner at the center-bottom (the world breathes through)
// - A horizontal feathering suggests the world extends beyond the frame

import { motion } from "framer-motion";
import type { ReactNode } from "react";

import { surfaceReveal } from "@/lib/motion";

interface VeilProps {
  children: ReactNode;
  align?: "center" | "start";
}

export function Veil({ children, align = "start" }: VeilProps) {
  return (
    <div
      className="relative z-20 flex min-h-svh w-full flex-col px-6 pb-32 pt-24 sm:px-14 sm:pb-40 sm:pt-28"
      style={{
        // Multi-stop gradient: the content field emerges from the living world
        // rather than sitting on top of it. Horizontal fade suggests infinity.
        background: [
          // Vertical: strong at top where text lives, lighter below
          `linear-gradient(180deg,
            color-mix(in oklab, var(--ink) calc(var(--veil-opacity) * 95%), transparent) 0%,
            color-mix(in oklab, var(--ink) calc(var(--veil-opacity) * 80%), transparent) 35%,
            color-mix(in oklab, var(--ink) calc(var(--veil-opacity) * 48%), transparent) 70%,
            color-mix(in oklab, var(--ink) calc(var(--veil-opacity) * 30%), transparent) 100%)`,
          // Horizontal: fade out at left and right edges so the world bleeds through
          `linear-gradient(90deg,
            color-mix(in oklab, var(--ink) calc(var(--veil-opacity) * 28%), transparent) 0%,
            transparent 18%,
            transparent 82%,
            color-mix(in oklab, var(--ink) calc(var(--veil-opacity) * 22%), transparent) 100%)`,
        ].join(", "),
        justifyContent: align === "center" ? "center" : "flex-start",
      }}
    >
      <motion.div
        variants={surfaceReveal}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="mx-auto w-full max-w-3xl"
      >
        {children}
      </motion.div>
    </div>
  );
}
