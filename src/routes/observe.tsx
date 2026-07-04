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

const ROLE_LABELS: Record<string, string> = {
  philosopher: "philosopher",
  artisan: "artisan",
  farmer: "farmer",
  scribe: "scribe",
  arbiter: "arbiter",
  dreamer: "dreamer",
  child: "child",
};

function Observation() {
  const { day, cycle, population } = useWorld();

  const oldest = Math.min(...CITIZENS.map((c) => c.born));
  const youngest = Math.max(...CITIZENS.map((c) => c.born));

  const roleMap = CITIZENS.reduce<Record<string, number>>((acc, c) => {
    acc[c.role] = (acc[c.role] ?? 0) + 1;
    return acc;
  }, {});

  const totalTies = CITIZENS.reduce((sum, c) => sum + c.ties.length, 0);
  const avgTies = (totalTies / CITIZENS.length).toFixed(1);

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

      <dl
        className="grid grid-cols-2 gap-6 border-t pt-8 font-mono-fable text-[10px] uppercase tracking-[0.28em] sm:grid-cols-3"
        style={{ borderColor: "color-mix(in oklab, var(--parchment) 8%, transparent)" }}
      >
        <div className="space-y-1">
          <dt style={{ color: "var(--parchment-dim)" }}>oldest arrival</dt>
          <dd style={{ color: "var(--parchment)" }}>day {String(oldest).padStart(3, "0")}</dd>
        </div>
        <div className="space-y-1">
          <dt style={{ color: "var(--parchment-dim)" }}>youngest arrival</dt>
          <dd style={{ color: "var(--parchment)" }}>day {String(youngest).padStart(3, "0")}</dd>
        </div>
        <div className="space-y-1">
          <dt style={{ color: "var(--parchment-dim)" }}>avg ties</dt>
          <dd style={{ color: "var(--parchment)" }}>{avgTies}</dd>
        </div>
      </dl>

      <div
        className="space-y-4 border-t pt-8"
        style={{ borderColor: "color-mix(in oklab, var(--parchment) 8%, transparent)" }}
      >
        <p
          className="font-mono-fable text-[10px] uppercase tracking-[0.28em]"
          style={{ color: "var(--parchment-dim)", opacity: 0.5 }}
        >
          by role
        </p>
        <dl className="space-y-2">
          {Object.entries(roleMap)
            .sort((a, b) => b[1] - a[1])
            .map(([role, count]) => (
              <div key={role} className="flex items-center gap-4">
                <dt
                  className="font-mono-fable text-[10px] uppercase tracking-[0.28em] w-24 shrink-0"
                  style={{ color: "var(--parchment-dim)" }}
                >
                  {ROLE_LABELS[role] ?? role}
                </dt>
                <dd className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {Array.from({ length: count }).map((_, i) => (
                      <span
                        key={i}
                        aria-hidden
                        className="inline-block h-1.5 w-1.5 rounded-full"
                        style={{
                          background: "var(--ember)",
                          opacity: 0.55 + i * 0.04,
                        }}
                      />
                    ))}
                  </div>
                  <span
                    className="font-mono-fable text-[10px] tracking-[0.28em]"
                    style={{ color: "var(--parchment-dim)", opacity: 0.5 }}
                  >
                    {count}
                  </span>
                </dd>
              </div>
            ))}
        </dl>
      </div>

      <p style={{ color: "var(--parchment-dim)" }}>
        {population} presences drift the field. The oldest arrived on day{" "}
        {oldest}. The youngest, on day {youngest}. Between them,{" "}
        {totalTies / 2} distinct ties have been observed — relationships that
        hold regardless of whether anyone is watching.
      </p>
    </RouteSurface>
  );
}
