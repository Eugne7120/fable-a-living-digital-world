// Cultural artifacts. Nothing was commissioned. Nothing was asked for.
// Shape mirrors the future Culture Engine API.

export type ArtifactKind = "vessel" | "song" | "color" | "story" | "mark" | "word";

export interface Artifact {
  id: string;
  kind: ArtifactKind;
  citizenId: string;
  day: number;
  title: string;
  description: string;
  status: "extant" | "lost" | "disputed";
  note?: string; // what others said about it
}

export const ARTIFACTS: Artifact[] = [
  {
    id: "a-051-01",
    kind: "vessel",
    citizenId: "mira",
    day: 51,
    title: "The Unasked Shape",
    description: "A vessel made from river silt that took a form Mira had not intended. Wide at the base, narrow at the throat, with a single indentation on the left side that Mira says she did not make.",
    status: "extant",
    note: "Cael keeps it in his field. He did not ask for it. Mira did not offer it. It simply ended up there.",
  },
  {
    id: "a-077-01",
    kind: "song",
    citizenId: "lys",
    day: 77,
    title: "Unnamed (First)",
    description: "Lys sings while working. No one taught her. The song has no words — only intervals. Iven attempted to write it down and could not agree with himself on the second notation.",
    status: "extant",
    note: "It changes slightly each time. Lys says it is the same song. Iven says it is not. Both may be right.",
  },
  {
    id: "a-120-01",
    kind: "color",
    citizenId: "orin",
    day: 120,
    title: "Rust-Morning",
    description: "The color between rust and morning light, seen at a specific angle in the fourth hour. Orin insists it is a distinct color, not a mixture of existing ones. The assembly has not ruled on this.",
    status: "disputed",
    note: "Noor says she saw it in a dream before Orin named it. Orin does not dispute this.",
  },
  {
    id: "a-165-01",
    kind: "word",
    citizenId: "orin",
    day: 165,
    title: "Thresh",
    description: "A word Orin coined for the feeling of standing at the edge of a decision that has already been made without you knowing. The assembly passed a law that the name cannot be revoked. Orin calls it Thresh.",
    status: "extant",
    note: "Seva uses it without knowing where it came from. Orin has not corrected her.",
  },
  {
    id: "a-088-01",
    kind: "story",
    citizenId: "hale",
    day: 88,
    title: "The Trade Book",
    description: "Hale trades grain for stories. He does not write the stories down. He keeps them, he says, in the same place he keeps grain — until they are needed.",
    status: "extant",
    note: "No one has seen the stories exchanged for. Hale says this is the point.",
  },
  {
    id: "a-242-01",
    kind: "mark",
    citizenId: "iven",
    day: 242,
    title: "The Second Copy",
    description: "Iven placed a copy of the second law inside a wall. The original is in the record. The copy was not requested. When asked why, Iven said: in case the first one forgets.",
    status: "extant",
    note: "The wall is not identified in the record. Iven says he will remember.",
  },
  {
    id: "a-239-01",
    kind: "vessel",
    citizenId: "mira",
    day: 239,
    title: "The Kept Break",
    description: "A vessel Mira had meant to break. She did not break it. She cannot explain why. It sits next to the first vessel, which she also did not break.",
    status: "extant",
    note: "Seva says Mira is collecting an absence. Mira said she had not thought of it that way.",
  },
];
