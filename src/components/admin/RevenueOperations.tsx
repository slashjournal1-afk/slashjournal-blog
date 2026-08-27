'use client';

import { useState } from 'react';
import { formatDate } from '@/lib/utils';

type Period = { id: string; periodStart: string; status: string };
type AuthorRow = { id: string; authorId: string; author: { displayName: string }; revenuePeriod: { currencyCode: string }; authorShare: string | number; payoutStatus: string };

export function RevenueOperations({ periods, authors }: { periods: Period[]; authors: AuthorRow[] }) {
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [adjustment, setAdjustment] = useState({ periodId: periods[0]?.id || '', authorId: '', amount: '', reason: '' });

  async function post(path: string, body: Record<string, unknown>) {
    setBusy(true);
    setMessage(null);
    try {
      const response = await fetch(path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Operasi gagal');
      setMessage('Operasi berhasil. Refresh halaman untuk melihat data terbaru.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Operasi gagal');
    } finally {
      setBusy(false);
    }
  }

  const provisional = periods.find((period) => period.status === 'PROVISIONAL');

  return (
    <section className="space-y-4 border border-[var(--border-color)] bg-[var(--bg-card)] p-5">
      <div>
        <h2 className="text-lg font-bold">Kontrol Operasional</h2>
        <p className="mt-1 text-xs text-[var(--text-muted)]">Gunakan finalize setelah period melewati masa rekonsiliasi minimal 7 hari.</p>
      </div>
      <form onSubmit={(event) => { event.preventDefault(); post('/api/admin/revenue/adjustment', { revenuePeriodId: adjustment.periodId, authorId: adjustment.authorId, amount: adjustment.amount, reason: adjustment.reason }); }} className="grid gap-2 border-t border-[var(--border-color)] pt-4 sm:grid-cols-2 lg:grid-cols-5">
        <select aria-label="Periode adjustment" value={adjustment.periodId} onChange={(event) => setAdjustment((value) => ({ ...value, periodId: event.target.value }))} className="border border-[var(--border-color)] bg-[var(--bg-primary)] px-2 py-2 text-xs"><option value="">Pilih periode</option>{periods.map((period) => <option key={period.id} value={period.id}>{formatDate(period.periodStart)} · {period.status}</option>)}</select>
        <select aria-label="Penulis adjustment" value={adjustment.authorId} onChange={(event) => setAdjustment((value) => ({ ...value, authorId: event.target.value }))} className="border border-[var(--border-color)] bg-[var(--bg-primary)] px-2 py-2 text-xs"><option value="">Pilih penulis</option>{[...new Map(authors.map((row) => [row.authorId, row])).values()].map((row) => <option key={row.authorId} value={row.authorId}>{row.author.displayName}</option>)}</select>
        <input aria-label="Jumlah adjustment" value={adjustment.amount} onChange={(event) => setAdjustment((value) => ({ ...value, amount: event.target.value }))} placeholder="Jumlah (+/-)" inputMode="decimal" className="border border-[var(--border-color)] bg-[var(--bg-primary)] px-2 py-2 text-xs" />
        <input aria-label="Alasan adjustment" value={adjustment.reason} onChange={(event) => setAdjustment((value) => ({ ...value, reason: event.target.value }))} placeholder="Alasan adjustment" className="border border-[var(--border-color)] bg-[var(--bg-primary)] px-2 py-2 text-xs" />
        <button type="submit" disabled={busy || !adjustment.periodId || !adjustment.authorId || !adjustment.amount || !adjustment.reason} className="border border-[var(--border-color)] px-3 py-2 text-xs font-semibold hover:border-[var(--accent)] disabled:opacity-50">Buat adjustment</button>
      </form>
      <div className="flex flex-wrap gap-2">
        <button type="button" disabled={busy} onClick={() => post('/api/admin/revenue/sync', {})} className="border border-[var(--border-color)] px-3 py-2 text-xs font-semibold hover:border-[var(--accent)] disabled:opacity-50">Sync terbaru</button>
        {provisional && <button type="button" disabled={busy} onClick={() => { if (window.confirm('Finalisasi period provisional?')) post('/api/admin/revenue/finalize', { periodId: provisional.id }); }} className="border border-[var(--warning)]/40 px-3 py-2 text-xs font-semibold text-[var(--warning)] hover:border-[var(--warning)] disabled:opacity-50">Finalisasi period terbaru</button>}
      </div>
      {authors.length > 0 && <div className="overflow-x-auto"><table className="w-full text-left text-xs"><thead className="border-b border-[var(--border-color)] text-[var(--text-muted)]"><tr><th className="p-2">Penulis</th><th className="p-2">Payout</th><th className="p-2">Action</th></tr></thead><tbody className="divide-y divide-[var(--border-color)]">{authors.map((row) => <tr key={row.id}><td className="p-2">{row.author.displayName}</td><td className="p-2">{row.payoutStatus}</td><td className="p-2">{row.payoutStatus !== 'PAID' && <button type="button" disabled={busy} onClick={() => { const reference = window.prompt('Masukkan referensi transfer'); if (reference?.trim()) post('/api/admin/revenue/payout', { authorRevenueId: row.id, reference }); }} className="border border-[var(--border-color)] px-2 py-1 font-semibold hover:border-[var(--accent)] disabled:opacity-50">Tandai dibayar</button>}</td></tr>)}</tbody></table></div>}
      {message && <p role="status" className="text-xs text-[var(--text-muted)]">{message}</p>}
    </section>
  );
}
