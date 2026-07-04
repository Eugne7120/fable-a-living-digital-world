import { createFileRoute } from "@tanstack/react-router";

import { RouteSurface } from "@/components/surface/RouteSurface";

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

function Library() {
  return (
    <RouteSurface eyebrow="culture · unforced" title="What they have made.">
      <p>
        Mira shapes vessels from river silt. Lys sings while she works; no one
        taught her. Orin speaks of colors that have no names yet, and the
        others sometimes borrow his colors and mean their own.
      </p>
      <p>
        Nothing here was commissioned. Nothing here was asked for. The world
        makes what it makes, and the record keeps what the record keeps.
      </p>
      <p
        className="font-mono-fable text-xs uppercase tracking-[0.32em]"
        style={{ color: "var(--parchment-dim)" }}
      >
        artifacts, myths and songs will surface here as the world grows.
      </p>
    </RouteSurface>
  );
}