export const ANALYTICS_TIMEZONE = 'Asia/Jakarta';

/** Ambil komponen Y-M-D di zona Asia/Jakarta untuk sebuah instant. */
export function jakartaYmd(date: Date = new Date()): { year: number; month: number; day: number } {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: ANALYTICS_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value || 0);
  return { year: get('year'), month: get('month'), day: get('day') };
}

/**
 * Bucket harian = tengah malam WIB disimpan sebagai UTC.
 * WIB = UTC+7 (tanpa DST), jadi 00:00 WIB == 17:00 UTC hari sebelumnya.
 */
export function jakartaDayBucket(date: Date = new Date()): Date {
  const { year, month, day } = jakartaYmd(date);
  return new Date(Date.UTC(year, month - 1, day, -7, 0, 0, 0));
}

/** Parse YYYY-MM-DD sebagai bucket WIB; return null jika invalid. */
export function parseJakartaDay(value: string | null | undefined): Date | null {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [y, m, d] = value.split('-').map(Number);
  if (!y || !m || !d || m < 1 || m > 12 || d < 1 || d > 31) return null;
  const bucket = new Date(Date.UTC(y, m - 1, d, -7, 0, 0, 0));
  return Number.isNaN(bucket.getTime()) ? null : bucket;
}

/** Format bucket menjadi YYYY-MM-DD (zona WIB) untuk key API/URL. */
export function formatJakartaDay(date: Date): string {
  const { year, month, day } = jakartaYmd(date);
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

/** Label pendek id-ID, mis. "12 Sep". */
export function formatDayLabel(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', timeZone: ANALYTICS_TIMEZONE }).format(d);
}

/** Nama hari id-ID, mis. "Senin". */
export function formatWeekday(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('id-ID', { weekday: 'long', timeZone: ANALYTICS_TIMEZONE }).format(d);
}

export const WEEKDAY_LABELS = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

/** Index 0 (Minggu) - 6 (Sabtu) di zona WIB. */
export function jakartaWeekdayIndex(date: Date | string): number {
  const d = typeof date === 'string' ? new Date(date) : date;
  const weekday = new Intl.DateTimeFormat('en-US', { weekday: 'short', timeZone: ANALYTICS_TIMEZONE }).format(d);
  return { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }[weekday] ?? 0;
}

/** Clamp rentang: default 28 hari, maks 90 hari. */
export function clampDayRange(from: Date | null, to: Date | null): { from: Date; to: Date } {
  const today = jakartaDayBucket(new Date());
  const end = to && to <= today ? to : today;
  const maxSpanMs = 90 * 24 * 60 * 60 * 1000;
  const defaultFrom = new Date(end.getTime() - 27 * 24 * 60 * 60 * 1000);
  let start = from || defaultFrom;
  if (start > end) start = end;
  if (end.getTime() - start.getTime() > maxSpanMs) start = new Date(end.getTime() - maxSpanMs + (24 * 60 * 60 * 1000 - 1));
  return { from: start, to: end };
}
