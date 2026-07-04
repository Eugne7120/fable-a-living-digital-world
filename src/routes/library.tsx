import { createFileRoute } from "@tanstack/react-router";

import { Veil } from "@/components/surface/Veil";
import { ARTIFACTS, type Artifact } from "@/data/library";
import { CITIZENS } from "@/data/citizens";

export const Route = createFileRoute("/library")({
  head: () => ({
    meta: [
      { title: "Culture — FABLE" },
      {
        name: "description",
        content:
          "What the citizens have made. Artifacts, myths, songs no one taught them. The unforced record of an inner life.",
      },
      { property: "og:title", content: "Culture — FABLE" },
      {
        property: "og:description",
        content: "What the citizens have made.",
      },
    ],
  }),
  component: Library,
});

const KIND_MARKS: Record<Artifact["kind"], string> = {
  vessel: "○",
  song: "♩",
  color: "◈",
  story: "◻",
  mark: "✦",
  word: "◌",
};

const KIND_LABELS: Record<Artifact["kind"], string> = {
  vessel: "vessel",
  song: "song",
  color: "color",
  story: "story",
  mark: "mark",
  word: "word",
};

function ArtifactEntry({ a }: { a: Artifact }) {
  const citizen = CITIZENS.find((c) => c.id === a.citizenId);

  return (
    <li
      className="py-8 border-b space-y-3"
      style={{ borderColor: "color-mix(in oklab, var(--parchment) 8%, transparent)" }}
    >
      <div className="flex items-center gap-3">
        <span
          aria-hidden
          className="font-mono-fable text-sm leading-none"
          style={{ color: "var(--ember)", opacity: 0.7 }}
        >
          {KIND_MARKS[a.kind]}
        </span>
        <p
          className="font-mono-fable text-[10px] uppercase tracking-[0.28em]"
          style={{ color: "var(--parchment-dim)", opacity: 0.5 }}
        >
          {KIND_LABELS[a.kind]} · {citizen?.name ?? a.citizenId} · day {String(a.day).padStart(3, "0")}
          {a.status === "disputed" && (
            <span style={{ color: "var(--ember)", opacity: 0.8 }}> · disputed</span>
          )}
          {a.status === "lost" && " · lost"}
        </p>
      </div>
      <h2
        className="font-display text-2xl leading-[1.2]"
        style={{ color: "var(--parchment)" }}
      >
        {a.title}
      </h2>
      <p
        className="font-display text-base leading-[1.6]"
        style={{ color: "var(--parchment-dim)" }}
      >
        {a.description}
      </p>
      {a.note && (
        <p
          className="font-display text-sm leading-[1.6] italic border-l pl-4"
          style={{
            color: "var(--parchment-dim)",
            borderColor: "color-mix(in oklab, var(--parchment) 15%, transparent)",
            opacity: 0.75,
          }}
        >
          {a.note}
        </p>
      )}
    </li>
  );
}

function Library() {
  return (
    <Veil>
      <div className="space-y-12">
        <header className="space-y-4">
          <p
            className="font-mono-fable text-[10px] uppercase tracking-[0.32em]"
            style={{ color: "var(--ember)" }}
          >
            culture · unforced
          </p>
          <h1
            className="font-display text-4xl leading-[1.05] tracking-[-0.01em] sm:text-6xl"
            style={{ color: "var(--parchment)" }}
          >
            What they have made.
          </h1>
          <p
            className="max-w-xl font-display text-lg leading-[1.55]"
            style={{ color: "var(--parchment-dim)" }}
          >
            Nothing here was commissioned. Nothing was asked for. The world
            makes what it makes.
          </p>
        </header>

        <ul>
          {ARTIFACTS.map((a) => (
            <ArtifactEntry key={a.id} a={a} />
          ))}
        </ul>
      </div>
    </Veil>
  );
}
