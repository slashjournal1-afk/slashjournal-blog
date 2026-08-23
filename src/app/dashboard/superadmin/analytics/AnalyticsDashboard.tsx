'use client';

import { useEffect, useState } from 'react';
import { BarChart3, CircleAlert, DollarSign, RefreshCw, Users } from 'lucide-react';

type Range = 'today' | '7d' | '28d' | '90d';
type Summary = { users: number; newUsers: number; sessions: number; pageViews: number; events: number; engagementRate: number; averageSessionDuration: number };
type EventRow = { name: string; eventCount: number; users: number };
type PageRow = { path: string; title: string; pageViews: number; users: number; averageSessionDuration: number };
type AnalyticsResponse = { summary: Summary | null; events: EventRow[]; pages: PageRow[]; status: string; cachedAt: string | null; errorCode?: string; error?: string };
type AdSenseSummary = { estimatedEarnings: number; impressions: number; clicks: number; pageViews: number; pageViewsRpm: number; pageViewsCtr: number; currencyCode: string; hasData: boolean };
type AdSenseResponse = { report: AdSenseSummary | null; status: string; cachedAt: string | null; errorCode?: string; error?: string };

function Metric({ icon: Icon, label, value }: { icon: typeof Users; label: string; value: string }) {
  return <div className="border border-[var(--border-color)] bg-[var(--bg-card)] p-5"><Icon className="h-4 w-4 text-[var(--accent)]" /><p className="mt-4 text-[11px] uppercase tracking-wider text-[var(--text-muted)]">{label}</p><p className="mt-1 text-2xl font-bold">{value}</p></div>;
}

function ReportUnavailable({ name, code, detail }: { name: string; code?: string; detail?: string }) {
  return <div className="border border-amber-500/30 bg-amber-500/5 p-4 text-sm"><div className="flex items-center gap-2"><CircleAlert className="h-4 w-4 text-amber-500" /> {name} belum tersedia.</div><p className="mt-2 text-xs text-[var(--text-muted)]">Kode: {code || 'UNKNOWN'}{detail ? ` - ${detail}` : ''}</p></div>;
}

export default function AnalyticsDashboard() {
  const [range, setRange] = useState<Range>('28d');
  const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
  const [adsense, setAdsense] = useState<AdSenseResponse | null>(null);
  const [activeUsers, setActiveUsers] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    Promise.all([
      fetch(`/api/admin/analytics?range=${range}`, { signal: controller.signal }).then((response) => response.json()),
      fetch(`/api/admin/analytics/realtime`, { signal: controller.signal }).then((response) => response.json()),
      fetch(`/api/admin/adsense?range=${range}`, { signal: controller.signal }).then((response) => response.json()),
    ]).then(([ga, realtime, ads]) => { setAnalytics(ga); setActiveUsers(realtime.status === 'ok' ? realtime.activeUsers : null); setAdsense(ads); }).catch(() => {}).finally(() => setLoading(false));
    return () => controller.abort();
  }, [range]);

  const summary = analytics?.summary;
  const ad = adsense?.report;
  const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: ad?.currencyCode || 'USD' });

  return <div className="space-y-8">
    <header className="flex flex-col gap-4 border-b border-[var(--border-color)] pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div><p className="text-[11px] font-bold uppercase tracking-wider text-[var(--accent)]">Superadmin</p><h1 className="mt-2 text-3xl font-bold">Google Analytics &amp; AdSense</h1><p className="mt-2 text-sm text-[var(--text-muted)]">Data pihak ketiga dipisahkan dari telemetry internal SlashJournal.</p></div>
      <label className="text-xs text-[var(--text-muted)]">Rentang laporan<select value={range} onChange={(event) => setRange(event.target.value as Range)} className="ml-2 border border-[var(--border-color)] bg-[var(--bg-card)] px-3 py-2 text-sm text-[var(--text-primary)]"><option value="today">Hari ini</option><option value="7d">7 hari</option><option value="28d">28 hari</option><option value="90d">90 hari</option></select></label>
    </header>
    {loading && <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]"><RefreshCw className="h-4 w-4 animate-spin" /> Memuat laporan...</div>}

    <section><div className="mb-4 flex items-center justify-between"><h2 className="flex items-center gap-2 text-lg font-bold"><BarChart3 className="h-5 w-5 text-[var(--accent)]" /> Google Analytics 4</h2>{activeUsers !== null && <span className="text-xs text-emerald-600">{activeUsers.toLocaleString('id-ID')} aktif sekarang</span>}</div>{analytics?.status !== 'ok' ? <ReportUnavailable name="GA4" code={analytics?.errorCode} detail={analytics?.error} /> : <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><Metric icon={Users} label="Users unik GA4" value={(summary?.users || 0).toLocaleString('id-ID')} /><Metric icon={Users} label="Sessions" value={(summary?.sessions || 0).toLocaleString('id-ID')} /><Metric icon={BarChart3} label="Page views" value={(summary?.pageViews || 0).toLocaleString('id-ID')} /><Metric icon={BarChart3} label="Events" value={(summary?.events || 0).toLocaleString('id-ID')} /></div>}</section>

    <section><h2 className="mb-4 flex items-center gap-2 text-lg font-bold"><DollarSign className="h-5 w-5 text-[var(--accent)]" /> Google AdSense</h2>{adsense?.status !== 'ok' ? <ReportUnavailable name="AdSense" code={adsense?.errorCode} detail={adsense?.error} /> : !ad ? <ReportUnavailable name="AdSense" code="NO_REPORT" /> : !ad.hasData ? <div className="border border-[var(--border-color)] bg-[var(--bg-card)] p-5 text-sm text-[var(--text-muted)]">AdSense API berhasil diakses, tetapi belum ada data pada periode ini.</div> : <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"><Metric icon={DollarSign} label="Estimated earnings" value={money.format(ad.estimatedEarnings)} /><Metric icon={BarChart3} label="Impressions" value={ad.impressions.toLocaleString('id-ID')} /><Metric icon={BarChart3} label="Clicks" value={ad.clicks.toLocaleString('id-ID')} /><Metric icon={BarChart3} label="Page views" value={ad.pageViews.toLocaleString('id-ID')} /><Metric icon={BarChart3} label="Page views CTR" value={`${(ad.pageViewsCtr * 100).toFixed(2)}%`} /><Metric icon={DollarSign} label="Page views RPM" value={money.format(ad.pageViewsRpm)} /></div>}</section>

    {analytics?.status === 'ok' && <section><h2 className="mb-4 text-lg font-bold">Event GA4</h2><div className="overflow-x-auto border border-[var(--border-color)] bg-[var(--bg-card)]"><table className="w-full text-left text-sm"><thead className="border-b border-[var(--border-color)] text-xs text-[var(--text-muted)]"><tr><th className="p-4">Event</th><th className="p-4">Event count</th><th className="p-4">Users</th></tr></thead><tbody className="divide-y divide-[var(--border-color)]">{analytics.events.map((event) => <tr key={event.name}><td className="p-4 font-mono">{event.name}</td><td className="p-4">{event.eventCount.toLocaleString('id-ID')}</td><td className="p-4">{event.users.toLocaleString('id-ID')}</td></tr>)}</tbody></table></div></section>}

    {analytics?.status === 'ok' && <section><h2 className="mb-4 text-lg font-bold">Halaman teratas</h2><div className="overflow-x-auto border border-[var(--border-color)] bg-[var(--bg-card)]"><table className="w-full text-left text-sm"><thead className="border-b border-[var(--border-color)] text-xs text-[var(--text-muted)]"><tr><th className="p-4">Halaman</th><th className="p-4">Views</th><th className="p-4">Users</th></tr></thead><tbody className="divide-y divide-[var(--border-color)]">{analytics.pages.map((page) => <tr key={page.path}><td className="max-w-[480px] truncate p-4"><span className="block font-medium">{page.title || page.path}</span><span className="text-xs text-[var(--text-muted)]">{page.path}</span></td><td className="p-4">{page.pageViews.toLocaleString('id-ID')}</td><td className="p-4">{page.users.toLocaleString('id-ID')}</td></tr>)}</tbody></table></div></section>}
  </div>;
}
