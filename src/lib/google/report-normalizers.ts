export type AdSenseSummary = {
  estimatedEarnings: number;
  impressions: number;
  clicks: number;
  pageViews: number;
  pageViewsRpm: number;
  pageViewsCtr: number;
  currencyCode: string;
  hasData: boolean;
};

type Report = {
  totals?: { cells?: Array<{ value?: string | null }> };
  headers?: Array<{ name?: string | null; currencyCode?: string | null }>;
  rows?: unknown[];
};

export function normalizeAdSenseReport(report: Report): AdSenseSummary {
  const values = new Map((report.headers || []).map((header, index) => [header.name || '', Number(report.totals?.cells?.[index]?.value || 0)]));
  const currencyCode = report.headers?.find((header) => header.currencyCode)?.currencyCode || 'USD';
  const summary = {
    estimatedEarnings: values.get('ESTIMATED_EARNINGS') || 0,
    impressions: values.get('IMPRESSIONS') || 0,
    clicks: values.get('CLICKS') || 0,
    pageViews: values.get('PAGE_VIEWS') || 0,
    pageViewsRpm: values.get('PAGE_VIEWS_RPM') || 0,
    pageViewsCtr: values.get('PAGE_VIEWS_CTR') || 0,
    currencyCode,
    hasData: Boolean(report.totals?.cells?.length || report.rows?.length),
  };
  return summary;
}
