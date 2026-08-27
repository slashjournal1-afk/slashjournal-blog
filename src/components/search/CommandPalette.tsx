'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, BookOpen, FileText, ArrowRight, X, Sparkles, Command, Loader2 } from 'lucide-react';
import { pushDataLayer } from '@/lib/data-layer';

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ articles: any[]; glossaryTerms: any[] }>({
    articles: [],
    glossaryTerms: [],
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  // Listen for Ctrl+K / Cmd+K and custom event
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    const handleCustomOpen = () => setIsOpen(true);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('open-command-palette', handleCustomOpen);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('open-command-palette', handleCustomOpen);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults({ articles: [], glossaryTerms: [] });
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setResults({ articles: [], glossaryTerms: [] });
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`, { signal: controller.signal });
        const data = await res.json();
        setResults({
          articles: data.articles || [],
          glossaryTerms: data.glossaryTerms || [],
        });
        const resultCount = (data.articles || []).length + (data.glossaryTerms || []).length;
        pushDataLayer('site_search', { search_term: query.trim(), search_result_count: resultCount });
        if (resultCount === 0) pushDataLayer('zero_result_search', { search_term: query.trim(), search_result_count: 0 });
        setSelectedIndex(0);
      } catch (err) {
        if (!(err instanceof DOMException && err.name === 'AbortError')) console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    }, 180);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  const allItems = [
    ...results.articles.map((a) => ({ ...a, type: 'article' })),
    ...results.glossaryTerms.map((g) => ({ ...g, type: 'glossary' })),
  ];

  const handleSelect = (item: any) => {
    setIsOpen(false);
    if (item.type === 'article') {
      router.push(`/${item.slug}`);
    } else {
      router.push(`/glossary/${item.slug}`);
    }
  };

  const handleFullSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setIsOpen(false);
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  const handleKeyDownList = (e: React.KeyboardEvent) => {
    if (allItems.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % allItems.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + allItems.length) % allItems.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (allItems[selectedIndex]) {
        handleSelect(allItems[selectedIndex]);
      } else {
        handleFullSearch(e);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-20 px-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-150"
      onClick={() => setIsOpen(false)}
    >
      <div
        className="w-full max-w-2xl rounded-[36px] bg-white dark:bg-[#18181b] border border-[#ececee] dark:border-[#27272a] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDownList}
      >
        {/* Search Header Bar */}
        <form onSubmit={handleFullSearch} className="p-4 sm:p-5 border-b border-[#ececee] dark:border-[#27272a] flex items-center gap-3">
          <Search className="w-5 h-5 text-[var(--accent)] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari konsep arsitektur, diagram, glosarium, atau artikel..."
            className="flex-1 bg-transparent text-sm text-[#09090b] dark:text-white placeholder:text-[var(--text-muted)] focus:outline-none"
          />
          {loading && <Loader2 className="w-4 h-4 text-[var(--accent)] animate-spin" />}
          {query && !loading && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline px-2 py-0.5 text-[10px] font-mono bg-[#f4f4f5] dark:bg-[#27272a] text-[#71717a] dark:text-[#a1a1aa] rounded-md border border-[#ececee] dark:border-[#3f3f46]">
            ESC
          </kbd>
        </form>

        {/* Results / Empty Body */}
        <div className="max-h-[420px] overflow-y-auto p-3 sm:p-4 space-y-4">
          {!loading && query && allItems.length === 0 && (
            <div className="text-center py-10 space-y-3">
              <p className="text-sm font-bold text-[#09090b] dark:text-white">
                Tidak ada hasil untuk &ldquo;{query}&rdquo;
              </p>
              <p className="text-xs text-[var(--text-muted)] max-w-sm mx-auto">
                Kueri ini telah dicatat ke telemetri redaksi untuk pertimbangan pembuatan panduan arsitektur baru.
              </p>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  router.push(`/search?q=${encodeURIComponent(query)}`);
                }}
                className="px-4 py-2 rounded-[12px] bg-[#f4f4f5] dark:bg-[#27272a] text-xs font-bold text-[#09090b] dark:text-white hover:text-[var(--accent)] transition-colors inline-flex items-center gap-1.5"
              >
                <span>Buka di Halaman Pencarian Lengkap</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {!loading && !query && (
            <div className="p-4 text-center text-xs text-[var(--text-muted)] space-y-3">
              <p className="font-bold text-[#09090b] dark:text-white text-sm">
                Pintasan Topik Populer
              </p>
              <div className="flex flex-wrap justify-center gap-2 pt-1">
                {[
                  'idempotency-key',
                  'acid-transactions',
                  'circuit-breaker-pattern',
                  'row-level-security',
                  'clean-architecture',
                  'postgresql',
                ].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setQuery(s)}
                    className="px-3 py-1.5 rounded-[12px] bg-[#f4f4f5] dark:bg-[#27272a] text-xs font-mono font-medium text-[#52525b] dark:text-[#a1a1aa] hover:text-[var(--accent)] dark:hover:text-[var(--accent)] hover:bg-[var(--accent-soft)] transition-all active:scale-95"
                  >
                    #{s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Articles Section */}
          {results.articles.length > 0 && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between px-3 pb-1">
                <p className="text-[10px] font-bold text-[#71717a] uppercase tracking-wider">
                  Artikel &amp; Panduan Arsitektur
                </p>
                <span className="text-[10px] font-mono text-[#71717a]">
                  {results.articles.length} hasil
                </span>
              </div>
              {results.articles.map((item, idx) => {
                const isSelected = selectedIndex === idx;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelect({ ...item, type: 'article' })}
                    className={`w-full p-3 rounded-[20px] text-left flex items-center justify-between transition-all active:scale-[0.99] ${
                      isSelected
                        ? 'bg-[#09090b] text-white dark:bg-white dark:text-[#09090b] shadow-xs'
                        : 'hover:bg-[#f4f4f5] dark:hover:bg-[#27272a]'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <FileText className="w-4 h-4 text-[var(--accent)] shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-bold leading-tight truncate">{item.title}</p>
                        <p
                          className={`text-[11px] line-clamp-1 mt-0.5 ${
                            isSelected ? 'opacity-80' : 'text-[#71717a]'
                          }`}
                        >
                          {item.excerpt}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold opacity-70 shrink-0 ml-3">
                      {item.categoryName}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Glossary Section */}
          {results.glossaryTerms.length > 0 && (
            <div className="space-y-1.5 pt-2 border-t border-[#ececee] dark:border-[#27272a]">
              <div className="flex items-center justify-between px-3 pb-1">
                <p className="text-[10px] font-bold text-[#71717a] uppercase tracking-wider">
                  Glosarium Istilah A-Z
                </p>
                <span className="text-[10px] font-mono text-[#71717a]">
                  {results.glossaryTerms.length} istilah
                </span>
              </div>
              {results.glossaryTerms.map((item, idx) => {
                const realIdx = results.articles.length + idx;
                const isSelected = selectedIndex === realIdx;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelect({ ...item, type: 'glossary' })}
                    className={`w-full p-3 rounded-[20px] text-left flex items-center justify-between transition-all active:scale-[0.99] ${
                      isSelected
                        ? 'bg-[#09090b] text-white dark:bg-white dark:text-[#09090b] shadow-xs'
                        : 'hover:bg-[#f4f4f5] dark:hover:bg-[#27272a]'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <BookOpen className="w-4 h-4 text-[var(--accent)] shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-bold leading-tight truncate">{item.term}</p>
                        <p
                          className={`text-[11px] line-clamp-1 mt-0.5 ${
                            isSelected ? 'opacity-80' : 'text-[#71717a]'
                          }`}
                        >
                          {item.shortDef}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold opacity-70 shrink-0 ml-3">
                      {item.category}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer info bar */}
        <div className="p-3.5 bg-[#f4f4f5] dark:bg-[#121214] border-t border-[#ececee] dark:border-[#27272a] flex items-center justify-between text-[11px] text-[#71717a]">
          <div className="flex items-center gap-2">
            <span>Panah <kbd className="font-mono font-bold">↑↓</kbd> navigasi</span>
            <span>•</span>
            <span><kbd className="font-mono font-bold">↵</kbd> buka naskah</span>
          </div>
          {query && (
            <button
              type="button"
              onClick={handleFullSearch}
              className="font-bold text-[var(--accent)] hover:underline inline-flex items-center gap-1"
            >
              <span>Halaman Lengkap</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
