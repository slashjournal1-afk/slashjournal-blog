import assert from 'node:assert/strict';
import test from 'node:test';
import { AD_SLOT_CONFIG, AD_SLOT_NAMES, getDummyAdImage, parseAdSlotPayload } from './ad-slots';

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

test('accepts the top banner and below hero slots', () => {
  for (const slotName of ['top_banner', 'below_hero'] as const) {
    const payload = parseAdSlotPayload({
      slotName,
      title: 'Kampanye Sponsor',
      sponsorName: 'Example Labs',
      targetUrl: 'https://example.com/campaign',
      ctaLabel: 'Pelajari Penawaran',
    });
    assert.equal(payload.slotName, slotName);
    assert.equal(payload.isActive, true);
  }
});

test('defines a complete config for every ad slot', () => {
  assert.deepEqual([...AD_SLOT_NAMES].sort(), Object.keys(AD_SLOT_CONFIG).sort());
  for (const name of AD_SLOT_NAMES) {
    const config = AD_SLOT_CONFIG[name];
    assert.ok(config.aspectClass.includes('aspect-['), `${name} harus punya kelas aspect ratio`);
    assert.ok(config.creativeWidth > 0 && config.creativeHeight > 0, `${name} harus punya spesifikasi kreatif`);
    assert.ok(['bar', 'stack'].includes(config.contentLayout), `${name} layout konten tidak valid`);
    assert.ok(config.sizes.length > 0, `${name} harus punya atribut sizes`);
  }
});

test('reserves top banner for manual creatives only', () => {
  assert.equal(AD_SLOT_CONFIG.top_banner.adsenseAllowed, false);
  assert.equal(AD_SLOT_CONFIG.below_hero.adsenseAllowed, true);
  assert.equal(AD_SLOT_CONFIG.leaderboard.adsenseAllowed, true);
  assert.equal(AD_SLOT_CONFIG.in_feed.adsenseAllowed, true);
  assert.equal(AD_SLOT_CONFIG.sidebar_sticky.adsenseAllowed, true);
});

test('maps dummy images by orientation', () => {
  assert.equal(getDummyAdImage('sidebar_sticky'), '/vertical_dummy_ads.webp');
  assert.equal(getDummyAdImage('top_banner'), '/horizontal_dummy_ads.webp');
  assert.equal(getDummyAdImage('below_hero'), '/horizontal_dummy_ads.webp');
});
