import type { ReactNode } from "react";

import { Veil } from "./Veil";

interface RouteSurfaceProps {
  eyebrow: string;
  title: string;
  children?: ReactNode;
}

// Standard shape of a district surface. Editorial, unhurried.
export function RouteSurface({ eyebrow, title, children }: RouteSurfaceProps) {
  return (
    <Veil>
      <div className="space-y-14">
        <header className="space-y-4">
          <p
            className="font-mono-fable text-[10px] uppercase tracking-[0.32em]"
            style={{ color: "var(--ember)" }}
          >
            {eyebrow}
          </p>
          <h1
            className="font-display text-4xl leading-[1.05] tracking-[-0.01em] sm:text-6xl"
            style={{ color: "var(--parchment)" }}
          >
            {title}
          </h1>
        </header>
        {children ? (
          <div
            className="space-y-8 font-display text-lg leading-[1.55] sm:text-xl"
            style={{ color: "var(--parchment-dim)" }}
          >
            {children}
          </div>
        ) : null}
      </div>
    </Veil>
  );
}
