import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { SECONDS_IN_MINUTE } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function minutesToSeconds(minutes: number) {
  return minutes * SECONDS_IN_MINUTE;
}

export function secondsToMinutes(seconds: number) {
  return seconds / SECONDS_IN_MINUTE;
}

export function formatTime(seconds: number) {
  return `${Math.floor(secondsToMinutes(seconds))
    .toString()
    .padStart(
      2,
      "0",
    )}:${(seconds % SECONDS_IN_MINUTE).toString().padStart(2, "0")}`;
}
