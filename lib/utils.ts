import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export const getError = (err: unknown, fallback: string) =>
  err instanceof Error ? err.message : fallback;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
