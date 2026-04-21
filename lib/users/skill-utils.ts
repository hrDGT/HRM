export type MasteryLevel = "Novice" | "Advanced" | "Competent" | "Proficient" | "Expert";

export const MASTERY_ORDER: MasteryLevel[] = [
  "Novice",
  "Advanced",
  "Competent",
  "Proficient",
  "Expert",
];

export function getMasteryProgress(mastery: MasteryLevel): number {
  const index = MASTERY_ORDER.indexOf(mastery);
  if (index === -1) return 0;
  return (index / (MASTERY_ORDER.length - 1)) * 100;
}

export function getMasteryColor(mastery: MasteryLevel): string {
  const index = MASTERY_ORDER.indexOf(mastery);
  if (index === -1) return "rgb(0, 206, 48)";

  const ratio = index / (MASTERY_ORDER.length - 1);
  const r = Math.round(0 + 206 * ratio);
  const g = Math.round(206 - 206 * ratio);
  const b = 48;

  return `rgb(${r}, ${g}, ${b})`;
}

export function getMasteryDimColor(mastery: MasteryLevel): string {
  const index = MASTERY_ORDER.indexOf(mastery);
  if (index === -1) return "rgb(0, 100, 25)";

  const ratio = index / (MASTERY_ORDER.length - 1);
  const r = Math.round((206 * ratio) * 0.5);
  const g = Math.round((206 - 206 * ratio) * 0.5);
  const b = Math.round(48 * 0.5);

  return `rgb(${r}, ${g}, ${b})`;
}

export function getMasteryVisuals(mastery: MasteryLevel) {
  return {
    progress: getMasteryProgress(mastery),
    color: getMasteryColor(mastery),
    dimColor: getMasteryDimColor(mastery),
  };
}
