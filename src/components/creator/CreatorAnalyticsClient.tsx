'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { CalendarDays, Download, Eye, RefreshCw, TrendingUp } from 'lucide-react';
import { TrafficChart, type TrafficChartPoint } from './TrafficChart';
import { WeekdayChart } from './WeekdayChart';

type Preset = '7' | '14' | '28' | '90' | 'custom';

interface ArticleOption {
  id: string;
  title: string;
  slug: string;
  viewCount: number;
  category: { id: string; name: string };
  series: { id: string; title: string } | null;
}

interface ApiArticle {
  id: string;
  title: string;
  slug: string;
  category: string;
  total: number;
}

interface ApiDay {
  date: string;
  label: string;
  weekday: string;
  total: number;
  byArticle: Record<string, number>;
}

interface ApiResponse {
  days: ApiDay[];
  articles: ApiArticle[];
  summary: {
    total: number;
    dayCount: number;
    avgPerDay: number;
    peakDay: { date: string; label: string; weekday: string; views: number } | null;
    lowDay: { date: string; label: string; weekday: string; views: number } | null;
    weekdayAvg: { weekday: string; avg: number; total: number }[];
    articleCount: number;
  };
  range: { from: string; to: string };
  cachedAt: string | null;
}

function toISODate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function presetRange(preset: Exclude<Preset, 'custom'>): { from: string; to: string } {
  const to = new Date();
  const from = new Date();
  from.setDate(to.getDate() - (Number(preset) - 1));
  return { from: toISODate(from), to: toISODate(to) };
}

export function CreatorAnalyticsClient({
  articleOptions,
  categories,
  seriesList,
}: {
  articleOptions: ArticleOption[];
  categories: { id: string; name: string }[];
  seriesList: { id: string; title: string }[];
}) {
  const initial = useMemo(() => presetRange('28'), []);
  const [preset, setPreset] = useState<Preset>('28');
  const [from, setFrom] = useState(initial.from);
  const [to, setTo] = useState(initial.to);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [categoryId, setCategoryId] = useState('');
  const [seriesId, setSeriesId] = useState('');
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchData = useCallback(async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ from, to });
      for (const id of selectedIds) params.append('articleId', id);
      if (categoryId) params.set('categoryId', categoryId);
      if (seriesId) params.set('seriesId', seriesId);
      const res = await fetch(`/api/creator/analytics/daily?${params.toString()}`, { signal: controller.signal });
      if (!res.ok) throw new Error(res.status === 403 ? 'Akses ditolak' : 'Gagal memuat data');
      const json = (await res.json()) as ApiResponse;
      setData(json);
    } catch (err) {
      if ((err as Error).name !== 'AbortError') setError((err as Error).message || 'Gagal memuat data');
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }, [from, to, selectedIds, categoryId, seriesId]);

  // Debounce 300ms agar geser filter tidak menghantam API/DB.
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => void fetchData(), 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      abortRef.current?.abort();
    };
  }, [fetchData]);

  const applyPreset = (p: Preset) => {
    setPreset(p);
    if (p !== 'custom') {
      const r = presetRange(p);
      setFrom(r.from);
      setTo(r.to);
    }
  };

  const toggleArticle = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : prev.length >= 5 ? prev : [...prev, id]));
  };

  const chartData: TrafficChartPoint[] = useMemo(
    () =>
      (data?.days || []).map((d) => {
        const point: TrafficChartPoint = { date: d.date, label: d.label, weekday: d.weekday, total: d.total };
        for (const [k, v] of Object.entries(d.byArticle)) point[k] = v;
        return point;
      }),
    [data],
  );

  const compareSeries = useMemo(
    () =>
      selectedIds
        .map((id) => {
          const opt = articleOptions.find((a) => a.id === id) || data?.articles.find((a) => a.id === id);
          return opt ? { id, title: opt.title } : null;
        })
        .filter((x): x is { id: string; title: string } => x !== null),
    [selectedIds, articleOptions, data],
  );

  const exportHref = useMemo(() => {
    const params = new URLSearchParams({ from, to });
    for (const id of selectedIds) params.append('articleId', id);
    if (categoryId) params.set('categoryId', categoryId);
    if (seriesId) params.set('seriesId', seriesId);
    return `/api/creator/analytics/export?${params.toString()}`;
  }, [from, to, selectedIds, categoryId, seriesId]);

  const summary = data?.summary;
  const filteredOptions = articleOptions.filter(
    (a) => (!categoryId || a.category.id === categoryId) && (!seriesId || a.series?.id === seriesId),
  );

  return (
    <div className="space-y-8">
      {/* Filter bar */}
      <section className="rounded-[24px] border border-[var(--border-color)] bg-[var(--bg-card)] p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          {(['7', '14', '28', '90'] as const).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => applyPreset(p)}
              className={`rounded-full px-4 py-1.5 text-xs font-bold transition-colors ${
                preset === p
                  ? 'bg-[var(--accent)] text-[var(--accent-foreground)]'
                  : 'border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              {p} hari
            </button>
          ))}
          <button
            type="button"
            onClick={() => applyPreset('custom')}
            className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold transition-colors ${
              preset === 'custom'
                ? 'bg-[var(--accent)] text-[var(--accent-foreground)]'
                : 'border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            <CalendarDays className="h-3.5 w-3.5" /> Custom
          </button>
          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={() => void fetchData()}
              className="flex items-center gap-1.5 rounded-[12px] border border-[var(--border-color)] px-3 py-1.5 text-xs font-bold text-[var(--text-muted)] hover:text-[var(--accent)]"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} /> Muat ulang
            </button>
            <a
              href={exportHref}
              className="flex items-center gap-1.5 rounded-[12px] border border-[var(--border-color)] px-3 py-1.5 text-xs font-bold text-[var(--text-muted)] hover:text-[var(--accent)]"
            >
              <Download className="h-3.5 w-3.5" /> CSV
            </a>
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <label className="text-xs text-[var(--text-muted)]">
            Dari
            <input
              type="date"
              value={from}
              max={to}
              onChange={(e) => {
                setPreset('custom');
                setFrom(e.target.value);
              }}
              className="mt-1 w-full rounded-[12px] border border-[var(--border-color)] bg-[var(--bg-primary)] px-3 py-2 text-sm text-[var(--text-primary)]"
            />
          </label>
          <label className="text-xs text-[var(--text-muted)]">
            Sampai
            <input
              type="date"
              value={to}
              min={from}
              onChange={(e) => {
                setPreset('custom');
                setTo(e.target.value);
              }}
              className="mt-1 w-full rounded-[12px] border border-[var(--border-color)] bg-[var(--bg-primary)] px-3 py-2 text-sm text-[var(--text-primary)]"
            />
          </label>
          <label className="text-xs text-[var(--text-muted)]">
            Kategori
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="mt-1 w-full rounded-[12px] border border-[var(--border-color)] bg-[var(--bg-primary)] px-3 py-2 text-sm text-[var(--text-primary)]"
            >
              <option value="">Semua kategori</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <label className="text-xs text-[var(--text-muted)]">
            Series
            <select
              value={seriesId}
              onChange={(e) => setSeriesId(e.target.value)}
              className="mt-1 w-full rounded-[12px] border border-[var(--border-color)] bg-[var(--bg-primary)] px-3 py-2 text-sm text-[var(--text-primary)]"
            >
              <option value="">Semua series</option>
              {seriesList.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-4">
          <p className="text-xs font-bold text-[var(--text-muted)]">
            Bandingkan artikel (maks 5){selectedIds.length > 0 && ` — ${selectedIds.length} dipilih`}
            {selectedIds.length > 0 && (
              <button type="button" onClick={() => setSelectedIds([])} className="ml-2 font-bold text-[var(--accent)] hover:underline">
                Reset
              </button>
            )}
          </p>
          <div className="mt-2 flex max-h-44 flex-wrap gap-2 overflow-y-auto pr-1">
            {filteredOptions.map((a) => {
              const active = selectedIds.includes(a.id);
              return (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => toggleArticle(a.id)}
                  title={`${a.title} — ${a.viewCount} pembaca total`}
                  className={`max-w-[260px] truncate rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                    active
                      ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]'
                      : 'border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {active ? '✓ ' : ''}{a.title}
                </button>
              );
            })}
            {filteredOptions.length === 0 && (
              <p className="text-xs text-[var(--text-muted)]">Tidak ada artikel pada filter kategori/series ini.</p>
            )}
          </div>
        </div>
      </section>

      {error && (
        <div className="rounded-[16px] border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-500">
          Gagal memuat analitik: {error}
        </div>
      )}

      {/* KPI */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-[24px] border border-[var(--border-color)] bg-[var(--bg-card)] p-5">
          <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[var(--accent)]">
            <Eye className="h-3.5 w-3.5" /> Total penonton
          </p>
          <p className="mt-2 text-[30px] font-extrabold leading-none text-[var(--text-primary)]">
            {loading ? '…' : (summary?.total || 0).toLocaleString('id-ID')}
          </p>
          <p className="mt-1 font-mono text-[11px] text-[var(--text-muted)]">
            {summary?.dayCount || 0} hari • rata-rata {summary?.avgPerDay || 0}/hari
          </p>
        </div>
        <div className="rounded-[24px] border border-[var(--border-color)] bg-[var(--bg-card)] p-5">
          <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-500">
            <TrendingUp className="h-3.5 w-3.5" /> Hari puncak
          </p>
          <p className="mt-2 text-[22px] font-extrabold leading-none text-[var(--text-primary)]">
            {loading ? '…' : summary?.peakDay ? `${summary.peakDay.label}` : '-'}
          </p>
          <p className="mt-1 font-mono text-[11px] text-[var(--text-muted)]">
            {summary?.peakDay ? `${summary.peakDay.weekday} • ${summary.peakDay.views.toLocaleString('id-ID')} penonton` : 'Belum ada data'}
          </p>
        </div>
        <div className="rounded-[24px] border border-[var(--border-color)] bg-[var(--bg-card)] p-5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Hari tersepi</p>
          <p className="mt-2 text-[22px] font-extrabold leading-none text-[var(--text-primary)]">
            {loading ? '…' : summary?.lowDay ? `${summary.lowDay.label}` : '-'}
          </p>
          <p className="mt-1 font-mono text-[11px] text-[var(--text-muted)]">
            {summary?.lowDay ? `${summary.lowDay.weekday} • ${summary.lowDay.views.toLocaleString('id-ID')} penonton` : 'Belum ada data'}
          </p>
        </div>
        <div className="rounded-[24px] border border-[var(--border-color)] bg-[var(--bg-card)] p-5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Artikel berkontribusi</p>
          <p className="mt-2 text-[30px] font-extrabold leading-none text-[var(--text-primary)]">
            {loading ? '…' : summary?.articleCount || 0}
          </p>
          <p className="mt-1 font-mono text-[11px] text-[var(--text-muted)]">dari {articleOptions.length} naskah terbit</p>
        </div>
      </section>

      {/* Grafik utama */}
      <section className="rounded-[28px] border border-[var(--border-color)] bg-[var(--bg-card)] p-5 sm:p-8">
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <h2 className="text-[16px] font-bold text-[var(--text-primary)]">
              {compareSeries.length > 0 ? 'Perbandingan traffic per artikel' : 'Traffic penonton harian — semua artikel'}
            </h2>
            <p className="mt-0.5 text-xs text-[var(--text-muted)]">
              {data ? `${data.range.from} → ${data.range.to} (WIB)` : 'Memuat…'} • Data harian internal mulai tercatat sejak update ini dirilis.
            </p>
          </div>
        </div>
        <TrafficChart data={chartData} compareSeries={compareSeries} loading={loading} />
        {/* Tabel aksesibel pendamping grafik */}
        <details className="mt-4 text-sm">
          <summary className="cursor-pointer text-xs font-bold text-[var(--accent)]">Lihat data harian sebagai tabel</summary>
          <div className="mt-2 max-h-64 overflow-auto rounded-[12px] border border-[var(--border-color)]">
            <table className="w-full text-left text-xs">
              <thead className="sticky top-0 bg-[var(--bg-card-muted)] text-[var(--text-muted)]">
                <tr>
                  <th className="p-2.5">Tanggal</th>
                  <th className="p-2.5">Hari</th>
                  <th className="p-2.5 text-right">Penonton</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)]">
                {(data?.days || []).map((d) => (
                  <tr key={d.date}>
                    <td className="p-2.5 font-mono">{d.date}</td>
                    <td className="p-2.5">{d.weekday}</td>
                    <td className="p-2.5 text-right font-bold">{d.total.toLocaleString('id-ID')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      </section>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Hari apa paling ramai */}
        <section className="rounded-[28px] border border-[var(--border-color)] bg-[var(--bg-card)] p-5 sm:p-8 lg:col-span-5">
          <h2 className="text-[16px] font-bold text-[var(--text-primary)]">Hari apa paling ramai?</h2>
          <p className="mb-4 mt-0.5 text-xs text-[var(--text-muted)]">Rata-rata penonton per hari dalam seminggu (WIB).</p>
          <WeekdayChart data={summary?.weekdayAvg || []} loading={loading} />
        </section>

        {/* Top artikel */}
        <section className="rounded-[28px] border border-[var(--border-color)] bg-[var(--bg-card)] p-5 sm:p-8 lg:col-span-7">
          <h2 className="text-[16px] font-bold text-[var(--text-primary)]">Traffic per artikel pada periode ini</h2>
          <p className="mb-4 mt-0.5 text-xs text-[var(--text-muted)]">Klik baris untuk fokus ke satu artikel.</p>
          {loading ? (
            <div className="space-y-2">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-14 animate-pulse rounded-[16px] bg-[var(--bg-card-muted)]" />
              ))}
            </div>
          ) : (data?.articles.length || 0) === 0 ? (
            <p className="py-8 text-center text-sm text-[var(--text-muted)]">
              Belum ada view tercatat pada periode ini. Data harian mulai dihitung sejak fitur ini dirilis.
            </p>
          ) : (
            <div className="max-h-[320px] space-y-2 overflow-y-auto pr-1">
              {data!.articles.slice(0, 30).map((a, idx) => {
                const share = summary && summary.total > 0 ? Math.round((a.total / summary.total) * 100) : 0;
                const focused = selectedIds.length === 1 && selectedIds[0] === a.id;
                return (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => setSelectedIds(focused ? [] : [a.id])}
                    className={`flex w-full items-center gap-3 rounded-[16px] border p-3 text-left transition-colors ${
                      focused ? 'border-[var(--accent)] bg-[var(--accent-soft)]/40' : 'border-[var(--border-color)] hover:border-[var(--accent)]/40'
                    }`}
                  >
                    <span className="w-6 shrink-0 text-center font-mono text-xs font-bold text-[var(--text-muted)]">{idx + 1}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13px] font-bold text-[var(--text-primary)]">{a.title}</span>
                      <span className="mt-0.5 block h-1.5 overflow-hidden rounded-full bg-[var(--bg-card-muted)]">
                        <span className="block h-full rounded-full bg-[var(--accent)]" style={{ width: `${share}%` }} />
                      </span>
                      <span className="mt-1 block text-[11px] text-[var(--text-muted)]">
                        {a.category} • <Link href={`/${a.slug}`} target="_blank" onClick={(e) => e.stopPropagation()} className="text-[var(--accent)] hover:underline">buka</Link>
                      </span>
                    </span>
                    <span className="shrink-0 text-right">
                      <span className="block text-sm font-extrabold text-[var(--text-primary)]">{a.total.toLocaleString('id-ID')}</span>
                      <span className="block font-mono text-[10px] text-[var(--text-muted)]">{share}%</span>
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
