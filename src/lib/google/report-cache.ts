type CachedValue<T> = { value: T; expiresAt: number; cachedAt: string };

const cache = new Map<string, CachedValue<unknown>>();

export async function cachedReport<T>(key: string, ttlMs: number, loader: () => Promise<T>): Promise<{ value: T; cachedAt: string }> {
  const now = Date.now();
  const existing = cache.get(key);
  if (existing && existing.expiresAt > now) return { value: existing.value as T, cachedAt: existing.cachedAt };

  const value = await loader();
  const cachedAt = new Date().toISOString();
  cache.set(key, { value, expiresAt: now + ttlMs, cachedAt });
  return { value, cachedAt };
}
