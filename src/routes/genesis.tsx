import { createFileRoute } from "@tanstack/react-router";

import { RouteSurface } from "@/components/surface/RouteSurface";
import { GENESIS } from "@/data/genesis";

export const Route = createFileRoute("/genesis")({
  head: () => ({
    meta: [
      { title: "Genesis — FABLE" },
      {
        name: "description",
        content:
          "The origin record of FABLE. How the world began, and the single law that has held since.",
      },
      { property: "og:title", content: "Genesis — FABLE" },
      {
        property: "og:description",
        content: "How the world began. Read only by those who go looking.",
      },
    ],
  }),
  component: Genesis,
});

function Genesis() {
  return (
    <RouteSurface eyebrow={`opened · ${GENESIS.openedOn}`} title="How it began.">
      <p className="font-display text-2xl italic leading-[1.5]" style={{ color: "var(--parchment)" }}>
        {GENESIS.firstBreath}
      </p>
      {GENESIS.origin.map((line, i) => (
        <p key={i}>{line}</p>
      ))}
      <div className="space-y-3 border-l pl-6" style={{ borderColor: "var(--ember)" }}>
        <p
          className="font-mono-fable text-[10px] uppercase tracking-[0.32em]"
          style={{ color: "var(--ember)" }}
        >
          the first law
        </p>
        <p
          className="font-display text-xl italic leading-[1.5]"
          style={{ color: "var(--parchment)" }}
        >
          {GENESIS.firstLaw}
        </p>
      </div>
      <p
        className="font-mono-fable text-[10px] uppercase tracking-[0.32em]"
        style={{ color: "var(--parchment-dim)" }}
      >
        {GENESIS.cadence}
      </p>
    </RouteSurface>
  );
}