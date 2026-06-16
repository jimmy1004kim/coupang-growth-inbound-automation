import { getKstTodayDate } from "@/lib/date/kst-today";
import { subtractDaysFromKstDate } from "@/lib/shopling/format-yyyymmdd";

export const NEW_OPTION_PRODUCTS_DAY_PRESETS = [7, 14, 30, 60, 90] as const;
export const NEW_OPTION_PRODUCTS_DEFAULT_DAYS = 7;

export type NewOptionProductsDayPreset =
  (typeof NEW_OPTION_PRODUCTS_DAY_PRESETS)[number];

export type ResolvedNewOptionProductsDateRange = {
  from: string;
  to: string;
  days: NewOptionProductsDayPreset | null;
};

export type ResolveNewOptionProductsDateRangeInput = {
  from?: string;
  to?: string;
  days?: string | number;
};

function toIsoDateString(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function parseIsoDate(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());

  if (!match) {
    return null;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }

  return date;
}

function parseDayPreset(
  value: string | number | undefined,
): NewOptionProductsDayPreset | null {
  const parsed =
    typeof value === "number" ? value : Number.parseInt(String(value ?? ""), 10);

  if (!Number.isFinite(parsed)) {
    return null;
  }

  return NEW_OPTION_PRODUCTS_DAY_PRESETS.includes(
    parsed as NewOptionProductsDayPreset,
  )
    ? (parsed as NewOptionProductsDayPreset)
    : null;
}

function resolvePresetRange(
  days: NewOptionProductsDayPreset,
  today: Date,
): ResolvedNewOptionProductsDateRange {
  const to = toIsoDateString(today);
  const from = toIsoDateString(subtractDaysFromKstDate(today, days - 1));

  return { from, to, days };
}

export function resolveNewOptionProductsDateRange(
  input: ResolveNewOptionProductsDateRangeInput = {},
  today: Date = getKstTodayDate(),
): ResolvedNewOptionProductsDateRange {
  const fromDate = input.from ? parseIsoDate(input.from) : null;
  const toDate = input.to ? parseIsoDate(input.to) : null;

  if (fromDate && toDate && fromDate.getTime() <= toDate.getTime()) {
    return {
      from: toIsoDateString(fromDate),
      to: toIsoDateString(toDate),
      days: null,
    };
  }

  const preset =
    parseDayPreset(input.days) ?? NEW_OPTION_PRODUCTS_DEFAULT_DAYS;

  return resolvePresetRange(preset, today);
}
