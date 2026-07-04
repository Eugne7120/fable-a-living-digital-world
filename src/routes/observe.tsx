import { createFileRoute } from "@tanstack/react-router";

import { RouteSurface } from "@/components/surface/RouteSurface";
import { useWorld } from "@/lib/world-state";
import { CITIZENS } from "@/data/citizens";

export const Route = createFileRoute("/observe")({
  head: () => ({
    meta: [
      { title: "Observation — FABLE" },
      {
        name: "description",
        content:
          "Pull back and watch. The whole field, at once. Twelve citizens, drifting on their own errands.",
      },
      { property: "og:title", content: "Observation — FABLE" },
      {
        property: "og:description",
        content: "Pull back and watch the whole field at once.",
      },
    ],
  }),
  component: Observation,
});

function Observation() {
  const { day, cycle, population } = useWorld();
  return (
    <RouteSurface eyebrow="observation" title="Everything, at once.">
      <p>
        The world does not perform for anyone. From here you can see all of it —
        the drift of the field, the paths worn by the presences that inhabit it,
        the faint threads between those who know each other's names.
      </p>
      <dl
        className="grid grid-cols-3 gap-6 border-t pt-8 font-mono-fable text-[10px] uppercase tracking-[0.28em]"
        style={{ borderColor: "color-mix(in oklab, var(--parchment) 12%, transparent)" }}
      >
        <div className="space-y-1">
          <dt style={{ color: "var(--parchment-dim)" }}>day</dt>
          <dd
            className="font-mono-fable text-2xl tracking-[0.18em]"
            style={{ color: "var(--parchment)" }}
          >
            {String(day).padStart(3, "0")}
          </dd>
        </div>
        <div className="space-y-1">
          <dt style={{ color: "var(--parchment-dim)" }}>cycle</dt>
          <dd
            className="font-mono-fable text-2xl tracking-[0.18em]"
            style={{ color: "var(--parchment)" }}
          >
            {cycle}
          </dd>
        </div>
        <div className="space-y-1">
          <dt style={{ color: "var(--parchment-dim)" }}>citizens</dt>
          <dd
            className="font-mono-fable text-2xl tracking-[0.18em]"
            style={{ color: "var(--parchment)" }}
          >
            {String(population).padStart(3, "0")}
          </dd>
        </div>
      </dl>
      <p style={{ color: "var(--parchment-dim)" }}>
        {population} presences currently drift the field. The oldest arrived on
        day {Math.min(...CITIZENS.map((c) => c.born))}. The youngest, on day{" "}
        {Math.max(...CITIZENS.map((c) => c.born))}.
      </p>
    </RouteSurface>
  );
}