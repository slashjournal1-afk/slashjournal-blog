'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { CheckCircle2, XCircle, Clock, Eye, AlertCircle, Sparkles } from 'lucide-react';

interface ReviewQueueClientProps {
  initialArticles: any[];
}

export function ReviewQueueClient({ initialArticles }: ReviewQueueClientProps) {
  const [articles, setArticles] = useState(initialArticles);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [reviewNote, setReviewNote] = useState<{ [key: string]: string }>({});

  const handleAction = async (articleId: string, status: 'PUBLISHED' | 'DRAFT') => {
    setActionLoading(articleId);
    try {
      const res = await fetch(`/api/articles/${articleId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          reviewNote: reviewNote[articleId] || (status === 'PUBLISHED' ? 'Disetujui oleh Editor' : 'Perlu revisi lebih lanjut'),
        }),
      });

      if (res.ok) {
        setArticles((prev) => prev.filter((a) => a.id !== articleId));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(null);
    }
  };

  if (articles.length === 0) {
    return (
      <div className="rounded-[36px] bg-white dark:bg-[#18181b] border border-[#ececee] dark:border-[#27272a] p-12 text-center space-y-4">
        <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
        <h3 className="text-lg font-bold text-[#09090b] dark:text-white">
          Antrean Review Kosong
        </h3>
        <p className="text-xs text-[#52525b] dark:text-[#a1a1aa] max-w-md mx-auto">
          Tidak ada naskah yang sedang menunggu persetujuan. Semua artikel telah terbit atau dalam tahap pengerjaan draf oleh penulis.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {articles.map((art) => (
        <div
          key={art.id}
          className="rounded-[36px] bg-white dark:bg-[#18181b] border border-[#ececee] dark:border-[#27272a] p-8 space-y-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#ececee] dark:border-[#27272a] pb-4">
            <div>
              <span className="px-2.5 py-0.5 rounded-[10px] bg-[#ff5a00]/10 text-[#ff5a00] text-[10px] font-bold uppercase">
                {art.category?.name}
              </span>
              <h2 className="text-xl font-bold text-[#09090b] dark:text-white tracking-tight mt-1">
                {art.title}
              </h2>
              <p className="text-xs text-[#71717a] dark:text-[#a1a1aa] mt-1">
                Penulis: {art.author?.displayName} ({art.author?.email}) • Terakhir diperbarui: {formatDate(art.updatedAt)}
              </p>
            </div>

            <Link
              href={`/admin/docs/${art.id}`}
              className="px-4 py-2 rounded-[14px] bg-[#f4f4f5] dark:bg-[#27272a] border border-[#ececee] dark:border-[#3f3f46] text-xs font-bold hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors shrink-0 flex items-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5" />
              Buka di Editor
            </Link>
          </div>

          <div className="p-4 rounded-[20px] bg-[#f4f4f5] dark:bg-[#27272a]/50 border border-[#ececee] dark:border-[#27272a]">
            <p className="text-xs text-[#52525b] dark:text-[#a1a1aa] leading-relaxed line-clamp-3">
              {art.excerpt}
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase text-[#71717a] dark:text-[#a1a1aa]">
              Catatan Redaksi / Umpan Balik Editor:
            </label>
            <input
              type="text"
              placeholder="Tambahkan catatan mengapa naskah disetujui atau bagian mana yang perlu diperbaiki..."
              value={reviewNote[art.id] || ''}
              onChange={(e) => setReviewNote({ ...reviewNote, [art.id]: e.target.value })}
              className="w-full px-4 py-2.5 rounded-[12px] bg-[#f4f4f5] dark:bg-[#27272a] border border-[#ececee] dark:border-[#3f3f46] text-xs focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={() => handleAction(art.id, 'DRAFT')}
              disabled={actionLoading === art.id}
              className="px-4 py-2 rounded-[14px] bg-red-50 hover:bg-red-100 dark:bg-red-950/30 text-red-600 text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <XCircle className="w-4 h-4" />
              Kembalikan ke Draf (Minta Revisi)
            </button>

            <button
              onClick={() => handleAction(art.id, 'PUBLISHED')}
              disabled={actionLoading === art.id}
              className="px-5 py-2 rounded-[14px] bg-[#09090b] text-white hover:bg-[#18181b] text-xs font-bold shadow-awesomic-dark-btn transition-all flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              Setujui &amp; Terbitkan
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
