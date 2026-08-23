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
