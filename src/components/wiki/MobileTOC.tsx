'use client';

import React, { useState, useEffect } from 'react';
import { List, ChevronDown, Sparkles } from 'lucide-react';

interface HeadingItem {
  text: string;
  id: string;
  level: number;
}

interface MobileTOCProps {
  headings: HeadingItem[];
}

export function MobileTOC({ headings }: MobileTOCProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      {
        rootMargin: '-80px 0px -60% 0px',
        threshold: 0.1,
      }
    );

    for (const h of headings) {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  const scrollToHeading = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -90;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  return (
    <div className="my-6 lg:hidden">
      <div className="rounded-[20px] bg-white dark:bg-[#18181b] border border-[var(--border-color)] shadow-xs overflow-hidden transition-all">
        {/* Toggle Header */}
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="w-full flex items-center justify-between p-4 text-left font-bold text-xs sm:text-sm text-[var(--text-primary)] hover:bg-[var(--bg-card-muted)] transition-colors select-none"
        >
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-[8px] bg-orange-50 dark:bg-orange-950/40 text-[#ff5a00]">
              <List className="w-4 h-4" />
            </div>
            <div>
              <span>Daftar Isi Artikel</span>
              <span className="ml-2 text-[11px] font-normal text-[var(--text-muted)]">
                ({headings.length} bagian)
              </span>
            </div>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-[var(--text-muted)] transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-[#ff5a00]' : ''
            }`}
          />
        </button>

        {/* Collapsible Content */}
        {isOpen && (
          <nav
            aria-label="Table of contents"
            className="border-t border-[var(--border-color)] p-4 space-y-1.5 bg-[#fafafa]/50 dark:bg-[#141416]/50 max-h-72 overflow-y-auto animate-in fade-in zoom-in-95 duration-150"
          >
            {headings.map((h, idx) => {
              const isActive = activeId === h.id;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => scrollToHeading(h.id)}
                  className={`w-full text-left py-1.5 px-2.5 rounded-[10px] text-xs transition-colors flex items-center gap-2 ${
                    h.level === 3 ? 'pl-6 text-[11.5px]' : 'font-medium'
                  } ${
                    isActive
                      ? 'bg-orange-50 dark:bg-orange-950/40 text-[#ff5a00] font-bold'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-muted)]'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isActive ? 'bg-[#ff5a00]' : 'bg-[var(--text-muted)]/40'}`} />
                  <span className="truncate">{h.text}</span>
                </button>
              );
            })}
          </nav>
        )}
      </div>
    </div>
  );
}
