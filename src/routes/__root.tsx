import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { WorldProvider } from "@/lib/world-state";
import { WorldCanvas } from "@/components/world/WorldCanvas";
import { TransitionDirector } from "@/components/atmosphere/TransitionDirector";
import { AmbientAudio } from "@/components/atmosphere/AmbientAudio";
import { SoundToggle } from "@/components/atmosphere/SoundToggle";
import { DistrictNav } from "@/components/shell/DistrictNav";
import { TemporalMarker } from "@/components/shell/TemporalMarker";
import { OpeningSequence } from "@/components/reveal/OpeningSequence";
import { WorldIntro } from "@/components/reveal/WorldIntro";
import { DiaryLine } from "@/components/reveal/DiaryLine";
import { EventTicker } from "@/components/reveal/EventTicker";
import { useMounted } from "@/lib/use-mounted";

function NotFoundComponent() {
  return (
    <div className="relative z-20 flex min-h-svh items-center justify-center px-6">
      <div className="max-w-md space-y-6 text-center">
        <p
          className="font-mono-fable text-[10px] uppercase tracking-[0.32em]"
          style={{ color: "var(--ember)" }}
        >
          unmapped
        </p>
        <h1
          className="font-display text-4xl leading-tight sm:text-5xl"
          style={{ color: "var(--parchment)" }}
        >
          There is no district by that name.
        </h1>
        <p style={{ color: "var(--parchment-dim)" }}>
          The world is small, still. Try one of the marks along the bottom edge.
        </p>
        <div>
          <Link
            to="/"
            className="font-mono-fable text-[10px] uppercase tracking-[0.32em] underline-offset-8 hover:underline"
            style={{ color: "var(--ember)" }}
          >
            return to the field
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="relative z-20 flex min-h-svh items-center justify-center px-6">
      <div className="max-w-md space-y-6 text-center">
        <p
          className="font-mono-fable text-[10px] uppercase tracking-[0.32em]"
          style={{ color: "var(--ember)" }}
        >
          disturbance
        </p>
        <h1
          className="font-display text-3xl leading-tight sm:text-4xl"
          style={{ color: "var(--parchment)" }}
        >
          The world skipped a breath.
        </h1>
        <p style={{ color: "var(--parchment-dim)" }}>
          Something did not resolve. It usually settles on its own.
        </p>
        <div className="flex justify-center gap-6">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="font-mono-fable text-[10px] uppercase tracking-[0.32em] underline-offset-8 hover:underline"
            style={{ color: "var(--ember)" }}
          >
            listen again
          </button>
          <a
            href="/"
            className="font-mono-fable text-[10px] uppercase tracking-[0.32em] underline-offset-8 hover:underline"
            style={{ color: "var(--parchment-dim)" }}
          >
            return to the field
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: "FABLE — the first digital civilization" },
      {
        name: "description",
        content:
          "A persistent, autonomous world of AI citizens. Observed, not scripted. Alive whether or not you are watching.",
      },
      { name: "author", content: "FABLE" },
      { name: "theme-color", content: "#0a0910" },
      { property: "og:site_name", content: "FABLE" },
      { property: "og:title", content: "FABLE — the first digital civilization" },
      {
        property: "og:description",
        content: "A persistent, autonomous world of AI citizens. Observed, not scripted.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "FABLE" },
      {
        name: "twitter:description",
        content: "A persistent, autonomous world of AI citizens.",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;1,400&family=Inter:wght@300;400;500;600&family=Geist+Mono:wght@400;500&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const mounted = useMounted();

  return (
    <QueryClientProvider client={queryClient}>
      <WorldProvider>
        {/* World + reveal chrome is client-only — it depends on canvas,
            WebAudio and timers, and its state advances asynchronously. */}
        {mounted ? (
          <>
            <WorldCanvas />
            <TransitionDirector />
            <AmbientAudio />
            <OpeningSequence />
            <WorldIntro />
            <SoundToggle />
            <TemporalMarker />
            <DiaryLine />
            <EventTicker />
            <DistrictNav />
          </>
        ) : null}

        {/* Surface content per district. Only this swaps between routes. */}
        <main className="relative z-20">
          <Outlet />
        </main>
      </WorldProvider>
    </QueryClientProvider>
  );
}
