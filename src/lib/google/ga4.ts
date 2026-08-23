import { google } from 'googleapis';
import { createAnalyticsAuth } from './auth';
import { cachedReport } from './report-cache';

export type GoogleDateRange = 'today' | '7d' | '28d' | '90d';

type ReportResponse = {
  data: {
    rows?: Array<{
      dimensionValues?: Array<{ value?: string | null }>;
      metricValues?: Array<{ value?: string | null }>;
    }>;
  };
};

export type Ga4Summary = {
  users: number;
  newUsers: number;
  sessions: number;
  pageViews: number;
  events: number;
  engagementRate: number;
  averageSessionDuration: number;
};

export type Ga4EventRow = { name: string; eventCount: number; users: number };
export type Ga4PageRow = { path: string; title: string; pageViews: number; users: number; averageSessionDuration: number };

function propertyId() {
  return process.env.GOOGLE_ANALYTICS_PROPERTY_ID || process.env.GA4_PROPERTY_ID || '';
}

function dateRange(range: GoogleDateRange) {
  const startDate = range === 'today' ? 'today' : `${Number(range.slice(0, -1)) - 1}daysAgo`;
  return [{ startDate, endDate: 'today' }];
}

function getRows(response: ReportResponse) {
  return response.data.rows || [];
}

function metric(row: { metricValues?: Array<{ value?: string | null }> }, index: number) {
  return Number(row.metricValues?.[index]?.value || 0);
}

function dimension(row: { dimensionValues?: Array<{ value?: string | null }> }, index: number) {
  return row.dimensionValues?.[index]?.value || '';
}

function createClient() {
  const property = propertyId();
  if (!property) throw new Error('GOOGLE_ANALYTICS_PROPERTY_ID is not configured');
  return { property: `properties/${property}`, client: google.analyticsdata({ version: 'v1beta', auth: createAnalyticsAuth() }) };
}

export async function runGa4Summary(range: GoogleDateRange) {
  const property = propertyId();
  if (!property) throw new Error('GOOGLE_ANALYTICS_PROPERTY_ID is not configured');

  return cachedReport(`ga4:summary:${property}:${range}`, 5 * 60_000, async (): Promise<Ga4Summary> => {
    const { property: resource, client } = createClient();
    const response = await client.properties.runReport({
      property: resource,
      requestBody: {
        dateRanges: dateRange(range),
        metrics: [
          { name: 'totalUsers' },
          { name: 'newUsers' },
          { name: 'sessions' },
          { name: 'screenPageViews' },
          { name: 'eventCount' },
          { name: 'engagementRate' },
          { name: 'averageSessionDuration' },
        ],
        limit: '1',
      },
    });
    const row = getRows(response)[0];
    return {
      users: metric(row || {}, 0),
      newUsers: metric(row || {}, 1),
      sessions: metric(row || {}, 2),
      pageViews: metric(row || {}, 3),
      events: metric(row || {}, 4),
      engagementRate: metric(row || {}, 5),
      averageSessionDuration: metric(row || {}, 6),
    };
  });
}

export async function runGa4Events(range: GoogleDateRange) {
  const property = propertyId();
  if (!property) throw new Error('GOOGLE_ANALYTICS_PROPERTY_ID is not configured');

  return cachedReport(`ga4:events:${property}:${range}`, 10 * 60_000, async (): Promise<Ga4EventRow[]> => {
    const { property: resource, client } = createClient();
    const response = await client.properties.runReport({
      property: resource,
      requestBody: {
        dateRanges: dateRange(range),
        dimensions: [{ name: 'eventName' }],
        metrics: [{ name: 'eventCount' }, { name: 'totalUsers' }],
        orderBys: [{ metric: { metricName: 'eventCount' }, desc: true }],
        limit: '100',
      },
    });
    return getRows(response).map((row) => ({ name: dimension(row, 0), eventCount: metric(row, 0), users: metric(row, 1) }));
  });
}

export async function runGa4Pages(range: GoogleDateRange) {
  const property = propertyId();
  if (!property) throw new Error('GOOGLE_ANALYTICS_PROPERTY_ID is not configured');

  return cachedReport(`ga4:pages:${property}:${range}`, 10 * 60_000, async (): Promise<Ga4PageRow[]> => {
    const { property: resource, client } = createClient();
    const response = await client.properties.runReport({
      property: resource,
      requestBody: {
        dateRanges: dateRange(range),
        dimensions: [{ name: 'pagePath' }, { name: 'pageTitle' }],
        metrics: [{ name: 'screenPageViews' }, { name: 'totalUsers' }, { name: 'averageSessionDuration' }],
        orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
        limit: '20',
      },
    });
    return getRows(response).map((row) => ({ path: dimension(row, 0), title: dimension(row, 1), pageViews: metric(row, 0), users: metric(row, 1), averageSessionDuration: metric(row, 2) }));
  });
}

export async function runGa4Realtime() {
  const property = propertyId();
  if (!property) throw new Error('GOOGLE_ANALYTICS_PROPERTY_ID is not configured');
  return cachedReport(`ga4:realtime:${property}`, 60_000, async () => {
    const { property: resource, client } = createClient();
    const response = await client.properties.runRealtimeReport({
      property: resource,
      requestBody: { metrics: [{ name: 'activeUsers' }] },
    });
    return metric(getRows(response)[0] || {}, 0);
  });
}
