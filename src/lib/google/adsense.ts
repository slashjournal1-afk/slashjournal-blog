import { google } from 'googleapis';
import { createAdSenseAuth } from './auth';
import { cachedReport } from './report-cache';
import { normalizeAdSenseReport, type AdSenseSummary } from './report-normalizers';

function accountId() {
  return process.env.GOOGLE_ADSENSE_ACCOUNT_ID || process.env.ADSENSE_ACCOUNT_ID || '';
}

export async function runAdSenseReport(range: 'today' | '7d' | '28d' | '90d') {
  const account = accountId();
  if (!account) throw new Error('GOOGLE_ADSENSE_ACCOUNT_ID is not configured');
  return cachedReport(`adsense:report:${account}:${range}`, 15 * 60_000, async (): Promise<AdSenseSummary> => {
    const client = google.adsense({ version: 'v2', auth: createAdSenseAuth() });
    const end = new Date();
    const start = new Date(end);
    start.setDate(end.getDate() - (range === 'today' ? 0 : Number(range.replace('d', ''))));
    const response = await client.accounts.reports.generate({
      account: account.startsWith('accounts/') ? account : `accounts/${account}`,
      'startDate.year': start.getUTCFullYear(),
      'startDate.month': start.getUTCMonth() + 1,
      'startDate.day': start.getUTCDate(),
      'endDate.year': end.getUTCFullYear(),
      'endDate.month': end.getUTCMonth() + 1,
      'endDate.day': end.getUTCDate(),
      metrics: ['ESTIMATED_EARNINGS', 'IMPRESSIONS', 'CLICKS', 'PAGE_VIEWS', 'PAGE_VIEWS_RPM', 'PAGE_VIEWS_CTR'],
    });
    return normalizeAdSenseReport(response.data);
  });
}

export type AdSenseRevenueRow = {
  date: string;
  pageUrl: string | null;
  estimatedEarnings: string;
  impressions: number;
  clicks: number;
  pageViews: number;
  rpm: number;
  ctr: number;
};

function reportAccount() {
  const account = accountId();
  if (!account) throw new Error('GOOGLE_ADSENSE_ACCOUNT_ID is not configured');
  return account.startsWith('accounts/') ? account : `accounts/${account}`;
}

function reportDate(value: Date) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(value);
  const date = Object.fromEntries(parts.filter((part) => part.type !== 'literal').map((part) => [part.type, part.value]));
  return { year: Number(date.year), month: Number(date.month), day: Number(date.day) };
}

function parseRows(data: { headers?: Array<{ name?: string | null }>; rows?: Array<{ cells?: Array<{ value?: string | null }> }> }): AdSenseRevenueRow[] {
  const headers = (data.headers || []).map((header) => header.name || '');
  return (data.rows || []).map((row) => {
    const values = row.cells?.map((cell) => cell.value || '') || [];
    const get = (name: string) => values[headers.indexOf(name)] || '';
    return {
      date: get('DATE'),
      pageUrl: get('PAGE_URL') || null,
      estimatedEarnings: get('ESTIMATED_EARNINGS'),
      impressions: Number(get('IMPRESSIONS') || 0),
      clicks: Number(get('CLICKS') || 0),
      pageViews: Number(get('PAGE_VIEWS') || 0),
      rpm: Number(get('PAGE_VIEWS_RPM') || 0),
      ctr: Number(get('PAGE_VIEWS_CTR') || 0),
    };
  });
}

export async function runAdSenseRevenueReport(start: Date, end: Date) {
  return cachedReport(`adsense:revenue:${reportAccount()}:${start.toISOString()}:${end.toISOString()}`, 15 * 60_000, async () => {
    const client = google.adsense({ version: 'v2', auth: createAdSenseAuth() });
    const base = {
      account: reportAccount(),
      'startDate.year': reportDate(start).year,
      'startDate.month': reportDate(start).month,
      'startDate.day': reportDate(start).day,
      'endDate.year': reportDate(end).year,
      'endDate.month': reportDate(end).month,
      'endDate.day': reportDate(end).day,
      metrics: ['ESTIMATED_EARNINGS', 'IMPRESSIONS', 'CLICKS', 'PAGE_VIEWS', 'PAGE_VIEWS_RPM', 'PAGE_VIEWS_CTR'],
    };
    const [accountReport, pageReport] = await Promise.all([
      client.accounts.reports.generate(base),
      client.accounts.reports.generate({ ...base, dimensions: ['DATE', 'PAGE_URL'], limit: 100000 }),
    ]);
    return { account: normalizeAdSenseReport(accountReport.data), rows: parseRows(pageReport.data) };
  });
}
