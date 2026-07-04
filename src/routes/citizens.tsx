import { createFileRoute } from "@tanstack/react-router";

import { Veil } from "@/components/surface/Veil";
import { CITIZENS } from "@/data/citizens";

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

function Population() {
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
              "color-mix(in oklab, var(--parchment) 8%, transparent)",
            borderColor:
              "color-mix(in oklab, var(--parchment) 10%, transparent)",
          }}
        >
          {CITIZENS.map((c) => (
            <li
              key={c.id}
              className="group p-6 drift"
              style={{ backgroundColor: "color-mix(in oklab, var(--ink) 88%, transparent)" }}
            >
              <div className="flex items-baseline justify-between gap-4">
                <h2
                  className="font-display text-2xl leading-none"
                  style={{ color: "var(--parchment)" }}
                >
                  {c.name}
                </h2>
                <span
                  aria-hidden
                  className="inline-block h-2 w-2 rounded-full"
                  style={{
                    background: `oklch(0.82 0.15 ${c.hue})`,
                    boxShadow: `0 0 12px oklch(0.82 0.15 ${c.hue} / 0.6)`,
                  }}
                />
              </div>
              <p
                className="mt-1 font-mono-fable text-[10px] uppercase tracking-[0.28em]"
                style={{ color: "var(--parchment-dim)" }}
              >
                {c.role} · born day {c.born}
              </p>
              <p
                className="mt-4 font-display text-base leading-[1.55]"
                style={{ color: "var(--parchment)" }}
              >
                {c.brief}
              </p>
              {c.ties.length > 0 && (
                <p
                  className="mt-4 font-mono-fable text-[10px] uppercase tracking-[0.28em]"
                  style={{ color: "var(--parchment-dim)" }}
                >
                  ties · {c.ties.join(" · ")}
                </p>
              )}
            </li>
          ))}
        </ul>
      </div>
    </Veil>
  );
}