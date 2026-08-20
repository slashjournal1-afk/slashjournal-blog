'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Quote, Share2, Copy, Check, Sparkles } from 'lucide-react';

interface InlineSelectionQuoteProps {
  articleTitle: string;
}

function TwitterIcon({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={`fill-current ${className}`}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedInIcon({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={`fill-current ${className}`}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451c.979 0 1.778-.773 1.778-1.729V1.73C24 .774 23.205 0 22.225 0z" />
    </svg>
  );
}

export function InlineSelectionQuote({ articleTitle }: InlineSelectionQuoteProps) {
  const [selectedText, setSelectedText] = useState('');
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();

      if (!selection || selection.isCollapsed) {
        if (!popoverRef.current?.matches(':hover')) {
          setPosition(null);
          setSelectedText('');
        }
        return;
      }

      const text = selection.toString().trim();
      if (text.length < 5) {
        setPosition(null);
        setSelectedText('');
        return;
      }

      // Ensure selection is inside #article-body
      const anchorNode = selection.anchorNode;
      const articleBody = document.getElementById('article-body');
      if (!articleBody || !anchorNode || !articleBody.contains(anchorNode)) {
        setPosition(null);
        setSelectedText('');
        return;
      }

      try {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();

        // Calculate position relative to document scroll
        setPosition({
          top: rect.top - 52 + window.scrollY,
          left: Math.max(20, rect.left + rect.width / 2),
        });
        setSelectedText(text);
      } catch {
        setPosition(null);
      }
    };

    document.addEventListener('mouseup', handleSelectionChange);
    document.addEventListener('keyup', handleSelectionChange);

    return () => {
      document.removeEventListener('mouseup', handleSelectionChange);
      document.removeEventListener('keyup', handleSelectionChange);
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2200);
  };

  const handleCopyFormattedQuote = () => {
    if (!selectedText) return;
    const url = window.location.href;
    const formatted = `> "${selectedText}"\n\n— Dikutip dari: ${articleTitle}\n${url}`;
    navigator.clipboard.writeText(formatted);
    showToast('Kutipan & rujukan berhasil disalin!');
    setPosition(null);
  };

  const handleCopyCleanText = () => {
    if (!selectedText) return;
    navigator.clipboard.writeText(selectedText);
    showToast('Teks berhasil disalin!');
    setPosition(null);
  };

  const handleShareTwitter = () => {
    if (!selectedText) return;
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(
      `"${selectedText.length > 180 ? selectedText.slice(0, 175) + '...' : selectedText}" — via @SlashJournalDev\n\n`
    );
    window.open(
      `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      '_blank',
      'width=600,height=400'
    );
    setPosition(null);
  };

  const handleShareLinkedIn = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      '_blank',
      'width=600,height=480'
    );
    setPosition(null);
  };

  return (
    <>
      {/* Floating Selection Popover */}
      {position && (
        <div
          ref={popoverRef}
          style={{
            position: 'absolute',
            top: `${position.top}px`,
            left: `${position.left}px`,
            transform: 'translateX(-50%)',
          }}
          className="z-50 flex items-center gap-1 p-1.5 rounded-[16px] bg-[#09090b] text-white shadow-2xl border border-[#27272a] animate-in fade-in zoom-in-95 duration-150 backdrop-blur-md"
        >
          {/* Kutip button */}
          <button
            type="button"
            onClick={handleCopyFormattedQuote}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-[10px] text-xs font-semibold text-white hover:bg-[#27272a] hover:text-[var(--accent)] transition-colors"
            title="Salin sebagai Kutipan Markdown dengan Atribusi"
          >
            <Quote className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span className="text-[11px]">Kutip</span>
          </button>

          <span className="w-px h-4 bg-[#27272a]" />

          {/* Share to Twitter / X */}
          <button
            type="button"
            onClick={handleShareTwitter}
            className="p-2 rounded-[10px] text-zinc-300 hover:text-white hover:bg-[#27272a] transition-colors"
            title="Bagikan Kutipan ke 𝕏 (Twitter)"
          >
            <TwitterIcon className="w-3.5 h-3.5" />
          </button>

          {/* Share to LinkedIn */}
          <button
            type="button"
            onClick={handleShareLinkedIn}
            className="p-2 rounded-[10px] text-zinc-300 hover:text-white hover:bg-[#27272a] transition-colors"
            title="Bagikan ke LinkedIn"
          >
            <LinkedInIcon className="w-3.5 h-3.5" />
          </button>

          {/* Copy Clean */}
          <button
            type="button"
            onClick={handleCopyCleanText}
            className="p-2 rounded-[10px] text-zinc-300 hover:text-white hover:bg-[#27272a] transition-colors"
            title="Salin Teks Bersih"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Floating Mini Feedback Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-[16px] bg-[#09090b] text-white text-xs font-bold shadow-xl border border-emerald-500/40 animate-in slide-in-from-bottom-2 duration-150">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </>
  );
}
