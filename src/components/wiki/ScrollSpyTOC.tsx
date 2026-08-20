'use client';

import React, { useEffect, useState } from 'react';

export interface TOCHeading {
  text: string;
  id: string;
  level: number;
}

interface ScrollSpyTOCProps {
  headings: TOCHeading[];
}

export function ScrollSpyTOC({ headings }: ScrollSpyTOCProps) {
  const [activeId, setActiveId] = useState<string>(headings[0]?.id || '');

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-80px 0% -60% 0%',
        threshold: 0.1,
      }
    );

    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav aria-label="Daftar isi" className="border-t border-[var(--border-color)] pt-6">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--text-primary)]">
        Daftar Isi
      </p>
      <div className="mt-4 space-y-1 border-l border-[var(--border-color)]">
        {headings.map((h, i) => {
          const isActive = activeId === h.id;

          return (
            <a
              key={i}
              href={`#${h.id}`}
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById(h.id);
                if (el) {
                  const y = el.getBoundingClientRect().top + window.pageYOffset - 90;
                  window.scrollTo({ top: y, behavior: 'smooth' });
                  setActiveId(h.id);
                }
              }}
              className={`block border-l-2 py-1.5 text-[13px] leading-snug transition-colors ${
                isActive
                  ? 'border-[var(--accent)] font-medium text-[var(--text-primary)]'
                  : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              } ${h.level === 3 ? 'pl-7 text-xs' : 'pl-4'}`}
            >
              {h.text}
            </a>
          );
        })}
      </div>
    </nav>
  );
}