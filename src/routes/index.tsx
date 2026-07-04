import { createFileRoute } from "@tanstack/react-router";

// The Field — the landing state of the world.
//
// There is no surface content here. The persistent world (canvas, diary,
// ticker, temporal marker, district marks) is what the visitor arrives into.
// The opening reveal delays every readable element until curiosity is earned.
export const Route = createFileRoute("/")({
  component: Field,
});

function Field() {
  // A tall spacer so scroll behavior on mobile does not push the viewport.
  // All visible content lives in the persistent root shell.
  return <div aria-hidden className="min-h-svh" />;
}
