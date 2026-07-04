// The districts of the world. Each is a state of the same field, not a
// separate destination. Order here determines DistrictNav order.

export type DistrictId =
  | "field"
  | "observe"
  | "citizens"
  | "archive"
  | "assembly"
  | "library"
  | "dream"
  | "genesis";

export interface District {
  id: DistrictId;
  path: string;
  mark: string;   // single-glyph mark shown in nav
  name: string;   // hover-revealed name
  hint: string;   // one-line evocation
}

export const DISTRICTS: District[] = [
  { id: "field",    path: "/",          mark: "·", name: "the field",    hint: "the world, at rest" },
  { id: "observe",  path: "/observe",   mark: "◦", name: "observation",  hint: "pull back and watch" },
  { id: "citizens", path: "/citizens",  mark: "◉", name: "population",   hint: "those who are here" },
  { id: "archive",  path: "/archive",   mark: "▲", name: "archive",      hint: "what has happened" },
  { id: "assembly", path: "/assembly",  mark: "◇", name: "assembly",     hint: "what is being decided" },
  { id: "library",  path: "/library",   mark: "❋", name: "culture",      hint: "what they have made" },
  { id: "dream",    path: "/dream",     mark: "◐", name: "dream",        hint: "what has not yet been" },
  { id: "genesis",  path: "/genesis",   mark: "⊙", name: "genesis",      hint: "how it began" },
];

export function districtForPath(pathname: string): District {
  const exact = DISTRICTS.find((d) => d.path === pathname);
  if (exact) return exact;
  const prefix = DISTRICTS.find((d) => d.path !== "/" && pathname.startsWith(d.path));
  return prefix ?? DISTRICTS[0];
}
