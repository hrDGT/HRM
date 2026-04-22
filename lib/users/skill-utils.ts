export type MasteryLevel = "Novice" | "Advanced" | "Competent" | "Proficient" | "Expert";

export const MASTERY_ORDER: MasteryLevel[] = [
  "Novice",
  "Advanced",
  "Competent",
  "Proficient",
  "Expert",
];

const MASTERY_COLORS = [
  "158, 158, 158",
  "3, 169, 244",
  "76, 175, 80",
  "255, 179, 0",
  "198, 48, 49",
];

export function getMasteryProgress(mastery: MasteryLevel): number {
  const index = MASTERY_ORDER.indexOf(mastery);
  if (index === -1) return 0;

  return ((index + 1) / MASTERY_ORDER.length) * 100;
}

export function getMasteryColor(mastery: MasteryLevel): string {
  const index = MASTERY_ORDER.indexOf(mastery);
  if (index === -1) return `rgb(${MASTERY_COLORS[0]})`;

  return `rgb(${MASTERY_COLORS[index]})`;
}

export function getMasteryDimColor(mastery: MasteryLevel): string {
  const index = MASTERY_ORDER.indexOf(mastery);
  if (index === -1) return `rgba(${MASTERY_COLORS[0]}, 0.2)`;

  return `rgba(${MASTERY_COLORS[index]}, 0.2)`;
}

export function getMasteryVisuals(mastery: MasteryLevel) {
  return {
    progress: getMasteryProgress(mastery),
    color: getMasteryColor(mastery),
    dimColor: getMasteryDimColor(mastery),
  };
}