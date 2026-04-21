export type ProficiencyLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2" | "Native";

export const PROFICIENCY_ORDER: ProficiencyLevel[] = [
  "A1",
  "A2",
  "B1",
  "B2",
  "C1",
  "C2",
  "Native",
];

export function getProficiencyColor(proficiency: ProficiencyLevel): string {
  const index = PROFICIENCY_ORDER.indexOf(proficiency);
  if (index === -1) return "rgb(0, 206, 48)";

  const ratio = index / (PROFICIENCY_ORDER.length - 1);
  const r = Math.round(0 + 206 * ratio);
  const g = Math.round(206 - 206 * ratio);
  const b = 48;

  return `rgb(${r}, ${g}, ${b})`;
}
