import { getAnalyticsCache, setAnalyticsCache } from '@/lib/analytics-cache';

/**
 * Cache laporan Google (GA4/AdSense) via Redis jika tersedia, else memori.
 * Map in-memory lama tidak pernah hit di serverless (cold start / multi-instance),
 * sehingga tiap kunjungan dashboard admin selalu menembak Google API.
 */
export async function cachedReport<T>(key: string, ttlMs: number, loader: () => Promise<T>): Promise<{ value: T; cachedAt: string }> {
  const cached = await getAnalyticsCache<T>(key);
  if (cached) return cached;

  const value = await loader();
  const cachedAt = new Date().toISOString();
  await setAnalyticsCache(key, value, Math.max(1, Math.ceil(ttlMs / 1000)));
  return { value, cachedAt };
}
