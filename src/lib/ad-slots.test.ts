import assert from 'node:assert/strict';
import test from 'node:test';
import { parseAdSlotPayload } from './ad-slots';

test('parses a valid manual ad payload', () => {
  assert.deepEqual(
    parseAdSlotPayload({
      slotName: 'leaderboard',
      title: 'Platform Engineering Week',
      description: 'A practical event for engineering teams.',
      sponsorName: 'Example Labs',
      targetUrl: 'https://example.com/event',
      ctaLabel: 'Lihat Program',
      imageUrl: '/uploads/ads/event.webp',
      isActive: true,
    }),
    {
      slotName: 'leaderboard',
      title: 'Platform Engineering Week',
      description: 'A practical event for engineering teams.',
      sponsorName: 'Example Labs',
      targetUrl: 'https://example.com/event',
      ctaLabel: 'Lihat Program',
      imageUrl: '/uploads/ads/event.webp',
      isActive: true,
    },
  );
});

test('rejects unsupported slots and non-HTTPS target URLs', () => {
  assert.throws(
    () =>
      parseAdSlotPayload({
        slotName: 'popup',
        title: 'Example',
        sponsorName: 'Example Labs',
        targetUrl: 'http://example.com',
      }),
    /Invalid enum|URL tujuan harus HTTPS/i,
  );
});
