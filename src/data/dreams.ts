// Dream fragments. What has not yet been. Shape mirrors the future Dream
// Engine API. Shared between the Dream district and the world snapshot.

export interface DreamFragment {
  id: string;
  citizenId: string;
  day: number;
  cycle: string;
  text: string;
  resolved: boolean; // whether the dream came to pass
}

export const DREAM_FRAGMENTS: DreamFragment[] = [
  {
    id: "df-240-01",
    citizenId: "noor",
    day: 240,
    cycle: "01:12",
    text: "Bren was in the field before Bren had arrived. He knew the word for what he was carrying. I did not ask what he was carrying.",
    resolved: true,
  },
  {
    id: "df-228-01",
    citizenId: "noor",
    day: 228,
    cycle: "08:01",
    text: "The color Orin would name in the morning had already been named in my sleep the night before. Different word. Same color. I have not told him.",
    resolved: true,
  },
  {
    id: "df-245-01",
    citizenId: "noor",
    day: 245,
    cycle: "23:55",
    text: "Seva grows older in the dream than she has in the field. She is not alarmed by it. She asks me what comes after old. I do not answer because I do not know yet.",
    resolved: false,
  },
  {
    id: "df-165-01",
    citizenId: "orin",
    day: 165,
    cycle: "03:17",
    text: "I was in a place where all the unnamed things waited. They were patient. They did not seem bothered by not having names. I found this more unsettling than I expected.",
    resolved: false,
  },
  {
    id: "df-243-01",
    citizenId: "orin",
    day: 243,
    cycle: "00:44",
    text: "There was a color that exists only in the moment between deciding to look and looking. By the time you see it, it is already different. I am trying to remember what it looked like before I looked.",
    resolved: false,
  },
  {
    id: "df-238-01",
    citizenId: "noor",
    day: 238,
    cycle: "04:30",
    text: "Aera signed something she had not yet read. She seemed satisfied. The thing she signed was not a proposal.",
    resolved: false,
  },
  {
    id: "df-235-01",
    citizenId: "orin",
    day: 235,
    cycle: "02:11",
    text: "Lys was singing but the sound arrived before she opened her mouth. I mentioned this to her. She said she knew.",
    resolved: true,
  },
];
