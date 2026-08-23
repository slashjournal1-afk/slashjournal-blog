import React from 'react';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { formatDateTime } from '@/lib/utils';
import { Shield, FileText, UserCheck, Clock } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AuditLogsPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') {
    redirect('/admin');
  }

  const [auditLogs, revisions] = await Promise.all([
    prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 25,
      include: { user: true },
    }),
    prisma.articleRevision.findMany({
      orderBy: { createdAt: 'desc' },
      take: 15,
      include: { article: { select: { title: true, slug: true } } },
    }),
  ]);

  return (
    <div className="space-y-10">
      <div className="pb-6 border-b border-[var(--border-color)]">
        <h1 className="text-[26px] md:text-[30px] font-extrabold text-[var(--text-primary)] tracking-tight">
          Log Audit &amp; Riwayat Revisi Sistem
        </h1>
        <p className="text-[13.5px] text-[var(--text-muted)] mt-1">
          Jejak audit keamanan administratif dan rekam jejak revisi naskah dokumen.
        </p>
      </div>

      {/* Grid: Audit Logs & Article Revisions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Administrative Audit Trail */}
        <div className="lg:col-span-7 rounded-[28px] border border-[var(--border-color)] bg-[var(--bg-card)] p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border-color)]">
            <h3 className="text-[15px] font-bold text-[var(--text-primary)] flex items-center gap-2">
              <Shield className="w-4 h-4 text-[var(--accent)]" />
              <span>Aktivitas Keamanan &amp; Mutasi Sistem</span>
            </h3>
            <span className="text-xs font-mono text-[var(--text-muted)]">{auditLogs.length} Entri</span>
          </div>

          {auditLogs.length === 0 ? (
            <p className="text-xs text-[var(--text-muted)] py-4">
              Belum ada log aktivitas keamanan yang tercatat.
            </p>
          ) : (
            <div className="space-y-3">
              {auditLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3.5 rounded-[16px] bg-[var(--bg-card-muted)] border border-[var(--border-color)] space-y-1 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[var(--accent)] uppercase text-[10.5px]">
                      {log.action}
                    </span>
                    <span className="font-mono text-[10.5px] text-[var(--text-muted)]">
                      {formatDateTime(log.createdAt)}
                    </span>
                  </div>
                  <p className="text-[var(--text-primary)] font-medium">{log.details}</p>
                  <p className="text-[10px] text-[var(--text-muted)] font-mono">
                    Aktor: {log.actorEmail} {log.ipAddress ? `• IP: ${log.ipAddress}` : ''}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Article Revisions */}
        <div className="lg:col-span-5 rounded-[28px] border border-[var(--border-color)] bg-[var(--bg-card)] p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border-color)]">
            <h3 className="text-[15px] font-bold text-[var(--text-primary)] flex items-center gap-2">
                <FileText className="w-4 h-4 text-[var(--accent)]" />
              <span>Riwayat Revisi Naskah</span>
            </h3>
          </div>

          {revisions.length === 0 ? (
            <p className="text-xs text-[var(--text-muted)] py-4">
              Belum ada riwayat snapshot revisi naskah tersimpan.
            </p>
          ) : (
            <div className="space-y-3">
              {revisions.map((rev) => (
                <div
                  key={rev.id}
                  className="p-3.5 rounded-[16px] bg-[var(--bg-card-muted)] border border-[var(--border-color)] space-y-1 text-xs"
                >
                  <h5 className="font-bold text-[var(--text-primary)] line-clamp-1">
                    {rev.article.title}
                  </h5>
                  {rev.note && (
                    <p className="text-[11px] text-[var(--text-muted)] italic">
                      &ldquo;{rev.note}&rdquo;
                    </p>
                  )}
                  <p className="font-mono text-[10px] text-[var(--accent)]">
                    {formatDateTime(rev.createdAt)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
