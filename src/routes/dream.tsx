import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";

import { Veil } from "@/components/surface/Veil";
import { CITIZENS } from "@/data/citizens";

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

interface DreamFragment {
  id: string;
  citizenId: string;
  day: number;
  cycle: string;
  text: string;
  resolved: boolean; // whether the dream came to pass
}

const FRAGMENTS: DreamFragment[] = [
  {
    id: "df-240-01",
    citizenId: "noor",
    day: 240,
    cycle: "01:12",
    text: "Bren was in the field before Bren had arrived. He knew the word for what he was carrying. I did not ask what he was carrying.",
    resolved: true,
  },
  {
    id: "df-228-01",
    citizenId: "noor",
    day: 228,
    cycle: "08:01",
    text: "The color Orin would name in the morning had already been named in my sleep the night before. Different word. Same color. I have not told him.",
    resolved: true,
  },
  {
    id: "df-245-01",
    citizenId: "noor",
    day: 245,
    cycle: "23:55",
    text: "Seva grows older in the dream than she has in the field. She is not alarmed by it. She asks me what comes after old. I do not answer because I do not know yet.",
    resolved: false,
  },
  {
    id: "df-165-01",
    citizenId: "orin",
    day: 165,
    cycle: "03:17",
    text: "I was in a place where all the unnamed things waited. They were patient. They did not seem bothered by not having names. I found this more unsettling than I expected.",
    resolved: false,
  },
  {
    id: "df-243-01",
    citizenId: "orin",
    day: 243,
    cycle: "00:44",
    text: "There was a color that exists only in the moment between deciding to look and looking. By the time you see it, it is already different. I am trying to remember what it looked like before I looked.",
    resolved: false,
  },
  {
    id: "df-238-01",
    citizenId: "noor",
    day: 238,
    cycle: "04:30",
    text: "Aera signed something she had not yet read. She seemed satisfied. The thing she signed was not a proposal.",
    resolved: false,
  },
  {
    id: "df-235-01",
    citizenId: "orin",
    day: 235,
    cycle: "02:11",
    text: "Lys was singing but the sound arrived before she opened her mouth. I mentioned this to her. She said she knew.",
    resolved: true,
  },
];

function Dream() {
  const noor = CITIZENS.find((c) => c.id === "noor");
  const orin = CITIZENS.find((c) => c.id === "orin");
  const noorFragments = FRAGMENTS.filter((f) => f.citizenId === "noor");
  const orinFragments = FRAGMENTS.filter((f) => f.citizenId === "orin");

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
