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

  const roleMap = CITIZENS.reduce<Record<string, number>>((acc, c) => {
    acc[c.role] = (acc[c.role] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <RouteSurface eyebrow="observation" title="Everything, at once.">
      <p>
        The world does not perform for anyone. From here you can see all of it —
        the drift of the field, the paths worn by the presences that inhabit it,
        the faint threads between those who know each other's names.
      </p>

      {/* Live heartbeat — three numbers, each a fact about the world right now */}
      <div
        className="flex gap-12 border-t pt-8"
        style={{ borderColor: "color-mix(in oklab, var(--parchment) 10%, transparent)" }}
      >
        {[
          { label: "day", value: String(day).padStart(3, "0") },
          { label: "cycle", value: cycle },
          { label: "citizens", value: String(population).padStart(3, "0") },
        ].map(({ label, value }) => (
          <div key={label} className="space-y-1.5">
            <p
              className="font-mono-fable text-[9px] uppercase tracking-[0.32em]"
              style={{ color: "var(--parchment-dim)", opacity: 0.38 }}
            >
              {label}
            </p>
            <p
              className="font-mono-fable text-3xl tracking-[0.12em]"
              style={{ color: "var(--parchment)" }}
            >
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Role map — one presence dot per citizen, by role */}
      <dl
        className="space-y-3 border-t pt-8"
        style={{ borderColor: "color-mix(in oklab, var(--parchment) 8%, transparent)" }}
      >
        {Object.entries(roleMap)
          .sort((a, b) => b[1] - a[1])
          .map(([role, count]) => (
            <div key={role} className="flex items-center gap-5">
              <dt
                className="font-mono-fable text-[10px] uppercase tracking-[0.28em] w-28 shrink-0"
                style={{ color: "var(--parchment-dim)", opacity: 0.45 }}
              >
                {ROLE_LABELS[role] ?? role}
              </dt>
              <dd className="flex items-center gap-1.5">
                {Array.from({ length: count }).map((_, i) => (
                  <span
                    key={i}
                    aria-hidden
                    className="inline-block h-1.5 w-1.5 rounded-full"
                    style={{
                      background: "var(--ember)",
                      opacity: 0.45 + i * 0.06,
                    }}
                  />
                ))}
              </dd>
            </div>
          ))}
      </dl>
    </RouteSurface>
  );
}
