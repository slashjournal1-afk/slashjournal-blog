import assert from 'node:assert/strict';
import test from 'node:test';
import { rateLimitAsync } from './rate-limit';

// Tanpa env UPSTASH_* (tidak dimuat oleh test runner), rateLimitAsync
// harus fallback ke bucket memori dan menegakkan limit yang sama.
test('rateLimitAsync menegakkan limit via fallback memori', async () => {
  const key = `test:${Date.now()}:${Math.random()}`;
  assert.equal(await rateLimitAsync(key, 2, 60_000), true);
  assert.equal(await rateLimitAsync(key, 2, 60_000), true);
  assert.equal(await rateLimitAsync(key, 2, 60_000), false);
});

test('rateLimitAsync memakai window terpisah per key', async () => {
  const base = `test:${Date.now()}:${Math.random()}`;
  assert.equal(await rateLimitAsync(`${base}:a`, 1, 60_000), true);
  assert.equal(await rateLimitAsync(`${base}:a`, 1, 60_000), false);
  assert.equal(await rateLimitAsync(`${base}:b`, 1, 60_000), true);
});
