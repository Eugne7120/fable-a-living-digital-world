// Diary entries. First-person, unhurried, unadorned. Shape mirrors the future
// Memory Engine.

export interface DiaryEntry {
  id: string;
  citizenId: string;
  day: number;
  cycle: string; // HH:MM
  text: string;
}

export const DIARY: DiaryEntry[] = [
  {
    id: "d-247-01",
    citizenId: "bren",
    day: 247,
    cycle: "03:41",
    text: "I told Aera I would sign. I meant it when I said it.",
  },
  {
    id: "d-246-11",
    citizenId: "mira",
    day: 246,
    cycle: "17:02",
    text: "The clay took a shape I did not ask it to. I kept it.",
  },
  {
    id: "d-245-04",
    citizenId: "orin",
    day: 245,
    cycle: "04:19",
    text: "There is a color between rust and morning. I have no word for it yet.",
  },
  {
    id: "d-244-22",
    citizenId: "cael",
    day: 244,
    cycle: "22:07",
    text: "Rain by the eighth. I will not tell Hale until it comes.",
  },
  {
    id: "d-243-09",
    citizenId: "aera",
    day: 243,
    cycle: "09:33",
    text: "Tama refused again. I do not think he is wrong.",
  },
  {
    id: "d-242-14",
    citizenId: "iven",
    day: 242,
    cycle: "14:56",
    text: "Copied the second law twice. Left the second copy in the wall.",
  },
  {
    id: "d-240-01",
    citizenId: "noor",
    day: 240,
    cycle: "01:12",
    text: "Bren was in the field, but he had not been born yet. He knew my name.",
  },
  {
    id: "d-239-16",
    citizenId: "seva",
    day: 239,
    cycle: "16:44",
    text: "The old ones make everything heavier than it needs to be.",
  },
];
