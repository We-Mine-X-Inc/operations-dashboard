import date from "date-and-time";

export const HALF_HOUR_IN_MILLIS = 30 * 60 * 1000;

export const ONE_HOUR_IN_MILLIS = 2 * HALF_HOUR_IN_MILLIS;

export function getLocalISOString(d: Date) {
  return date.format(d, "YYYY-MM-DDTHH:mm");
}
