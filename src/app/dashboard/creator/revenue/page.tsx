import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function CreatorRevenuePage() {
  const user = await getCurrentUser();
  if (!user || user.role === 'READER') redirect('/dashboard/member');
  const [rows, articles] = await Promise.all([
    prisma.authorRevenue.findMany({ where: { authorId: user.id }, orderBy: { createdAt: 'desc' }, take: 100, include: { revenuePeriod: true } }),
    prisma.articleRevenue.findMany({ where: { article: { authorId: user.id } }, orderBy: { createdAt: 'desc' }, take: 100, include: { article: { select: { title: true, slug: true } }, revenuePeriod: true } }),
  ]);
  const total = rows.reduce((sum, row) => sum + Number(row.payableAmount), 0);
  const currency = rows[0]?.revenuePeriod.currencyCode || 'IDR';
  const money = (value: number) => value.toLocaleString('id-ID', { style: 'currency', currency });
  return <div className="space-y-8">
    <header className="flex flex-col gap-4 border-b border-[var(--border-color)] pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div><p className="text-[11px] font-bold uppercase tracking-wider text-[var(--accent)]">Creator Studio</p><h1 className="mt-2 text-3xl font-bold">Pendapatan Artikel</h1><p className="mt-2 text-sm text-[var(--text-muted)]">Pendapatan estimasi sampai period difinalisasi. Rekonsiliasi berjalan setiap 05:00 WIB.</p></div>
      <Link href="/api/revenue/me/export" className="border border-[var(--border-color)] px-4 py-2 text-xs font-semibold hover:border-[var(--accent)]">Export CSV</Link>
    </header>
    <div className="grid gap-4 sm:grid-cols-3">
      <div className="border border-[var(--border-color)] bg-[var(--bg-card)] p-5"><p className="text-xs text-[var(--text-muted)]">Total bagian penulis</p><p className="mt-2 text-2xl font-bold">{money(total)}</p></div>
      <div className="border border-[var(--border-color)] bg-[var(--bg-card)] p-5"><p className="text-xs text-[var(--text-muted)]">Periode tercatat</p><p className="mt-2 text-2xl font-bold">{rows.length}</p></div>
      <div className="border border-[var(--border-color)] bg-[var(--bg-card)] p-5"><p className="text-xs text-[var(--text-muted)]">Status payout terbaru</p><p className="mt-2 text-sm font-semibold">{rows[0]?.payoutStatus || 'NOT_ELIGIBLE'}</p></div>
    </div>
    <p className="text-xs text-[var(--text-muted)]">Minimum payout default IDR 100.000. Pembayaran manual setelah period finalized dan threshold tercapai.</p>
    <section><h2 className="mb-4 text-lg font-bold">Pendapatan per artikel</h2><div className="overflow-x-auto border border-[var(--border-color)] bg-[var(--bg-card)]"><table className="w-full text-left text-sm"><thead className="border-b border-[var(--border-color)] text-xs text-[var(--text-muted)]"><tr><th className="p-4">Artikel</th><th className="p-4">Periode</th><th className="p-4">Gross</th><th className="p-4">Bagian penulis</th><th className="p-4">Status</th></tr></thead><tbody className="divide-y divide-[var(--border-color)]">{articles.map((row) => <tr key={row.id}><td className="p-4"><Link className="font-medium hover:text-[var(--accent)]" href={`/${row.article.slug}`}>{row.article.title}</Link></td><td className="p-4 text-xs text-[var(--text-muted)]">{row.revenuePeriod.periodStart.toLocaleDateString('id-ID')}</td><td className="p-4">{money(Number(row.grossRevenue))}</td><td className="p-4">{money(Number(row.authorShare))}</td><td className="p-4 text-xs">{row.revenuePeriod.status}</td></tr>)}</tbody></table></div></section>
  </div>;
}
