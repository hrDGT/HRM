import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export const getError = (err: unknown, fallback: string) =>
  err instanceof Error ? err.message : fallback;

export const sortByField = <T>(
  data: T[],
  field: keyof T,
  order: "asc" | "desc"
): T[] => {
  return [...data].sort((a, b) => {
    const valA = String(a[field] || "");
    const valB = String(b[field] || "");

    return order === "asc"
      ? valA.localeCompare(valB)
      : valB.localeCompare(valA);
  });
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

