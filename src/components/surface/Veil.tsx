// A translucent "veil" surface. Never a hard-edged modal — the world remains
// faintly visible behind it. Used by every district that surfaces content.

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
        // A subtle veil that blends into the world — never opaque.
        background:
          "linear-gradient(180deg, color-mix(in oklab, var(--ink) calc(var(--veil-opacity) * 100%), transparent) 0%, color-mix(in oklab, var(--ink) calc(var(--veil-opacity) * 55%), transparent) 100%)",
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
