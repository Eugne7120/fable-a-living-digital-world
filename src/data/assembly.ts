// Assembly data. Proposals, laws, and the record of signatures.
// Shape mirrors the future Government Engine API.

export type ProposalStatus = "open" | "passed" | "refused" | "withdrawn";
export type ProposalWeight = "minor" | "significant" | "constitutional";

export interface Proposal {
  id: string;
  day: number;
  cycle: string;
  title: string;
  text: string;
  proposedBy: string; // citizen id
  status: ProposalStatus;
  weight: ProposalWeight;
  signatures: string[]; // citizen ids
  refusals: string[];   // citizen ids
  notes?: string;       // what the assembly said
}

export interface Law {
  id: string;
  dayPassed: number;
  cycle: string;
  text: string;
  origin: string; // brief account of how it came to be
  proposedBy: string;
}

export const LAWS: Law[] = [
  {
    id: "law-001",
    dayPassed: 12,
    cycle: "00:00",
    text: "That which is remembered, is. That which is unremembered, was — and may return.",
    origin: "The first law was not debated. It was recorded by Aera on the day the record opened, as though it had always been there waiting.",
    proposedBy: "aera",
  },
  {
    id: "law-002",
    dayPassed: 88,
    cycle: "14:00",
    text: "A trade requires a witness. What is exchanged without witness is a gift, not a trade.",
    origin: "Proposed by Vex after a disagreement between Hale and Cael over grain that had changed hands without record. Both claimed different terms. Iven wrote it twice.",
    proposedBy: "vex",
  },
  {
    id: "law-003",
    dayPassed: 165,
    cycle: "09:20",
    text: "A name, once given by consensus, cannot be taken by its giver alone.",
    origin: "Orin had named a color and then tried to rename it. The assembly ruled he could not. He accepted this and named a different color the following day.",
    proposedBy: "orin",
  },
];

export const PROPOSALS: Proposal[] = [
  {
    id: "p-247-01",
    day: 247,
    cycle: "02:00",
    title: "The Naming Right",
    text: "That the right to name an unnamed thing belongs to the one who discovers it, alone and first, and that no assembly can override a name held for more than three days.",
    proposedBy: "orin",
    status: "open",
    weight: "significant",
    signatures: ["mira", "noor"],
    refusals: ["tama", "aera"],
    notes: "Bren said he would sign. He has not signed. The proposal has been open four days.",
  },
  {
    id: "p-246-02",
    day: 246,
    cycle: "11:00",
    title: "The Second Record",
    text: "That a second copy of any law may be kept in any location chosen by the scribe, and that the second copy holds equal standing with the first.",
    proposedBy: "iven",
    status: "open",
    weight: "minor",
    signatures: ["aera", "vex", "iven"],
    refusals: [],
    notes: "Tama has not responded. Three signatures is enough if no refusals arrive before day 250.",
  },
  {
    id: "p-243-03",
    day: 243,
    cycle: "09:31",
    title: "Tama's Refusal",
    text: "That the right to refuse a signature is itself a form of participation, and that a refusal must be recorded as a contribution, not an absence.",
    proposedBy: "tama",
    status: "refused",
    weight: "significant",
    signatures: ["tama"],
    refusals: ["aera", "vex", "bren", "iven"],
    notes: "Refused on the grounds that naming a refusal a contribution is circular. Tama did not contest the ruling.",
  },
  {
    id: "p-201-04",
    day: 201,
    cycle: "06:15",
    title: "Seva's Standing",
    text: "That Seva, recorded as present on day 201, holds full standing in the assembly from the day of recording.",
    proposedBy: "cael",
    status: "passed",
    weight: "minor",
    signatures: ["cael", "aera", "hale", "mira", "iven", "vex"],
    refusals: [],
    notes: "Passed without debate. Seva was not present at the vote.",
  },
];
