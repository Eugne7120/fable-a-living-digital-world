import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";

import { Veil } from "@/components/surface/Veil";
import { EVENTS } from "@/data/events";

export const Route = createFileRoute("/archive")({
  head: () => ({
    meta: [
      { title: "Archive — FABLE" },
      {
        name: "description",
        content:
          "Every consequential moment in the world so far. Kept, in order, so that nothing important is forgotten.",
      },
      { property: "og:title", content: "Archive — FABLE" },
      {
        property: "og:description",
        content: "What has happened. Kept, in order.",
      },
    ],
  }),
  component: Archive,
});

function Archive() {
  return (
    <Veil>
      <div className="space-y-12">
        <header className="space-y-4">
          <p
            className="font-mono-fable text-[10px] uppercase tracking-[0.32em]"
            style={{ color: "var(--ember)" }}
          >
            archive
          </p>
          <h1
            className="font-display text-4xl leading-[1.05] tracking-[-0.01em] sm:text-6xl"
            style={{ color: "var(--parchment)" }}
          >
            What has happened.
          </h1>
          <p
            className="max-w-xl font-display text-lg italic leading-[1.55]"
            style={{ color: "var(--parchment-dim)" }}
          >
            The record is kept by Iven, who copies what should not be
            forgotten. Some things are not here yet. Some things will never be.
          </p>
        </header>

        <ol className="relative space-y-10 border-l pl-8"
          style={{ borderColor: "color-mix(in oklab, var(--parchment) 10%, transparent)" }}
        >
          {EVENTS.map((e, i) => (
            <motion.li
              key={e.id}
              className="relative"
              initial={{ opacity: 0, x: -8, filter: "blur(4px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              transition={{
                duration: 1.2,
                delay: i * 0.055,
                ease: [0.22, 0.61, 0.36, 1],
              }}
            >
              <span
                aria-hidden
                className="absolute -left-[37px] top-2 h-2.5 w-2.5 rotate-45"
                style={{
                  background:
                    e.weight === "consequential"
                      ? "var(--ember)"
                      : e.weight === "notable"
                        ? "var(--parchment)"
                        : "var(--parchment-dim)",
                  boxShadow:
                    e.weight === "consequential"
                      ? "0 0 14px color-mix(in oklab, var(--ember) 65%, transparent), 0 0 28px color-mix(in oklab, var(--ember) 30%, transparent)"
                      : "none",
                }}
              />
              <p
                className="font-mono-fable text-[10px] uppercase tracking-[0.32em]"
                style={{ color: "var(--parchment-dim)", opacity: 0.55 }}
              >
                day {String(e.day).padStart(3, "0")} · cycle {e.cycle}
                <span style={{
                  color: e.weight === "consequential" ? "var(--ember)" : "var(--parchment-dim)",
                  opacity: e.weight === "consequential" ? 0.8 : 0.4,
                }}>
                  {" "}· {e.weight}
                </span>
              </p>
              <p
                className="mt-2 font-display text-xl leading-[1.42]"
                style={{
                  color: e.weight === "consequential"
                    ? "var(--parchment)"
                    : e.weight === "notable"
                      ? "color-mix(in oklab, var(--parchment) 88%, transparent)"
                      : "color-mix(in oklab, var(--parchment) 65%, transparent)",
                }}
              >
                {e.text}
              </p>
            </motion.li>
          ))}
        </ol>
      </div>
    </Veil>
  );
}