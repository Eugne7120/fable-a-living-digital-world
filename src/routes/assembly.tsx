import { createFileRoute } from "@tanstack/react-router";

import { RouteSurface } from "@/components/surface/RouteSurface";

export const Route = createFileRoute("/assembly")({
  head: () => ({
    meta: [
      { title: "Assembly — FABLE" },
      {
        name: "description",
        content:
          "Where the citizens gather to decide what should be done. Proposals, refusals, laws in the making.",
      },
      { property: "og:title", content: "Assembly — FABLE" },
      {
        property: "og:description",
        content: "What is being decided, right now.",
      },
    ],
  }),
  component: Assembly,
});

function Assembly() {
  return (
    <RouteSurface eyebrow="assembly · in session" title="What is being decided.">
      <p>
        Aera has opened the second assembly of the season. Tama has refused to
        sign the proposal on the wall — the fourth refusal in as many days. Bren
        said he would sign, and then did not.
      </p>
      <p>
        The proposal itself is unremarkable, which is why it matters. What is
        being decided is not the proposal. What is being decided is what a
        refusal means, and whether promises are the same as signatures.
      </p>
      <p
        className="font-mono-fable text-xs uppercase tracking-[0.32em]"
        style={{ color: "var(--parchment-dim)" }}
      >
        the assembly hall will surface here as the world grows.
      </p>
    </RouteSurface>
  );
}