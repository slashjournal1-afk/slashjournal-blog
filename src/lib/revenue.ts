import { prisma } from '@/lib/db';
import { runAdSenseRevenueReport } from '@/lib/google/adsense';
import { Decimal } from '@prisma/client/runtime/library';

const ZONE = 'Asia/Jakarta';

export function normalizeArticleUrl(value: string): string {
  const url = new URL(value, process.env.NEXT_PUBLIC_SITE_URL || 'https://www.slashjournal.my.id');
  url.protocol = 'https:';
  url.hostname = url.hostname.toLowerCase().replace(/^www\./, '');
  url.hash = '';
  for (const key of [...url.searchParams.keys()]) url.searchParams.delete(key);
  url.pathname = url.pathname.replace(/\/+$/, '') || '/';
  return url.toString();
}

export async function registerArticleRevenueIdentity(articleId: string, authorId: string, slug: string, title?: string) {
  const url = normalizeArticleUrl(`/${slug}`);
  const now = new Date();
  await prisma.$transaction(async (tx) => {
    const existing = await tx.articleUrl.findFirst({ where: { articleId, isCanonical: true, validTo: null } });
    if (!existing || existing.normalizedUrl !== url) {
      if (existing) await tx.articleUrl.update({ where: { id: existing.id }, data: { validTo: now, isCanonical: false } });
      await tx.articleUrl.create({ data: { articleId, url, normalizedUrl: url, validFrom: now, isCanonical: true } });
    }
    const ownership = await tx.articleOwnership.findFirst({ where: { articleId, authorId, effectiveTo: null } });
    if (!ownership) {
      await tx.articleOwnership.updateMany({ where: { articleId, effectiveTo: null }, data: { effectiveTo: now } });
      await tx.articleOwnership.create({ data: { articleId, authorId, ownershipPercent: 100, effectiveFrom: now } });
    }
  });
}

function jakartaDateParts(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: ZONE, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(date);
  return Object.fromEntries(parts.filter((part) => part.type !== 'literal').map((part) => [part.type, part.value])) as { year: string; month: string; day: string };
}

function jakartaDayBounds(offset: number) {
  const now = new Date();
  const parts = jakartaDateParts(now);
  const utcMidnight = new Date(Date.UTC(Number(parts.year), Number(parts.month) - 1, Number(parts.day) - 1 - offset));
  const start = new Date(utcMidnight.getTime() - 7 * 60 * 60 * 1000);
  const end = new Date(start.getTime() + 24 * 60 * 60 * 1000 - 1);
  return { start, end };
}

function decimal(value: string | number | Decimal | null | undefined) {
  return new Decimal(value?.toString() || '0');
}

export async function syncRevenueForDay(day = jakartaDayBounds(0).start, options: { force?: boolean } = {}) {
  const start = new Date(day);
  const end = new Date(start.getTime() + 24 * 60 * 60 * 1000 - 1);
  const account = await runAdSenseRevenueReport(start, end);
  const currencyCode = account.value.account.currencyCode || 'IDR';
  const period = await prisma.revenuePeriod.upsert({
    where: { periodStart_periodEnd_source_currencyCode: { periodStart: start, periodEnd: end, source: 'ADSENSE', currencyCode } },
    update: { status: 'FETCHING', retrievedAt: new Date() },
    create: { periodStart: start, periodEnd: end, status: 'FETCHING', currencyCode, retrievedAt: new Date() },
  });
  if (period.status === 'FINALIZED' && !options.force) {
    return { periodId: period.id, rowsFetched: 0, matchedRows: 0, unmatchedRows: 0, skipped: true };
  }
  const job = await prisma.revenueJobRun.create({ data: { revenuePeriodId: period.id, jobName: 'adsense-daily-sync', status: 'RUNNING' } });
  const urls = await prisma.articleUrl.findMany({ include: { article: { include: { ownershipHistory: { where: { effectiveFrom: { lte: end }, OR: [{ effectiveTo: null }, { effectiveTo: { gte: start } }] }, include: { author: true } } } } } });
  const urlMap = new Map(urls.map((item) => [item.normalizedUrl, item]));
  let matchedRows = 0;
  let unmatchedRows = 0;
  let matchedRevenue = decimal(0);
  const articleTotals = new Map<string, { revenue: Decimal; impressions: number; clicks: number; pageViews: number }>();

  await prisma.revenueSourceRow.deleteMany({ where: { revenuePeriodId: period.id } });
  for (const row of account.value.rows) {
    const normalizedUrl = row.pageUrl ? normalizeArticleUrl(row.pageUrl) : null;
    const match = normalizedUrl ? urlMap.get(normalizedUrl) : undefined;
    const rowRevenue = decimal(row.estimatedEarnings);
    if (match) {
      matchedRows++;
      matchedRevenue = matchedRevenue.add(rowRevenue);
      const current = articleTotals.get(match.articleId) || { revenue: decimal(0), impressions: 0, clicks: 0, pageViews: 0 };
      current.revenue = current.revenue.add(rowRevenue);
      current.impressions += row.impressions;
      current.clicks += row.clicks;
      current.pageViews += row.pageViews;
      articleTotals.set(match.articleId, current);
    } else unmatchedRows++;
    await prisma.revenueSourceRow.create({ data: { revenuePeriodId: period.id, reportDate: start, pageUrl: row.pageUrl, normalizedUrl, estimatedEarnings: rowRevenue, impressions: row.impressions, clicks: row.clicks, pageViews: row.pageViews, rpm: decimal(row.rpm), ctr: decimal(row.ctr), currencyCode, attributionStatus: match ? 'MATCHED' : 'UNMATCHED' } });
  }

  await prisma.$transaction(async (tx) => {
    await tx.articleRevenue.deleteMany({ where: { revenuePeriodId: period.id } });
    await tx.authorRevenue.deleteMany({ where: { revenuePeriodId: period.id } });
    const authors = new Map<string, { gross: Decimal; share: Decimal; platform: Decimal; name: string }>();
    for (const [articleId, total] of articleTotals) {
      const article = urlMap.get([...urlMap.entries()].find(([, item]) => item.articleId === articleId)?.[0] || '')?.article;
      if (!article) continue;
      const owner = article.ownershipHistory.find((item) => item.effectiveFrom <= end && (!item.effectiveTo || item.effectiveTo >= start)) || { authorId: article.authorId, ownershipPercent: decimal(100), author: { displayName: 'Unknown' } };
      const authorPercent = decimal(owner.ownershipPercent);
      const authorShare = total.revenue.mul(authorPercent).div(100).mul(0.8);
      const platformShare = total.revenue.sub(authorShare);
      await tx.articleRevenue.create({ data: { revenuePeriodId: period.id, articleId, grossRevenue: total.revenue, authorShare, impressions: total.impressions, clicks: total.clicks, pageViews: total.pageViews, titleSnapshot: article.title, slugSnapshot: article.slug, authorSnapshot: owner.author.displayName } });
      const current = authors.get(owner.authorId) || { gross: decimal(0), share: decimal(0), platform: decimal(0), name: owner.author.displayName };
      current.gross = current.gross.add(total.revenue); current.share = current.share.add(authorShare); current.platform = current.platform.add(platformShare); authors.set(owner.authorId, current);
    }
    for (const [authorId, total] of authors) await tx.authorRevenue.create({ data: { revenuePeriodId: period.id, authorId, grossAttributedRevenue: total.gross, authorShare: total.share, platformShare: total.platform, payableAmount: total.share, authorSnapshot: total.name } });
    await tx.revenuePeriod.update({ where: { id: period.id }, data: { status: 'PROVISIONAL', accountGrossRevenue: decimal(account.value.account.estimatedEarnings), knownAttributedRevenue: matchedRevenue, unattributedRevenue: decimal(account.value.account.estimatedEarnings).sub(matchedRevenue), authorShareTotal: authors.size ? [...authors.values()].reduce((sum, item) => sum.add(item.share), decimal(0)) : decimal(0), platformShareTotal: authors.size ? [...authors.values()].reduce((sum, item) => sum.add(item.platform), decimal(0)) : decimal(0), retrievedAt: new Date() } });
  });
  await prisma.revenueJobRun.update({ where: { id: job.id }, data: { status: 'SUCCESS', rowsFetched: account.value.rows.length, rowsMatched: matchedRows, rowsUnmatched: unmatchedRows, completedAt: new Date() } });
  return { periodId: period.id, rowsFetched: account.value.rows.length, matchedRows, unmatchedRows, skipped: false };
}

export async function syncRollingRevenue() {
  const results = [];
  for (const offset of [0, 1, 2, 6]) results.push(await syncRevenueForDay(jakartaDayBounds(offset).start));
  return results;
}

export async function finalizeRevenuePeriod(periodId: string) {
  const period = await prisma.revenuePeriod.findUnique({ where: { id: periodId } });
  if (!period) throw new Error('Revenue period not found');
  if (period.status === 'FINALIZED') return period;
  if (period.status === 'FAILED' || period.status === 'FETCHING') throw new Error('Revenue period is not ready to finalize');
  return prisma.revenuePeriod.update({ where: { id: periodId }, data: { status: 'FINALIZED', finalizedAt: new Date() } });
}
