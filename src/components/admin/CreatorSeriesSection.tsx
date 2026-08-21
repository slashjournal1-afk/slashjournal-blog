'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Plus,
  ArrowUpRight,
  Layers,
  CheckCircle2,
  Globe,
  FileText,
} from 'lucide-react';
import { NewSeriesModal } from '@/components/editor/NewSeriesModal';
import { NewCategoryModal } from '@/components/editor/NewCategoryModal';

export interface SeriesItem {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  coverImageUrl: string | null;
  isPublished: boolean;
  sortOrder: number;
  _count?: {
    articles: number;
  };
}

interface CreatorSeriesSectionProps {
  initialSeries: SeriesItem[];
}

export function CreatorSeriesSection({ initialSeries }: CreatorSeriesSectionProps) {
  const [seriesList, setSeriesList] = useState<SeriesItem[]>(initialSeries);
  const [isSeriesModalOpen, setIsSeriesModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const handleSeriesCreated = (newSeries: any) => {
    setSeriesList((prev) => [
      {
        id: newSeries.id,
        title: newSeries.title,
        slug: newSeries.slug,
        description: newSeries.description || null,
        coverImageUrl: newSeries.coverImageUrl || null,
        isPublished: newSeries.isPublished ?? true,
        sortOrder: newSeries.sortOrder ?? 0,
        _count: { articles: 0 },
      },
      ...prev,
    ]);
    setFeedbackMsg(`Seri panduan "${newSeries.title}" berhasil dibuat!`);
    setTimeout(() => setFeedbackMsg(null), 5000);
  };

  const handleCategoryCreated = (newCategory: any) => {
    setFeedbackMsg(`Kategori baru "${newCategory.name}" berhasil dibuat!`);
    setTimeout(() => setFeedbackMsg(null), 5000);
  };

  return (
    <div className="rounded-[28px] border border-[var(--border-color)] bg-[var(--bg-card)] p-6 sm:p-8 space-y-6 shadow-xs">
      {/* Header & Quick Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-[8px] bg-orange-500/10 text-[#ff5a00]">
              <BookOpen className="w-4 h-4" />
            </span>
            <h3 className="text-[16px] font-bold text-[var(--text-primary)]">
              Koleksi Seri Panduan &amp; Jalur Belajar
            </h3>
          </div>
          <p className="text-xs text-[var(--text-muted)]">
            Kurasi rangkaian artikel berurutan dari prinsip fundamental hingga implementasi skala produksi.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setIsCategoryModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-[12px] bg-[var(--bg-card-muted)] border border-[var(--border-color)] hover:border-[#ff5a00] text-xs font-bold text-[var(--text-primary)] transition-all active:scale-95"
            title="Tambah Kategori / Kanal Baru"
          >
            <Layers className="w-3.5 h-3.5 text-[#ff5a00]" />
            <span>+ Kategori</span>
          </button>

          <button
            type="button"
            onClick={() => setIsSeriesModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-[12px] bg-[#09090b] dark:bg-white text-white dark:text-[#09090b] hover:bg-[#18181b] dark:hover:bg-zinc-200 text-xs font-bold shadow-awesomic-dark-btn transition-all active:scale-95"
          >
            <Plus className="w-3.5 h-3.5 text-[#ff5a00]" />
            <span>Buat Seri Baru</span>
          </button>
        </div>
      </div>

      {/* Success Notification Feedback */}
      {feedbackMsg && (
        <div className="p-3.5 rounded-[16px] bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Series Cards Grid */}
      {seriesList.length === 0 ? (
        <div className="py-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-[16px] bg-[#f4f4f5] dark:bg-[#27272a] text-[#71717a] mx-auto flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-[var(--text-primary)]">
            Belum Ada Seri Panduan Dibuat
          </h4>
          <p className="text-xs text-[var(--text-muted)] max-w-sm mx-auto">
            Buat seri panduan pertama Anda untuk merangkai beberapa bab naskah artikel menjadi satu kesatuan kurikulum.
          </p>
          <button
            type="button"
            onClick={() => setIsSeriesModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-[12px] bg-[#ff5a00] text-white text-xs font-bold mt-1 shadow-xs hover:bg-[#e04f00] active:scale-95 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Buat Seri Panduan Pertama</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {seriesList.map((ser) => {
            const articleCount = ser._count?.articles ?? 0;
            return (
              <div
                key={ser.id}
                className="p-5 rounded-[22px] bg-[var(--bg-card-muted)] border border-[var(--border-color)] flex flex-col justify-between space-y-4 hover:border-[#ff5a00]/50 transition-all group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-[8px] bg-orange-500/10 text-[#ff5a00] font-mono text-[9.5px] font-bold uppercase tracking-wider">
                      SERI PANDUAN
                    </span>
                    <span
                      className={`text-[9.5px] px-2 py-0.5 rounded-full font-mono font-bold ${
                        ser.isPublished
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : 'bg-zinc-500/10 text-zinc-500'
                      }`}
                    >
                      {ser.isPublished ? 'PUBLIK' : 'DRAF'}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-[var(--text-primary)] leading-snug group-hover:text-[#ff5a00] transition-colors">
                    {ser.title}
                  </h4>

                  {ser.description && (
                    <p className="text-xs text-[var(--text-muted)] line-clamp-2 leading-relaxed">
                      {ser.description}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-[var(--border-color)] flex items-center justify-between text-xs text-[var(--text-muted)] font-mono">
                  <span className="flex items-center gap-1 font-bold text-[var(--text-primary)]">
                    <FileText className="w-3.5 h-3.5 text-[#ff5a00]" />
                    {articleCount} Bab Naskah
                  </span>

                  <Link
                    href={`/series/${ser.slug}`}
                    target="_blank"
                    className="flex items-center gap-1 text-[#ff5a00] hover:underline font-semibold font-sans text-xs"
                  >
                    <span>Buka Seri</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Series Modal */}
      <NewSeriesModal
        isOpen={isSeriesModalOpen}
        onClose={() => setIsSeriesModalOpen(false)}
        onCreated={handleSeriesCreated}
      />

      {/* Category Modal */}
      <NewCategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onCreated={handleCategoryCreated}
      />
    </div>
  );
}
