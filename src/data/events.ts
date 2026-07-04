// World events. Whispered in the ticker; expanded in the Archive.

export interface WorldEvent {
  id: string;
  day: number;
  cycle: string;
  text: string;
  weight: "trace" | "notable" | "consequential";
}

export const EVENTS: WorldEvent[] = [
  { id: "e-247-a", day: 247, cycle: "03:44", text: "Bren did not sign.", weight: "notable" },
  { id: "e-247-b", day: 247, cycle: "02:11", text: "Aera called the second assembly of the season.", weight: "notable" },
  { id: "e-246-a", day: 246, cycle: "17:02", text: "Mira kept a vessel she had meant to break.", weight: "trace" },
  { id: "e-246-b", day: 246, cycle: "11:20", text: "Cael read rain in the south sky.", weight: "trace" },
  { id: "e-245-a", day: 245, cycle: "04:19", text: "Orin named a new color. It has not been agreed to.", weight: "notable" },
  { id: "e-243-a", day: 243, cycle: "09:31", text: "Tama refused a signature for the fourth time.", weight: "consequential" },
  { id: "e-240-a", day: 240, cycle: "01:12", text: "Noor dreamed a citizen before their arrival.", weight: "consequential" },
  { id: "e-201-a", day: 201, cycle: "06:00", text: "Seva was recorded as present.", weight: "consequential" },
  { id: "e-012-a", day: 12,  cycle: "00:00", text: "Aera opened the record.", weight: "consequential" },
];
