'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { BookmarkButton } from '@/components/wiki/BookmarkButton';
import { Share2, Check, ArrowLeft } from 'lucide-react';

interface StickyReadingHeaderProps {
  articleId: string;
  title: string;
  slug: string;
  authorName: string;
  readingTime: number;
}

export function StickyReadingHeader({
  articleId,
  title,
  authorName,
  readingTime,
}: StickyReadingHeaderProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [copied, setCopied] = useState(false);
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;

      setIsVisible(scrollY > 450);

      if (docHeight > 0) {
        setProgress(Math.min(100, Math.max(0, (scrollY / docHeight) * 100)));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => () => {
    if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
  }, []);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
      copyTimerRef.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const shareOnTwitter = () => {
    const text = encodeURIComponent(`"${title}" oleh ${authorName} di SlashJournal`);
    const url = encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '');
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  };

  const shareOnLinkedIn = () => {
    const url = encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '');
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
  };

  const shareOnWhatsApp = () => {
    const text = encodeURIComponent(`Baca "${title}": `);
    const url = encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '');
    window.open(`https://api.whatsapp.com/send?text=${text}${url}`, '_blank');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-x-0 top-[68px] z-30 border-b border-[var(--border-color)] bg-[var(--bg-primary)]/90 backdrop-blur-md transition-all duration-300 animate-in slide-in-from-top-4">
      <div
        className="absolute left-0 top-0 h-[2px] bg-[var(--accent)] transition-all duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />

      <div className="mx-auto flex h-14 max-w-editorial items-center justify-between gap-4 px-5 sm:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            href="/"
            className="shrink-0 rounded-lg p-1.5 text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-card-muted)]"
            aria-label="Kembali ke beranda"
            title="Kembali ke Beranda"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="min-w-0">
            <h4 className="truncate font-display text-sm font-medium leading-tight text-[var(--text-primary)]">
              {title}
            </h4>
            <p className="truncate text-[11px] text-[var(--text-muted)]">
              {authorName} · {readingTime} mnt baca
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <div className="hidden items-center gap-0.5 border-r border-[var(--border-color)] pr-2 sm:flex">
            <button
              type="button"
              onClick={shareOnTwitter}
              aria-label="Bagikan ke X (Twitter)"
              className="rounded-md px-2 py-1.5 text-xs font-medium text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
              title="Bagikan ke 𝕏 (Twitter)"
            >
              𝕏
            </button>
            <button
              type="button"
              onClick={shareOnLinkedIn}
              aria-label="Bagikan ke LinkedIn"
              className="rounded-md px-2 py-1.5 text-xs font-medium text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
              title="Bagikan ke LinkedIn"
            >
              in
            </button>
            <button
              type="button"
              onClick={shareOnWhatsApp}
              aria-label="Bagikan ke WhatsApp"
              className="rounded-md px-2 py-1.5 text-xs font-medium text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
              title="Bagikan ke WhatsApp"
            >
              WA
            </button>
          </div>

          <button
            type="button"
            onClick={handleCopyLink}
            aria-label={copied ? 'Tautan tersalin' : 'Salin tautan naskah'}
            className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
            title="Salin Tautan Naskah"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-[var(--accent)]" />
                <span className="text-[var(--accent)]">Tersalin</span>
              </>
            ) : (
              <>
                <Share2 className="h-3.5 w-3.5" />
                <span className="hidden md:inline">Salin</span>
              </>
            )}
          </button>

          <BookmarkButton articleId={articleId} />
        </div>
      </div>
    </div>
  );
}
