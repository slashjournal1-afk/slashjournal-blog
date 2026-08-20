'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { Bookmark, ArrowRight, BookOpen, Trash2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { PageIntro } from '@/components/layout/PageIntro';

export default function BookmarksPage() {
  const { user, openAuthModal } = useAuth();
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    fetch('/api/bookmarks')
      .then((res) => res.json())
      .then((data) => {
        if (data.bookmarks) {
          setBookmarks(data.bookmarks);
        }
      })
      .catch((err) => console.error('Failed to fetch bookmarks:', err))
      .finally(() => setLoading(false));
  }, [user]);

  const handleRemove = async (articleId: string) => {
    try {
      await fetch('/api/bookmarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleId }),
      });
      setBookmarks((prev) => prev.filter((b) => b.article.id !== articleId));
    } catch (e) {
      console.error(e);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen max-w-[1200px] mx-auto px-4 sm:px-6 py-20 text-center">
        <div className="max-w-md mx-auto border-t border-[var(--border-color)] pt-8 space-y-6">
          <div className="w-12 h-12 rounded-[20px] bg-[var(--accent-soft)] text-[var(--accent)] flex items-center justify-center mx-auto">
            <Bookmark className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-[#09090b] dark:text-white">
            Masuk untuk Melihat Bookmark
          </h2>
          <p className="text-xs text-[#52525b] dark:text-[#a1a1aa] leading-relaxed">
            Simpan artikel arsitektur favorit Anda untuk dibaca kembali kapan saja.
          </p>
          <button
            onClick={openAuthModal}
            className="w-full py-3 rounded-[14px] bg-[#09090b] text-white hover:bg-[#18181b] text-xs font-bold shadow-awesomic-dark-btn transition-all"
          >
            Masuk / Buat Akun
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-[1200px] mx-auto px-4 sm:px-6 py-12">
      <div className="mb-12"><PageIntro eyebrow="Pustaka pribadi" title="Artikel tersimpan" description="Kembali ke naskah yang ingin Anda baca lagi." count={`${bookmarks.length} artikel`} /></div>

      {loading ? (
        <div className="text-center py-16 text-xs text-[#71717a]">Memuat bookmark...</div>
      ) : bookmarks.length === 0 ? (
        <div className="text-center py-20 rounded-[36px] bg-white dark:bg-[#18181b] border border-[#ececee] dark:border-[#27272a] p-10 space-y-4">
          <BookOpen className="w-10 h-10 text-[#a1a1aa] mx-auto" />
          <h3 className="text-base font-bold text-[#09090b] dark:text-white">Belum Ada Artikel Tersimpan</h3>
          <p className="text-xs text-[#52525b] dark:text-[#a1a1aa] max-w-sm mx-auto">
            Gunakan tombol bookmark di setiap bab artikel untuk menyimpannya di sini.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-[14px] bg-[#09090b] text-white text-xs font-bold shadow-awesomic-dark-btn"
          >
            Jelajahi Artikel
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarks.map(({ article }) => (
            <div
              key={article.id}
              className="rounded-[36px] bg-white dark:bg-[#18181b] border border-[#ececee] dark:border-[#27272a] overflow-hidden flex flex-col justify-between group hover:border-zinc-300 dark:hover:border-zinc-700 transition-all relative"
            >
              <div className="p-7 space-y-3">
                <span className="px-2.5 py-0.5 rounded-[12px] bg-[#f4f4f5] dark:bg-[#27272a] text-[#52525b] dark:text-[#a1a1aa] text-[11px] font-semibold">
                  {article.category?.name}
                </span>

                <Link href={`/${article.slug}`}>
                  <h3 className="text-lg font-bold text-[#09090b] dark:text-white tracking-tight leading-snug group-hover:text-[var(--accent)] transition-colors mt-2">
                    {article.title}
                  </h3>
                </Link>

                <p className="text-xs text-[#52525b] dark:text-[#a1a1aa] leading-relaxed line-clamp-3">
                  {article.excerpt}
                </p>
              </div>

              <div className="p-7 pt-0 flex items-center justify-between border-t border-[#ececee] dark:border-[#27272a] mt-4 pt-4 text-xs">
                <Link
                  href={`/${article.slug}`}
                  className="font-bold text-[#09090b] dark:text-white hover:text-[var(--accent)] flex items-center gap-1"
                >
                  Buka Artikel <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <button
                  onClick={() => handleRemove(article.id)}
                  className="p-1.5 rounded-[8px] text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                  title="Hapus dari Bookmark"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
