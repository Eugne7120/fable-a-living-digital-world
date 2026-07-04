import { Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";

import { DISTRICTS, districtForPath } from "@/data/districts";
import { useWorld } from "@/lib/world-state";

export function DistrictNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const active = districtForPath(pathname);
  const { beat } = useWorld();
  const [hovered, setHovered] = useState<string | null>(null);
  const visible = beat >= 5;

  const currentHint = hovered
    ? DISTRICTS.find((d) => d.id === hovered)
    : active;

  return (
    <nav
      aria-label="Districts of the world"
      className="pointer-events-none fixed inset-x-0 bottom-6 z-30 flex flex-col items-center gap-3 ceremony"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(12px)",
      }}
    >
      <div
        className="font-mono-fable text-[10px] uppercase tracking-[0.32em] drift"
        style={{
          color: "var(--parchment-dim)",
          opacity: currentHint ? 0.7 : 0,
        }}
        aria-hidden
      >
        {currentHint?.hint ?? ""}
      </div>
      <ul className="pointer-events-auto flex items-center gap-6">
        {DISTRICTS.map((d) => {
          const isActive = d.id === active.id;
          const isHover = d.id === hovered;
          return (
            <li key={d.id}>
              <Link
                to={d.path}
                aria-label={d.name}
                aria-current={isActive ? "page" : undefined}
                onMouseEnter={() => setHovered(d.id)}
                onMouseLeave={() => setHovered((h) => (h === d.id ? null : h))}
                onFocus={() => setHovered(d.id)}
                onBlur={() => setHovered((h) => (h === d.id ? null : h))}
                className="drift flex h-8 w-8 items-center justify-center rounded-full text-lg leading-none outline-none"
                style={{
                  color: isActive
                    ? "var(--ember)"
                    : isHover
                      ? "var(--parchment)"
                      : "var(--parchment-dim)",
                  opacity: isActive ? 1 : isHover ? 0.95 : 0.55,
                  transform: isActive ? "scale(1.15)" : "scale(1)",
                  textShadow: isActive
                    ? "0 0 12px color-mix(in oklab, var(--ember) 60%, transparent)"
                    : "none",
                }}
              >
                <span aria-hidden>{d.mark}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
