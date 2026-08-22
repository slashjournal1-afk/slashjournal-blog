import { google } from 'googleapis';
import { createAnalyticsAuth } from './auth';
import { cachedReport } from './report-cache';

export type GoogleDateRange = 'today' | '7d' | '28d' | '90d';

function dateRange(range: GoogleDateRange) {
  return [{ startDate: range === 'today' ? 'today' : `${range.slice(0, -1)}daysAgo`, endDate: 'today' }];
}

function propertyId() {
  return process.env.GOOGLE_ANALYTICS_PROPERTY_ID || process.env.GA4_PROPERTY_ID || '';
}

function rows(response: { data: { rows?: Array<{ dimensionValues?: Array<{ value?: string | null }>; metricValues?: Array<{ value?: string | null }> }> } }) {
  return (response.data.rows || []).map((row) => ({
    dimensions: (row.dimensionValues || []).map((item) => item.value || ''),
    metrics: (row.metricValues || []).map((item) => Number(item.value || 0)),
  }));
}

export async function runGa4Report(range: GoogleDateRange) {
  const property = propertyId();
  if (!property) throw new Error('GOOGLE_ANALYTICS_PROPERTY_ID is not configured');

  return cachedReport(`ga4:overview:${property}:${range}`, 5 * 60_000, async () => {
    const client = google.analyticsdata({ version: 'v1beta', auth: createAnalyticsAuth() });
    const response = await client.properties.runReport({
      property: `properties/${property}`,
      requestBody: {
        dateRanges: dateRange(range),
        dimensions: [{ name: 'eventName' }],
        metrics: [{ name: 'totalUsers' }, { name: 'sessions' }, { name: 'eventCount' }, { name: 'screenPageViews' }],
        limit: '100',
      },
    });
    return rows(response);
  });
}

export async function runGa4Pages(range: GoogleDateRange) {
  const property = propertyId();
  if (!property) throw new Error('GOOGLE_ANALYTICS_PROPERTY_ID is not configured');
  return cachedReport(`ga4:pages:${property}:${range}`, 10 * 60_000, async () => {
    const client = google.analyticsdata({ version: 'v1beta', auth: createAnalyticsAuth() });
    const response = await client.properties.runReport({
      property: `properties/${property}`,
      requestBody: {
        dateRanges: dateRange(range),
        dimensions: [{ name: 'pagePath' }, { name: 'pageTitle' }],
        metrics: [{ name: 'screenPageViews' }, { name: 'totalUsers' }, { name: 'averageSessionDuration' }],
        orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
        limit: '20',
      },
    });
    return rows(response);
  });
}
