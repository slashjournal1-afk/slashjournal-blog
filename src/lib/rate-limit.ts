import { getRedis } from '@/lib/analytics-cache';

const buckets = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const current = buckets.get(key);
  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (current.count >= limit) return false;
  current.count += 1;
  return true;
}

const REDIS_KEY_PREFIX = 'ratelimit:';

/**
 * Rate limit global lintas instance via Redis (fallback ke memori jika
 * Redis tidak dikonfigurasi / error). Fixed window: key dibuat dengan TTL
 * sekali via SET NX agar tidak ada key yatim tanpa expiry.
 */
export async function rateLimitAsync(key: string, limit: number, windowMs: number): Promise<boolean> {
  const redis = getRedis();
  if (!redis) return rateLimit(key, limit, windowMs);
  const redisKey = `${REDIS_KEY_PREFIX}${key}`;
  const windowSeconds = Math.max(1, Math.ceil(windowMs / 1000));
  try {
    const created = await redis.set(redisKey, 1, { ex: windowSeconds, nx: true });
    if (created === 'OK') return true;
    const count = await redis.incr(redisKey);
    return count <= limit;
  } catch {
    return rateLimit(key, limit, windowMs);
  }
}

export function requestKey(request: Request, scope: string): string {
  return `${scope}:${request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'}`;
}
