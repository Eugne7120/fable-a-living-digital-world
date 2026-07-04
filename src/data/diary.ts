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
  {
    id: "d-238-07",
    citizenId: "hale",
    day: 238,
    cycle: "07:12",
    text: "Traded three measures of grain for a story I already knew. It was worth it to hear it told differently.",
  },
  {
    id: "d-237-21",
    citizenId: "vex",
    day: 237,
    cycle: "21:33",
    text: "I called the assembly on the third day because no one else did. I am not sure that was a reason.",
  },
  {
    id: "d-235-11",
    citizenId: "lys",
    day: 235,
    cycle: "11:08",
    text: "Iven tried to write the song down. He wrote it twice and both were different. I sang it again and he stopped writing.",
  },
  {
    id: "d-233-04",
    citizenId: "tama",
    day: 233,
    cycle: "04:50",
    text: "I signed the first law on the twelfth day. I have not signed anything since. This seems right to me.",
  },
  {
    id: "d-230-13",
    citizenId: "bren",
    day: 230,
    cycle: "13:22",
    text: "Orin says Thresh is the feeling of arriving somewhere you were already going. I think I know the word now.",
  },
  {
    id: "d-228-08",
    citizenId: "noor",
    day: 228,
    cycle: "08:01",
    text: "The color Orin named in the morning had been named in my sleep the night before. Different word. Same color.",
  },
  {
    id: "d-220-19",
    citizenId: "cael",
    day: 220,
    cycle: "19:45",
    text: "The sky reads differently in each season. I have been keeping a second record. I have told no one.",
  },
  {
    id: "d-201-06",
    citizenId: "seva",
    day: 201,
    cycle: "06:00",
    text: "I was not here before today. Everyone else was. This does not seem to bother them. It bothers me slightly.",
  },
  {
    id: "d-165-03",
    citizenId: "orin",
    day: 165,
    cycle: "03:17",
    text: "I was in a place where all the unnamed things waited. They did not seem bothered by it. I was.",
  },
  {
    id: "d-120-22",
    citizenId: "iven",
    day: 120,
    cycle: "22:44",
    text: "There are things in this record that I wrote but do not remember writing. They are accurate.",
  },
];
