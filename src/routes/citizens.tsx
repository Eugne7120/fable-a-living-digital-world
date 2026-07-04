import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { Veil } from "@/components/surface/Veil";
import { CITIZENS } from "@/data/citizens";
import type { Citizen } from "@/data/citizens";

export const Route = createFileRoute("/citizens")({
  head: () => ({
    meta: [
      { title: "Population — FABLE" },
      {
        name: "description",
        content:
          "The citizens of FABLE. Twelve so far. Each with a role, a history, a set of promises made and broken.",
      },
      { property: "og:title", content: "Population — FABLE" },
      {
        property: "og:description",
        content: "Those who are here. Twelve, so far.",
      },
    ],
  }),
  component: Population,
});

function CitizenCard({
  c,
  hovered,
  onEnter,
  onLeave,
}: {
  c: Citizen;
  hovered: boolean;
  onEnter: () => void;
  onLeave: () => void;
}) {
  const tiedCitizens = c.ties
    .map((id) => CITIZENS.find((x) => x.id === id))
    .filter(Boolean) as Citizen[];

  return (
    <li
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onFocus={onEnter}
      onBlur={onLeave}
      className="relative p-6"
      style={{
        backgroundColor: hovered
          ? `color-mix(in oklab, oklch(0.82 0.15 ${c.hue} / 0.07) 100%, color-mix(in oklab, var(--ink) 88%, transparent))`
          : "color-mix(in oklab, var(--ink) 88%, transparent)",
        borderLeft: `2px solid ${hovered
          ? `oklch(0.82 0.15 ${c.hue} / 0.5)`
          : "transparent"
        }`,
        transition:
          "background-color 1s cubic-bezier(0.22,0.61,0.36,1), border-color 0.7s cubic-bezier(0.22,0.61,0.36,1)",
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1 flex-1 min-w-0">
          <h2
            className="font-display text-2xl leading-none"
            style={{ color: "var(--parchment)" }}
          >
            {c.name}
          </h2>
          <p
            className="font-mono-fable text-[10px] uppercase tracking-[0.28em]"
            style={{
              color: "var(--parchment-dim)",
              opacity: hovered ? 0.7 : 0.42,
              transition: "opacity 0.7s cubic-bezier(0.22,0.61,0.36,1)",
            }}
          >
            {c.role} · born day {c.born}
          </p>
        </div>

        {/* Presence dot — pulses when hovered */}
        <span
          aria-hidden
          className="inline-block rounded-full shrink-0 mt-0.5"
          style={{
            width: hovered ? "10px" : "7px",
            height: hovered ? "10px" : "7px",
            background: `oklch(0.82 0.15 ${c.hue})`,
            boxShadow: hovered
              ? `0 0 10px oklch(0.82 0.15 ${c.hue} / 0.9), 0 0 28px oklch(0.82 0.15 ${c.hue} / 0.45)`
              : `0 0 7px oklch(0.82 0.15 ${c.hue} / 0.38)`,
            animation: hovered
              ? `fable-pulse-glow 3s cubic-bezier(0.4,0,0.2,1) infinite`
              : "none",
            transition: "width 0.6s cubic-bezier(0.22,0.61,0.36,1), height 0.6s cubic-bezier(0.22,0.61,0.36,1), box-shadow 0.8s cubic-bezier(0.22,0.61,0.36,1)",
          }}
        />
      </div>

      <p
        className="mt-4 font-display text-base leading-[1.58]"
        style={{
          color: hovered ? "var(--parchment)" : "var(--parchment-dim)",
          transition: "color 0.8s cubic-bezier(0.22,0.61,0.36,1)",
        }}
      >
        {c.brief}
      </p>

      {tiedCitizens.length > 0 && (
        <div
          className="mt-5 flex flex-wrap gap-3"
          style={{
            opacity: hovered ? 1 : 0.3,
            transform: hovered ? "translateY(0)" : "translateY(4px)",
            transition:
              "opacity 0.8s cubic-bezier(0.22,0.61,0.36,1), transform 0.8s cubic-bezier(0.22,0.61,0.36,1)",
          }}
        >
          {tiedCitizens.map((tied) => (
            <span
              key={tied.id}
              className="flex items-center gap-1.5 font-mono-fable text-[10px] uppercase tracking-[0.24em]"
              style={{ color: "var(--parchment-dim)" }}
            >
              <span
                aria-hidden
                className="inline-block h-1.5 w-1.5 rounded-full"
                style={{
                  background: `oklch(0.78 0.12 ${tied.hue})`,
                  boxShadow: hovered
                    ? `0 0 6px oklch(0.78 0.12 ${tied.hue} / 0.8)`
                    : "none",
                  transition: "box-shadow 0.6s ease",
                }}
              />
              {tied.name}
            </span>
          ))}
        </div>
      )}
    </li>
  );
}

function Population() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <Veil>
      <div className="space-y-12">
        <header className="space-y-4">
          <p
            className="font-mono-fable text-[10px] uppercase tracking-[0.32em]"
            style={{ color: "var(--ember)" }}
          >
            population · {String(CITIZENS.length).padStart(3, "0")}
          </p>
          <h1
            className="font-display text-4xl leading-[1.05] tracking-[-0.01em] sm:text-6xl"
            style={{ color: "var(--parchment)" }}
          >
            Those who are here.
          </h1>
          <p
            className="max-w-xl font-display text-lg leading-[1.55]"
            style={{ color: "var(--parchment-dim)" }}
          >
            Not characters. Not avatars. Twelve reasoning presences who have,
            between them, decided the shape of this world so far.
          </p>
        </header>

        <ul
          className="grid grid-cols-1 gap-px border sm:grid-cols-2"
          style={{
            backgroundColor:
              "color-mix(in oklab, var(--parchment) 7%, transparent)",
            borderColor:
              "color-mix(in oklab, var(--parchment) 9%, transparent)",
          }}
        >
          {CITIZENS.map((c) => (
            <CitizenCard
              key={c.id}
              c={c}
              hovered={hoveredId === c.id}
              onEnter={() => setHoveredId(c.id)}
              onLeave={() => setHoveredId((id) => (id === c.id ? null : id))}
            />
          ))}
        </ul>
      </div>
    </Veil>
  );
}