'use client';

import { useEffect, useState } from 'react';
import { BarChart3, CircleAlert, DollarSign, RefreshCw, Users } from 'lucide-react';

type Range = 'today' | '7d' | '28d' | '90d';
type AnalyticsResponse = { overview: Array<{ dimensions: string[]; metrics: number[] }>; pages: Array<{ dimensions: string[]; metrics: number[] }>; status: string; cachedAt: string | null };
type AdSenseResponse = { report: { totals?: Array<{ metric?: string; value?: string }> } | null; status: string; cachedAt: string | null };

function Metric({ icon: Icon, label, value }: { icon: typeof Users; label: string; value: string }) {
  return <div className="border border-[var(--border-color)] bg-[var(--bg-card)] p-5"><Icon className="h-4 w-4 text-[var(--accent)]" /><p className="mt-4 text-[11px] uppercase tracking-wider text-[var(--text-muted)]">{label}</p><p className="mt-1 text-2xl font-bold">{value}</p></div>;
}

export default function AnalyticsDashboard() {
  const [range, setRange] = useState<Range>('28d');
  const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
  const [adsense, setAdsense] = useState<AdSenseResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    Promise.all([
      fetch(`/api/admin/analytics?range=${range}`, { signal: controller.signal }).then((response) => response.json()),
      fetch(`/api/admin/adsense?range=${range}`, { signal: controller.signal }).then((response) => response.json()),
    ]).then(([ga, ads]) => { setAnalytics(ga); setAdsense(ads); }).catch(() => {}).finally(() => setLoading(false));
    return () => controller.abort();
  }, [range]);

  const totals = analytics?.overview.reduce((result, row) => {
    result.users += row.metrics[0] || 0;
    result.sessions += row.metrics[1] || 0;
    result.events += row.metrics[2] || 0;
    result.views += row.metrics[3] || 0;
    return result;
  }, { users: 0, sessions: 0, events: 0, views: 0 });

  return <div className="space-y-8">
    <header className="flex flex-col gap-4 border-b border-[var(--border-color)] pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div><p className="text-[11px] font-bold uppercase tracking-wider text-[var(--accent)]">Superadmin</p><h1 className="mt-2 text-3xl font-bold">Google Analytics &amp; AdSense</h1><p className="mt-2 text-sm text-[var(--text-muted)]">Data pihak ketiga dipisahkan dari telemetry internal SlashJournal.</p></div>
      <label className="text-xs text-[var(--text-muted)]">Rentang laporan<select value={range} onChange={(event) => setRange(event.target.value as Range)} className="ml-2 border border-[var(--border-color)] bg-[var(--bg-card)] px-3 py-2 text-sm text-[var(--text-primary)]"><option value="today">Hari ini</option><option value="7d">7 hari</option><option value="28d">28 hari</option><option value="90d">90 hari</option></select></label>
    </header>
    {loading && <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]"><RefreshCw className="h-4 w-4 animate-spin" /> Memuat laporan...</div>}
    <section><h2 className="mb-4 flex items-center gap-2 text-lg font-bold"><BarChart3 className="h-5 w-5 text-[var(--accent)]" /> Google Analytics 4</h2>{analytics?.status !== 'ok' ? <div className="flex items-center gap-2 border border-amber-500/30 bg-amber-500/5 p-4 text-sm"><CircleAlert className="h-4 w-4 text-amber-500" /> GA4 belum tersedia. Periksa Property ID, service account, dan akses Viewer property.</div> : <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><Metric icon={Users} label="Users" value={(totals?.users || 0).toLocaleString('id-ID')} /><Metric icon={Users} label="Sessions" value={(totals?.sessions || 0).toLocaleString('id-ID')} /><Metric icon={BarChart3} label="Page views" value={(totals?.views || 0).toLocaleString('id-ID')} /><Metric icon={BarChart3} label="Events" value={(totals?.events || 0).toLocaleString('id-ID')} /></div>}</section>
    <section><h2 className="mb-4 flex items-center gap-2 text-lg font-bold"><DollarSign className="h-5 w-5 text-[var(--accent)]" /> Google AdSense</h2>{adsense?.status !== 'ok' ? <div className="flex items-center gap-2 border border-amber-500/30 bg-amber-500/5 p-4 text-sm"><CircleAlert className="h-4 w-4 text-amber-500" /> AdSense belum tersedia. Pastikan akun approved, refresh token valid, dan Account ID benar.</div> : <div className="border border-[var(--border-color)] bg-[var(--bg-card)] p-5 text-sm text-[var(--text-muted)]">Report AdSense tersedia. Detail metric mengikuti response account dan periode yang dipilih.</div>}</section>
    {analytics?.pages?.length ? <section><h2 className="mb-4 text-lg font-bold">Halaman teratas</h2><div className="divide-y divide-[var(--border-color)] border border-[var(--border-color)] bg-[var(--bg-card)]">{analytics.pages.map((page, index) => <div key={`${page.dimensions[0]}-${index}`} className="flex items-center justify-between gap-4 p-4 text-sm"><span className="truncate">{page.dimensions[1] || page.dimensions[0]}</span><span className="font-mono text-xs text-[var(--text-muted)]">{(page.metrics[0] || 0).toLocaleString('id-ID')} views</span></div>)}</div></section> : null}
  </div>;
}
