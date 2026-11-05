export const DHAKA_TIMEZONE = process.env.NEXT_PUBLIC_DEFAULT_TIMEZONE || 'Asia/Dhaka';

export function formatDhakaDate(
  date: Date | string | number,
  options: Intl.DateTimeFormatOptions = {
    dateStyle: 'medium',
    timeStyle: 'short',
  }
): string {
  const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  if (isNaN(d.getTime())) return 'Invalid date';

  return new Intl.DateTimeFormat('en-US', {
    ...options,
    timeZone: DHAKA_TIMEZONE,
  }).format(d);
}

export function formatDhakaDateOnly(date: Date | string | number): string {
  return formatDhakaDate(date, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDhakaWeekdayDate(date: Date | string | number): string {
  return formatDhakaDate(date, {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function getTodayDhakaDateString(): string {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: DHAKA_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  return formatter.format(now); // outputs YYYY-MM-DD
}
