'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { X, Search, Globe, Share2, Sparkles, Check, AlertCircle } from 'lucide-react';
import { siteConfig } from '@/lib/site';

interface SocialSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  slug: string;
  excerpt: string;
  coverImageUrl?: string | null;
  siteName?: string;
}

export function SocialSimulatorModal({
  isOpen,
  onClose,
  title,
  slug,
  excerpt,
  coverImageUrl,
  siteName = 'SlashJournal // Rekayasa Sistem',
}: SocialSimulatorModalProps) {
  const [activeTab, setActiveTab] = useState<'google' | 'twitter' | 'linkedin'>('google');

  if (!isOpen) return null;

  const fullUrl = `${siteConfig.url}/${slug || 'judul-artikel'}`;
  const displayTitle = title || 'Judul Naskah Arsitektur Belum Ditentukan';
  const displayDesc = excerpt || 'Ringkasan eksekutif tulisan akan ditampilkan di sini sebagai cuplikan deskripsi mesin pencari dan kartu media sosial.';

  const titleLength = displayTitle.length;
  const descLength = displayDesc.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-2xl rounded-[32px] bg-white dark:bg-[#18181b] border border-[#ececee] dark:border-[#27272a] shadow-2xl p-6 sm:p-8 space-y-6 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#ececee] dark:border-[#27272a]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-[10px] bg-orange-50 dark:bg-orange-950/40 text-[#ff5a00]">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#09090b] dark:text-white">
                Simulator SEO &amp; Kartu Media Sosial
              </h3>
              <p className="text-xs text-[#71717a] dark:text-[#a1a1aa]">
                Pratinjau bagaimana naskah Anda muncul saat dibagikan atau dicari di internet.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#f4f4f5] dark:hover:bg-[#27272a] text-[#71717a] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-2 p-1 bg-[#f4f4f5] dark:bg-[#27272a] rounded-[14px]">
          <button
            type="button"
            onClick={() => setActiveTab('google')}
            className={`flex-1 py-2 rounded-[10px] text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'google'
                ? 'bg-white dark:bg-[#18181b] text-[#09090b] dark:text-white shadow-xs'
                : 'text-[#71717a]'
            }`}
          >
            <Search className="w-3.5 h-3.5 text-[#ff5a00]" />
            <span>Google Search</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('twitter')}
            className={`flex-1 py-2 rounded-[10px] text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'twitter'
                ? 'bg-white dark:bg-[#18181b] text-[#09090b] dark:text-white shadow-xs'
                : 'text-[#71717a]'
            }`}
          >
            <span>𝕏 (Twitter)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('linkedin')}
            className={`flex-1 py-2 rounded-[10px] text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'linkedin'
                ? 'bg-white dark:bg-[#18181b] text-[#09090b] dark:text-white shadow-xs'
                : 'text-[#71717a]'
            }`}
          >
            <span>LinkedIn / Slack</span>
          </button>
        </div>

        {/* Simulator View Area */}
        <div className="space-y-4">
          {activeTab === 'google' && (
            <div className="p-5 rounded-[20px] bg-white dark:bg-[#121214] border border-[#ececee] dark:border-[#27272a] space-y-2">
              <div className="flex items-center gap-2 text-xs text-[#52525b] dark:text-[#a1a1aa]">
                <div className="w-4 h-4 rounded-full bg-[#ff5a00] text-white flex items-center justify-center text-[9px] font-bold">
                  //
                </div>
                <span className="font-medium text-[#09090b] dark:text-white">{new URL(siteConfig.url).host}</span>
                <span>›</span>
                <span className="font-mono text-[#71717a] truncate max-w-[280px]">{slug || 'artikel'}</span>
              </div>

              <h4 className="text-base sm:text-lg font-medium text-[#1a0dab] dark:text-[#8ab4f8] hover:underline cursor-pointer leading-snug">
                {displayTitle}
              </h4>

              <p className="text-xs sm:text-sm text-[#4d5156] dark:text-[#bdc1c6] leading-relaxed line-clamp-2">
                {displayDesc}
              </p>
            </div>
          )}

          {activeTab === 'twitter' && (
            <div className="rounded-[20px] bg-black border border-[#2f3336] overflow-hidden text-white space-y-0 max-w-md mx-auto">
              {coverImageUrl ? (
                <div className="relative w-full h-44 bg-zinc-900">
                  <Image src={coverImageUrl} alt={displayTitle} fill unoptimized className="object-cover" />
                </div>
              ) : (
                <div className="w-full h-36 bg-zinc-900 flex items-center justify-center font-mono text-xl text-[#ff5a00]">
                  // SLASHJOURNAL
                </div>
              )}
              <div className="p-4 space-y-1 bg-[#16181c]">
                <p className="text-[10.5px] text-[#71767b] uppercase tracking-wider">{new URL(siteConfig.url).host}</p>
                <h5 className="text-xs sm:text-sm font-bold text-white leading-snug line-clamp-2">
                  {displayTitle}
                </h5>
                <p className="text-[11px] text-[#71767b] line-clamp-2 leading-relaxed">
                  {displayDesc}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'linkedin' && (
            <div className="rounded-[20px] bg-white dark:bg-[#1b1f23] border border-[#ececee] dark:border-[#27272a] overflow-hidden max-w-md mx-auto">
              {coverImageUrl ? (
                <div className="relative w-full h-44 bg-zinc-100 dark:bg-zinc-800">
                  <Image src={coverImageUrl} alt={displayTitle} fill unoptimized className="object-cover" />
                </div>
              ) : (
                <div className="w-full h-36 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center font-mono text-xl text-[#ff5a00]">
                  // SLASHJOURNAL
                </div>
              )}
              <div className="p-4 space-y-1">
                <h5 className="text-xs sm:text-sm font-bold text-[#09090b] dark:text-white leading-snug line-clamp-2">
                  {displayTitle}
                </h5>
                <p className="text-[11px] text-[#71717a] dark:text-[#a1a1aa] uppercase font-semibold">
                  {new URL(siteConfig.url).host} • 3 mnt baca
                </p>
              </div>
            </div>
          )}

          {/* SEO Health Indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
            <div className="p-3 rounded-[14px] bg-[#f4f4f5] dark:bg-[#27272a] flex items-center justify-between">
              <div>
                <p className="font-semibold text-[#09090b] dark:text-white">Panjang Judul</p>
                <p className="text-[11px] text-[#71717a]">{titleLength} / 60 karakter ideal</p>
              </div>
              {titleLength > 0 && titleLength <= 65 ? (
                <span className="p-1 rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                  <Check className="w-3.5 h-3.5" />
                </span>
              ) : (
                <span className="p-1 rounded-full bg-orange-100 text-[#ff5a00] dark:bg-orange-950 dark:text-[#ff5a00]">
                  <AlertCircle className="w-3.5 h-3.5" />
                </span>
              )}
            </div>

            <div className="p-3 rounded-[14px] bg-[#f4f4f5] dark:bg-[#27272a] flex items-center justify-between">
              <div>
                <p className="font-semibold text-[#09090b] dark:text-white">Panjang Ringkasan</p>
                <p className="text-[11px] text-[#71717a]">{descLength} / 160 karakter ideal</p>
              </div>
              {descLength >= 50 && descLength <= 165 ? (
                <span className="p-1 rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                  <Check className="w-3.5 h-3.5" />
                </span>
              ) : (
                <span className="p-1 rounded-full bg-orange-100 text-[#ff5a00] dark:bg-orange-950 dark:text-[#ff5a00]">
                  <AlertCircle className="w-3.5 h-3.5" />
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-[12px] bg-[#09090b] dark:bg-white text-white dark:text-[#09090b] text-xs font-bold hover:bg-[#18181b] transition-all"
          >
            Selesai Meninjau
          </button>
        </div>
      </div>
    </div>
  );
}
