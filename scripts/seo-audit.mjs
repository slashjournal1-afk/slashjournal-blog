let baseUrl = (process.env.SITE_URL || 'https://www.slashjournal.my.id').replace(/\/$/, '');

async function fetchResponse(url, options = {}) {
  const response = await fetch(url, { redirect: 'manual', ...options });
  return { response, body: await response.text() };
}

async function fetchEntryPoint(url) {
  const response = await fetch(url, { redirect: 'follow' });
  return { response, body: await response.text() };
}

function absoluteUrl(value) {
  return new URL(value, baseUrl).toString();
}

console.log(`=== AUDIT SEO & VERIFIKASI ADSENSE: ${baseUrl} ===`);

const failures = [];

// 1. Verifikasi Halaman Utama & Meta Tag AdSense
const homeResult = await fetchEntryPoint(absoluteUrl('/'));
if (!homeResult.response.ok) {
  failures.push(`Beranda gagal diakses: HTTP ${homeResult.response.status}`);
} else {
  // Verifikasi HTTPS
  if (baseUrl.startsWith('http://') && !baseUrl.includes('localhost')) {
    failures.push(`Situs tidak menggunakan HTTPS: ${baseUrl}`);
  }

  // Verifikasi Canonical Beranda
  const homeCanonical = homeResult.body.match(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/i)?.[1];
  if (homeCanonical && !homeCanonical.startsWith('https://')) {
    failures.push(`Canonical beranda tidak menggunakan HTTPS: ${homeCanonical}`);
  }

  // Verifikasi Meta Tag Akun AdSense (ca-pub-...)
  const adsenseMetaMatch = homeResult.body.match(/<meta[^>]+name="google-adsense-account"[^>]+content="([^"]+)"/i);
  if (!adsenseMetaMatch) {
    failures.push('Meta tag verifikasi "google-adsense-account" tidak ditemukan di beranda');
  } else {
    const pubAccount = adsenseMetaMatch[1];
    if (!pubAccount.startsWith('ca-pub-')) {
      failures.push(`Format google-adsense-account tidak valid (harus diawali ca-pub-): ${pubAccount}`);
    } else {
      console.log(`✓ Meta tag AdSense terverifikasi: ${pubAccount}`);
    }
  }
}

// 2. Verifikasi Sitemap & URL Terindeks
const sitemapResult = await fetchEntryPoint(absoluteUrl('/sitemap.xml'));
if (!sitemapResult.response.ok) throw new Error(`Sitemap gagal: HTTP ${sitemapResult.response.status}`);
baseUrl = new URL(sitemapResult.response.url).origin;

const sitemapUrls = [...sitemapResult.body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
const inboundLinks = new Map(sitemapUrls.map((url) => [url, 0]));

for (const url of sitemapUrls) {
  const result = await fetchResponse(url);
  const location = result.response.headers.get('location');
  if (!result.response.ok || location) {
    failures.push(`${url}: HTTP ${result.response.status}${location ? ` -> ${location}` : ''}`);
    continue;
  }

  const canonical = result.body.match(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/i)?.[1];
  const noindex = /<meta[^>]+name="robots"[^>]+content="[^"]*noindex/i.test(result.body);
  if (canonical && canonical !== url) failures.push(`${url}: canonical ${canonical}`);
  if (noindex) failures.push(`${url}: sitemap URL is noindex`);

  const hrefs = [...result.body.matchAll(/<a[^>]+href="([^"]+)"/gi)].map((match) => absoluteUrl(match[1]).split('#')[0]);
  for (const href of new Set(hrefs)) {
    if (inboundLinks.has(href) && href !== url) inboundLinks.set(href, inboundLinks.get(href) + 1);
  }
}

for (const [url, count] of inboundLinks) {
  if (url !== `${baseUrl}/` && count < 1) failures.push(`${url}: orphan candidate (0 internal links dari URL sitemap)`);
}

// 3. Verifikasi Robots.txt
const robotsResult = await fetchEntryPoint(absoluteUrl('/robots.txt'));
if (!robotsResult.response.ok || !robotsResult.body.includes(`${baseUrl}/sitemap.xml`)) {
  failures.push('robots.txt tidak menunjuk ke sitemap production');
}

console.log(`SEO audit: ${sitemapUrls.length} URL diperiksa pada ${baseUrl}`);
if (failures.length) {
  console.error('\n❌ Temuan Audit SEO:');
  console.error(failures.join('\n'));
  process.exitCode = 1;
} else {
  console.log('✅ SEO audit: tidak menemukan broken URL, redirect sitemap, canonical mismatch, atau noindex conflict.');
}
