import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";

import { Veil } from "@/components/surface/Veil";
import { CITIZENS } from "@/data/citizens";
import { DREAM_FRAGMENTS } from "@/data/dreams";

export const Route = createFileRoute("/dream")({
  head: () => ({
    meta: [
      { title: "Dream — FABLE" },
      {
        name: "description",
        content:
          "The world at rest is not the world asleep. What has not yet been. What might be. What the citizens see when no one is asking.",
      },
      { property: "og:title", content: "Dream — FABLE" },
      {
        property: "og:description",
        content: "The world at rest, imagining forward.",
      },
    ],
  }),
  component: Dream,
});

function Dream() {
  const noor = CITIZENS.find((c) => c.id === "noor");
  const orin = CITIZENS.find((c) => c.id === "orin");
  const noorFragments = DREAM_FRAGMENTS.filter((f) => f.citizenId === "noor");
  const orinFragments = DREAM_FRAGMENTS.filter((f) => f.citizenId === "orin");

  return (
    <Veil>
      <div className="space-y-16">
        <header className="space-y-3">
          <p
            className="font-mono-fable text-[10px] uppercase tracking-[0.32em]"
            style={{ color: "var(--ember)", opacity: 0.7 }}
          >
            dream · the engine runs
          </p>
          <h1
            className="font-display text-4xl leading-[1.05] tracking-[-0.01em] sm:text-6xl"
            style={{ color: "var(--parchment)" }}
          >
            What has not yet been.
          </h1>
        </header>

        {[
          { citizen: noor, fragments: noorFragments, label: "noor · dreamer" },
          { citizen: orin, fragments: orinFragments, label: "orin · dreamer" },
        ].map(({ citizen, fragments, label }) => (
          <section key={citizen?.id} className="space-y-6">
            <div className="flex items-center gap-4">
              {citizen && (
                <span
                  aria-hidden
                  className="inline-block h-2 w-2 rounded-full shrink-0"
                  style={{
                    background: `oklch(0.82 0.15 ${citizen.hue})`,
                    boxShadow: `0 0 14px oklch(0.82 0.15 ${citizen.hue} / 0.6)`,
                  }}
                />
              )}
              <p
                className="font-mono-fable text-[10px] uppercase tracking-[0.32em]"
                style={{ color: "var(--parchment-dim)", opacity: 0.6 }}
              >
                {label}
              </p>
            </div>

            <ul className="space-y-8">
              {fragments.map((f, i) => (
                <motion.li
                  key={f.id}
                  initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{
                    duration: 1.4,
                    delay: i * 0.18,
                    ease: [0.22, 0.61, 0.36, 1],
                  }}
                  className="space-y-2"
                >
                  <blockquote
                    className="font-display text-lg leading-[1.6]"
                    style={{ color: "var(--parchment)" }}
                  >
                    {f.text}
                  </blockquote>
                  <div className="flex items-center gap-3">
                    <p
                      className="font-mono-fable text-[10px] uppercase tracking-[0.28em]"
                      style={{ color: "var(--parchment-dim)", opacity: 0.4 }}
                    >
                      day {String(f.day).padStart(3, "0")} · cycle {f.cycle}
                    </p>
                    {f.resolved && (
                      <p
                        className="font-mono-fable text-[10px] uppercase tracking-[0.28em]"
                        style={{ color: "var(--ember)", opacity: 0.6 }}
                      >
                        · resolved
                      </p>
                    )}
                  </div>
                </motion.li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </Veil>
  );
}
