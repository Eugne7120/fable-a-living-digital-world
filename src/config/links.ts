// Centralized external link configuration.
//
// Every destination that lives outside this app (socials, docs, launch venue)
// is defined here and nowhere else. A link is considered enabled once its
// `url` is filled in — components read `isLinkEnabled()` and never hardcode
// URLs or "coming soon" logic themselves. To go live with a link later,
// set its `url` here; no component changes are required.

export interface ExternalLink {
  label: string;
  url: string | null;
  /** Shown while the link has no url yet. */
  pendingHint: string;
}

export const EXTERNAL_LINKS = {
  x: {
    label: "X",
    url: null,
    pendingHint: "not yet available",
  },
  github: {
    label: "GitHub",
    url: null,
    pendingHint: "not yet available",
  },
  documentation: {
    label: "Documentation",
    url: null,
    pendingHint: "the record is still being written",
  },
  launch: {
    label: "Launch",
    url: null,
    pendingHint: "not yet available",
  },
} satisfies Record<string, ExternalLink>;

export type ExternalLinkId = keyof typeof EXTERNAL_LINKS;

export function isLinkEnabled(link: ExternalLink): boolean {
  return Boolean(link.url);
}
