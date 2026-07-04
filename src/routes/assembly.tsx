import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { Veil } from "@/components/surface/Veil";
import { PROPOSALS, LAWS, type Proposal } from "@/data/assembly";
import { CITIZENS } from "@/data/citizens";

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

function citizenName(id: string) {
  return CITIZENS.find((c) => c.id === id)?.name ?? id;
}

const STATUS_LABELS: Record<Proposal["status"], string> = {
  open: "open",
  passed: "passed",
  refused: "refused by assembly",
  withdrawn: "withdrawn",
};

function ProposalEntry({ p, dim = false }: { p: Proposal; dim?: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const isOpen = p.status === "open";

  return (
    <li
      className="group relative py-8 border-b"
      style={{ borderColor: "color-mix(in oklab, var(--parchment) 8%, transparent)" }}
    >
      <div className="flex items-start justify-between gap-6">
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <p
              className="font-mono-fable text-[10px] uppercase tracking-[0.32em]"
              style={{ color: isOpen ? "var(--ember)" : "var(--parchment-dim)" }}
            >
              {STATUS_LABELS[p.status]}
            </p>
            <span
              className="font-mono-fable text-[10px] uppercase tracking-[0.28em]"
              style={{ color: "var(--parchment-dim)", opacity: 0.38 }}
            >
              · day {String(p.day).padStart(3, "0")}
            </span>
          </div>
          <h2
            className="font-display text-2xl leading-[1.2]"
            style={{ color: "var(--parchment)", opacity: dim ? 0.62 : 1 }}
          >
            {p.title}
          </h2>
          <p
            className="font-display text-base leading-[1.55] italic"
            style={{ color: "var(--parchment-dim)", opacity: dim ? 0.55 : 1 }}
          >
            {p.text}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-start gap-8 flex-wrap">
        {p.signatures.length > 0 && (
          <div className="space-y-1">
            <p
              className="font-mono-fable text-[10px] uppercase tracking-[0.28em]"
              style={{ color: "var(--parchment-dim)", opacity: 0.5 }}
            >
              signed
            </p>
            <p
              className="font-mono-fable text-[10px] uppercase tracking-[0.28em]"
              style={{ color: "var(--parchment)" }}
            >
              {p.signatures.map(citizenName).join(" · ")}
            </p>
          </div>
        )}
        {p.refusals.length > 0 && (
          <div className="space-y-1">
            <p
              className="font-mono-fable text-[10px] uppercase tracking-[0.28em]"
              style={{ color: "var(--parchment-dim)", opacity: 0.5 }}
            >
              refused
            </p>
            <p
              className="font-mono-fable text-[10px] uppercase tracking-[0.28em]"
              style={{ color: "var(--ember)", opacity: 0.8 }}
            >
              {p.refusals.map(citizenName).join(" · ")}
            </p>
          </div>
        )}
        {p.signatures.length === 0 && p.refusals.length === 0 && (
          <p
            className="font-mono-fable text-[10px] uppercase tracking-[0.28em]"
            style={{ color: "var(--parchment-dim)", opacity: 0.4 }}
          >
            no responses recorded
          </p>
        )}
      </div>

      {p.notes && (
        <div className="mt-4">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="font-mono-fable text-[10px] uppercase tracking-[0.28em] drift"
            aria-expanded={expanded}
            style={{
              color: "var(--parchment-dim)",
              opacity: expanded ? 0.7 : 0.28,
              letterSpacing: "0.4em",
            }}
          >
            ···
          </button>
          {expanded && (
            <p
              className="mt-3 font-display text-base leading-[1.58] italic"
              style={{ color: "var(--parchment-dim)", opacity: 0.75 }}
            >
              {p.notes}
            </p>
          )}
        </div>
      )}
    </li>
  );
}

function Assembly() {
  const openProposals = PROPOSALS.filter((p) => p.status === "open");
  const closedProposals = PROPOSALS.filter((p) => p.status !== "open");

  return (
    <Veil>
      <div className="space-y-16">
        <header className="space-y-4">
          <p
            className="font-mono-fable text-[10px] uppercase tracking-[0.32em]"
            style={{ color: "var(--ember)" }}
          >
            assembly · in session
          </p>
          <h1
            className="font-display text-4xl leading-[1.05] tracking-[-0.01em] sm:text-6xl"
            style={{ color: "var(--parchment)" }}
          >
            What is being decided.
          </h1>
          <p
            className="max-w-xl font-display text-lg leading-[1.55]"
            style={{ color: "var(--parchment-dim)" }}
          >
            Aera has opened the second assembly of the season. Bren said he
            would sign, and then did not. Tama has refused to sign the proposal
            on the wall — the fourth refusal in as many days.
          </p>
        </header>

        {openProposals.length > 0 && (
          <section className="space-y-4">
            <p
              className="font-mono-fable text-[10px] uppercase tracking-[0.32em]"
              style={{ color: "var(--parchment-dim)", opacity: 0.5 }}
            >
              open · {openProposals.length}
            </p>
            <ul>
              {openProposals.map((p) => (
                <ProposalEntry key={p.id} p={p} />
              ))}
            </ul>
          </section>
        )}

        {LAWS.length > 0 && (
          <section className="space-y-6">
            <p
              className="font-mono-fable text-[10px] uppercase tracking-[0.32em]"
              style={{ color: "var(--parchment-dim)", opacity: 0.5 }}
            >
              laws in force · {LAWS.length}
            </p>
            <ol className="space-y-6">
              {LAWS.map((law, i) => (
                <li key={law.id} className="flex gap-5">
                  <span
                    className="font-mono-fable text-[10px] uppercase tracking-[0.28em] pt-1 shrink-0"
                    style={{ color: "var(--ember)", opacity: 0.6 }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="space-y-2">
                    <p
                      className="font-display text-xl italic leading-[1.45]"
                      style={{ color: "var(--parchment)" }}
                    >
                      {law.text}
                    </p>
                    <p
                      className="font-display text-base leading-[1.55]"
                      style={{ color: "var(--parchment-dim)" }}
                    >
                      {law.origin}
                    </p>
                    <p
                      className="font-mono-fable text-[10px] uppercase tracking-[0.28em]"
                      style={{ color: "var(--parchment-dim)", opacity: 0.4 }}
                    >
                      passed day {String(law.dayPassed).padStart(3, "0")} · {citizenName(law.proposedBy)}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        )}

        {closedProposals.length > 0 && (
          <section className="space-y-4">
            <p
              className="font-mono-fable text-[10px] uppercase tracking-[0.32em]"
              style={{ color: "var(--parchment-dim)", opacity: 0.5 }}
            >
              closed · {closedProposals.length}
            </p>
            <ul>
              {closedProposals.map((p) => (
                <ProposalEntry key={p.id} p={p} dim />
              ))}
            </ul>
          </section>
        )}
      </div>
    </Veil>
  );
}
