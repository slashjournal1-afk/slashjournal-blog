import { Redis } from '@upstash/redis';

type MemoryEntry = { value: string; expiresAt: number };

const memoryCache = new Map<string, MemoryEntry>();

// Batasi memori agar tidak bocor di long-running server: FIFO sederhana.
const MEMORY_MAX_KEYS = 2000;

function memoryGet(key: string): string | null {
  const entry = memoryCache.get(key);
  if (!entry) return null;
  if (entry.expiresAt <= Date.now()) {
    memoryCache.delete(key);
    return null;
  }
  return entry.value;
}

function memorySet(key: string, value: string, ttlSeconds: number) {
  if (memoryCache.size >= MEMORY_MAX_KEYS) {
    const oldest = memoryCache.keys().next().value;
    if (oldest) memoryCache.delete(oldest);
  }
  memoryCache.set(key, { value, expiresAt: Date.now() + ttlSeconds * 1000 });
}

let redisClient: Redis | null | undefined;

function getRedis(): Redis | null {
  if (redisClient !== undefined) return redisClient;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    redisClient = null;
    return null;
  }
  try {
    redisClient = new Redis({ url, token });
  } catch (error) {
    console.warn('[analytics-cache] Redis init gagal, fallback memori:', error);
    redisClient = null;
  }
  return redisClient;
}

export function isRedisEnabled(): boolean {
  return getRedis() !== null;
}

/** Ambil JSON dari cache (Redis jika ada, else memori). Return null jika miss/error. */
export async function getAnalyticsCache<T>(key: string): Promise<{ value: T; cachedAt: string } | null> {
  const redis = getRedis();
  if (redis) {
    try {
      const raw = await redis.get<string | Record<string, unknown>>(key);
      if (!raw) return null;
      const parsed = (typeof raw === 'string' ? JSON.parse(raw) : raw) as { value: T; cachedAt: string };
      if (!parsed || typeof parsed !== 'object' || !('value' in parsed)) return null;
      return parsed;
    } catch (error) {
      console.warn('[analytics-cache] Redis GET gagal, lanjut tanpa cache:', error);
      return null;
    }
  }
  const raw = memoryGet(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as { value: T; cachedAt: string };
  } catch {
    return null;
  }
}

export async function setAnalyticsCache(key: string, value: unknown, ttlSeconds: number): Promise<void> {
  const payload = JSON.stringify({ value, cachedAt: new Date().toISOString() });
  const redis = getRedis();
  if (redis) {
    try {
      await redis.set(key, payload, { ex: ttlSeconds });
      return;
    } catch (error) {
      console.warn('[analytics-cache] Redis SET gagal, pakai memori:', error);
    }
  }
  memorySet(key, payload, ttlSeconds);
}

/**
 * Wrapper cache-then-load untuk respons analitik creator.
 * TTL default 300 detik (5 menit) sesuai rencana.
 */
export async function cachedAnalytics<T>(
  key: string,
  ttlSeconds: number,
  loader: () => Promise<T>,
): Promise<{ value: T; cachedAt: string; hit: boolean }> {
  const cached = await getAnalyticsCache<T>(key);
  if (cached) return { value: cached.value, cachedAt: cached.cachedAt, hit: true };
  const value = await loader();
  const cachedAt = new Date().toISOString();
  await setAnalyticsCache(key, value, ttlSeconds);
  return { value, cachedAt, hit: false };
}
