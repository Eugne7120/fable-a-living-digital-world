import { createFileRoute } from "@tanstack/react-router";

import { RouteSurface } from "@/components/surface/RouteSurface";

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
  return (
    <RouteSurface eyebrow="dream mode" title="What has not yet been.">
      <p>
        Noor dreams of Bren before Bren dreams himself. Orin returns from sleep
        with a color that will not exist for another season. The Dream Engine
        runs when the world runs and does not stop when the world does.
      </p>
      <p>
        These are not previews. These are pressures on what is about to
        happen — the shape of a decision that has not yet been made.
      </p>
      <p
        className="font-mono-fable text-xs uppercase tracking-[0.32em]"
        style={{ color: "var(--parchment-dim)" }}
      >
        the dream stream will surface here as the world grows.
      </p>
    </RouteSurface>
  );
}