import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/** Utility Tailwind — gabung class + resolve conflict */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
