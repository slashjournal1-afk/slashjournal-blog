'use client';

import React, { useState } from 'react';
import { formatDateTime } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Check,
  X,
  ShieldBan,
  MessageSquare,
  User,
  AlertOctagon,
  CheckCircle2,
} from 'lucide-react';

interface CommentItem {
  id: string;
  content: string;
  status: string;
  createdAt: Date | string;
  reader: {
    id: string;
    email: string;
    displayName: string;
    isBlocked: boolean;
  };
  article: {
    id: string;
    title: string;
    slug: string;
  };
}

export function CommentModerationList({ initialComments }: { initialComments: CommentItem[] }) {
  const [comments, setComments] = useState<CommentItem[]>(initialComments);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'PENDING' | 'APPROVED' | 'REJECTED' | 'ALL'>('PENDING');

  const handleAction = async (id: string, status: 'APPROVED' | 'REJECTED' | 'SPAM', blockReader = false) => {
    setLoadingId(id);
    try {
      const res = await fetch(`/api/admin/comments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, blockReader }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal memproses komentar');

      setComments((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status, reader: { ...c.reader, isBlocked: blockReader || c.reader.isBlocked } } : c))
      );
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoadingId(null);
    }
  };

  const filteredComments = comments.filter((c) => {
    if (filter === 'ALL') return true;
    return c.status === filter;
  });

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {(['PENDING', 'APPROVED', 'REJECTED', 'ALL'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-btn text-[13px] font-medium transition-colors cursor-pointer ${
              filter === tab
                ? 'bg-[var(--accent)] text-[var(--accent-foreground)] font-bold'
                : 'bg-[var(--bg-card-muted)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            {tab === 'PENDING' ? `Menunggu Moderasi (${comments.filter((c) => c.status === 'PENDING').length})` : tab}
          </button>
        ))}
      </div>

      {filteredComments.length > 0 ? (
        <div className="space-y-4">
          {filteredComments.map((c) => (
            <div
              key={c.id}
              className="p-5 md:p-6 rounded-[24px] bg-[var(--bg-card)] border border-[var(--border-color)] space-y-4 shadow-sm"
            >
              {/* Comment Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[var(--border-color)] text-[12.5px] text-[var(--text-muted)]">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-[var(--accent)]" />
                  <span className="font-bold text-[var(--text-primary)]">{c.reader.displayName}</span>
                  <span className="text-[var(--text-muted)]">({c.reader.email})</span>
                  {c.reader.isBlocked && (
                    <Badge variant="status-retracted" size="sm">
                      DIBLOKIR
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      c.status === 'APPROVED'
                        ? 'status-published'
                        : c.status === 'PENDING'
                        ? 'status-draft'
                        : 'status-retracted'
                    }
                    size="sm"
                  >
                    {c.status}
                  </Badge>
                  <time>{formatDateTime(c.createdAt)}</time>
                </div>
              </div>

              {/* Article Link */}
              <div className="text-[12px] text-[var(--text-muted)]">
                Komentar pada artikel:{' '}
                <a
                  href={`/${c.article.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors"
                >
                  &quot;{c.article.title}&quot; ↗
                </a>
              </div>

              {/* Comment Body */}
              <div className="p-4 rounded-[16px] bg-[var(--bg-card-muted)] border border-[var(--border-color)] text-[14px] text-[var(--text-primary)] leading-relaxed whitespace-pre-wrap">
                {c.content}
              </div>

              {/* Moderation Actions (CM6 Mobile One-Tap Buttons) */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2">
                  {c.status !== 'APPROVED' && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleAction(c.id, 'APPROVED')}
                      disabled={loadingId === c.id}
                      className="bg-[var(--success)] hover:brightness-110 text-[var(--bg-primary)] rounded-btn px-4"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Setujui (Tayang)
                    </Button>
                  )}

                  {c.status !== 'REJECTED' && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleAction(c.id, 'REJECTED')}
                      disabled={loadingId === c.id}
                      className="bg-[var(--bg-card-muted)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border-[var(--border-color)]"
                    >
                      <X className="w-3.5 h-3.5" />
                      Tolak
                    </Button>
                  )}
                </div>

                {!c.reader.isBlocked && (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => {
                      if (confirm(`Blokir akun pembaca "${c.reader.displayName}" (${c.reader.email})?`)) {
                        handleAction(c.id, 'REJECTED', true);
                      }
                    }}
                    disabled={loadingId === c.id}
                    className="text-[11.5px] py-1 px-3"
                  >
                    <ShieldBan className="w-3 h-3" />
                    Blokir Pembaca
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center rounded-[28px] border border-dashed border-[var(--border-color)] bg-[var(--bg-card)] space-y-2">
          <CheckCircle2 className="w-8 h-8 text-[var(--success)] mx-auto" />
          <p className="text-[15px] font-medium text-[var(--text-primary)]">
            Tidak ada komentar dalam kategori ini.
          </p>
          <p className="text-[12.5px] text-[var(--text-muted)]">Semua tanggapan pembaca telah diproses.</p>
        </div>
      )}
    </div>
  );
}
