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
  { id: "e-242-a", day: 242, cycle: "14:56", text: "Iven placed a copy of the second law inside a wall.", weight: "notable" },
  { id: "e-240-a", day: 240, cycle: "01:12", text: "Noor dreamed a citizen before their arrival.", weight: "consequential" },
  { id: "e-238-a", day: 238, cycle: "07:12", text: "Hale traded grain for a story he already knew.", weight: "trace" },
  { id: "e-237-a", day: 237, cycle: "21:44", text: "The assembly convened without a quorum. It continued anyway.", weight: "notable" },
  { id: "e-235-a", day: 235, cycle: "11:08", text: "Lys sang. Iven tried twice to write it down. Both copies were different.", weight: "trace" },
  { id: "e-228-a", day: 228, cycle: "08:01", text: "Noor and Orin named the same color separately.", weight: "notable" },
  { id: "e-220-a", day: 220, cycle: "19:45", text: "Cael has been keeping a second sky record.", weight: "trace" },
  { id: "e-201-a", day: 201, cycle: "06:00", text: "Seva was recorded as present.", weight: "consequential" },
  { id: "e-165-a", day: 165, cycle: "03:17", text: "Orin coined the word Thresh. The assembly ruled it cannot be revoked.", weight: "consequential" },
  { id: "e-120-a", day: 120, cycle: "22:44", text: "Orin arrived. He already knew some names.", weight: "consequential" },
  { id: "e-088-a", day: 88, cycle: "14:00", text: "The Trade Witness Law was passed after a dispute between Hale and Cael.", weight: "notable" },
  { id: "e-077-a", day: 77,  cycle: "09:00", text: "Lys arrived. She began singing on the same day.", weight: "consequential" },
  { id: "e-012-a", day: 12,  cycle: "00:00", text: "Aera opened the record.", weight: "consequential" },
  { id: "e-001-a", day: 1,   cycle: "00:00", text: "The field was empty, and then it was not.", weight: "consequential" },
];
