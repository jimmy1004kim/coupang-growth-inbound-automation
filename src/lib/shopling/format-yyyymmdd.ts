import { getKstTodayDate } from "@/lib/date/kst-today";

export function formatYyyyMmDd(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");

  return `${year}${month}${day}`;
}

export function getKstTodayYyyyMmDd(): string {
  return formatYyyyMmDd(getKstTodayDate());
}

export function subtractDaysFromKstDate(date: Date, days: number): Date {
  const result = new Date(date);
  result.setUTCDate(result.getUTCDate() - days);

  return result;
}
