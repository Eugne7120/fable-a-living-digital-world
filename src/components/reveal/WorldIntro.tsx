// The world introduction. Bridges the cinematic opening (a breath of light)
// and free exploration of the field. Answers, quietly and in order:
//   1. What is FABLE?        — identity mark + line
//   2. Why is it different?  — one supporting sentence + the living field
//   3. Where do I go next?   — embedded invitations
//
// This is not a hero section. Nothing here is a card, a button, or a stat
// grid — it reads as the world observing itself, the same register as the
// diary line and event ticker that take over once this fades.

import { AnimatePresence, motion } from "framer-motion";
import { Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";

import { useWorld } from "@/lib/world-state";
import { CITIZENS } from "@/data/citizens";
import { DIARY } from "@/data/diary";
import { DREAM_FRAGMENTS } from "@/data/dreams";
import { EXTERNAL_LINKS, isLinkEnabled } from "@/config/links";

const snapshotFade = {
  hidden: { opacity: 0, y: 10, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 1.4, ease: [0.22, 0.61, 0.36, 1] as const },
  },
};

function WorldSnapshot() {
  const { day } = useWorld();
  const stats = [
    { label: "citizens", value: CITIZENS.length },
    { label: "memories", value: DIARY.length },
    { label: "dreams", value: DREAM_FRAGMENTS.length },
  ];

  return (
    <motion.p
      variants={snapshotFade}
      className="font-mono-fable text-[10px] uppercase tracking-[0.3em]"
      style={{ color: "var(--parchment-dim)", opacity: 0.55 }}
    >
      {stats.map((s) => `${s.value} ${s.label}`).join(" · ")}
      {" · "}day {String(day).padStart(3, "0")}
    </motion.p>
  );
}

interface InvitationProps {
  to?: string;
  label: string;
  onNavigate?: () => void;
  disabledHint?: string;
}

function Invitation({ to, label, onNavigate, disabledHint }: InvitationProps) {
  const [showHint, setShowHint] = useState(false);

  if (disabledHint) {
    return (
      <span className="relative inline-flex flex-col items-center gap-1.5">
        <button
          type="button"
          aria-disabled="true"
          aria-label={`${label} — ${disabledHint}`}
          onClick={() => {
            setShowHint(true);
            window.setTimeout(() => setShowHint(false), 1800);
          }}
          className="font-mono-fable text-[11px] uppercase tracking-[0.28em] outline-none"
          style={{ color: "var(--parchment-dim)", opacity: 0.4, cursor: "default" }}
        >
          {label}
        </button>
        <AnimatePresence>
          {showHint && (
            <motion.span
              initial={{ opacity: 0, y: -2 }}
              animate={{ opacity: 0.65, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="pointer-events-none absolute top-full whitespace-nowrap font-mono-fable text-[9px] uppercase tracking-[0.24em]"
              style={{ color: "var(--ember)" }}
            >
              {disabledHint}
            </motion.span>
          )}
        </AnimatePresence>
      </span>
    );
  }

  return (
    <Link
      to={to}
      onClick={onNavigate}
      className="drift font-mono-fable text-[11px] uppercase tracking-[0.28em] outline-none hover:opacity-100"
      style={{ color: "var(--parchment)", opacity: 0.72 }}
    >
      {label}
    </Link>
  );
}

export function WorldIntro() {
  const { beat, skipReveal } = useWorld();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const visible = pathname === "/" && beat >= 4 && beat < 6;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="world-intro"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{
            opacity: 0,
            filter: "blur(14px)",
            transition: { duration: 1.6, ease: [0.22, 0.61, 0.36, 1] },
          }}
          className="pointer-events-none fixed inset-0 z-20 flex flex-col items-center justify-center px-6 text-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 12, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.8, ease: [0.22, 0.61, 0.36, 1] }}
            className="space-y-3"
          >
            <p
              className="font-mono-fable text-[10px] uppercase tracking-[0.36em]"
              style={{ color: "var(--ember)", opacity: 0.65 }}
            >
              the first digital civilization
            </p>
            <h1
              className="font-display text-6xl leading-none tracking-[-0.02em] sm:text-8xl"
              style={{ color: "var(--parchment)" }}
            >
              FABLE
            </h1>
          </motion.div>

          <AnimatePresence>
            {beat >= 5 && (
              <motion.div
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, transition: { duration: 0.8 } }}
                variants={{
                  hidden: {},
                  visible: { transition: { staggerChildren: 0.35, delayChildren: 0.1 } },
                }}
                className="pointer-events-auto mt-8 flex flex-col items-center gap-10"
              >
                <motion.p
                  variants={snapshotFade}
                  className="font-display max-w-md text-lg leading-[1.5] sm:text-xl"
                  style={{ color: "var(--parchment-dim)" }}
                >
                  A persistent civilization where digital citizens remember, dream, debate and
                  evolve together.
                </motion.p>

                <WorldSnapshot />

                <motion.nav
                  variants={snapshotFade}
                  aria-label="Enter the world"
                  className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6"
                >
                  <Invitation to="/observe" label="Observe Civilization" onNavigate={skipReveal} />
                  <Invitation to="/genesis" label="Genesis" onNavigate={skipReveal} />
                  <Invitation
                    label={EXTERNAL_LINKS.documentation.label}
                    disabledHint={
                      isLinkEnabled(EXTERNAL_LINKS.documentation)
                        ? undefined
                        : EXTERNAL_LINKS.documentation.pendingHint
                    }
                  />
                  <Invitation
                    label={EXTERNAL_LINKS.launch.label}
                    disabledHint={
                      isLinkEnabled(EXTERNAL_LINKS.launch)
                        ? undefined
                        : EXTERNAL_LINKS.launch.pendingHint
                    }
                  />
                </motion.nav>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
