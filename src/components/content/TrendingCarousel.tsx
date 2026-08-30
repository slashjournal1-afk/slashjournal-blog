'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export type TrendingArticle = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImageUrl: string | null;
  viewCount: number;
  publishedAt: string | null;
  createdAt: string;
  readingTime: number;
  category: { name: string };
};

export function TrendingCarousel({ articles }: { articles: TrendingArticle[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMotionChange = () => setIsReducedMotion(mediaQuery.matches);
    handleMotionChange();
    mediaQuery.addEventListener('change', handleMotionChange);
    return () => mediaQuery.removeEventListener('change', handleMotionChange);
  }, []);

  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (articles.length < 2 || isReducedMotion || isHovered || isFocused) return;

    timerRef.current = setInterval(() => {
      setActiveIndex((current) => (current + 1) % articles.length);
    }, 6000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [articles.length, isFocused, isHovered, isReducedMotion]);

  if (articles.length === 0) {
    return (
      <section className="rounded-[36px] border border-dashed border-[var(--border-color)] bg-[var(--bg-card)] p-8 sm:p-12" aria-labelledby="trending-empty-title">
        <p className="font-mono text-[11px] font-bold uppercase tracking-wide text-[var(--ember-color)]">// trending</p>
        <h1 id="trending-empty-title" className="mt-3 text-3xl font-bold tracking-tight text-[var(--text-primary)] sm:text-5xl">Belum ada artikel trending.</h1>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-[var(--text-muted)]">Mulai dari jalur belajar atau buka glosarium untuk menemukan materi yang sudah tersedia.</p>
        <div className="mt-6 flex flex-wrap gap-4 text-sm font-semibold"><Link href="/series" className="text-[var(--text-primary)] hover:text-[var(--ember-color)]">Lihat seri panduan</Link><Link href="/glossary" className="text-[var(--text-primary)] hover:text-[var(--ember-color)]">Buka glosarium</Link></div>
      </section>
    );
  }

  const activeArticle = articles[activeIndex] ?? articles[0];
  const position = `${String(activeIndex + 1).padStart(2, '0')} / ${String(articles.length).padStart(2, '0')}`;

  const moveTo = (index: number) => {
    setActiveIndex((index + articles.length) % articles.length);
  };

  return (
    <section
      className="overflow-hidden rounded-[36px] border border-[var(--border-color)] bg-[var(--bg-card)]"
      aria-label="Artikel trending"
      aria-roledescription="carousel"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setIsFocused(false);
      }}
    >
      <div className="grid lg:grid-cols-[1.08fr_0.92fr]">
        <div className="relative aspect-[4/3] min-h-[280px] bg-[var(--bg-card-muted)] lg:aspect-auto lg:min-h-[520px]">
          {activeArticle.coverImageUrl ? (
            <Image src={activeArticle.coverImageUrl} alt="" fill priority={activeIndex === 0} sizes="(min-width: 1024px) 55vw, 100vw" className="object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center bg-[var(--bg-primary)] text-7xl font-mono font-bold tracking-tight text-[var(--ember-color)]" aria-hidden="true">//</div>
          )}
          <div className="absolute left-5 top-5 rounded-[12px] bg-[var(--color-obsidian)] px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-wide text-white dark:bg-white dark:text-[var(--color-obsidian)]">Trending</div>
        </div>

        <div className="flex min-h-[360px] flex-col justify-between p-6 sm:p-10 lg:min-h-[520px]">
          <div>
            <div className="flex items-center justify-between gap-4"><span className="font-mono text-[11px] font-bold uppercase tracking-wide text-[var(--ember-color)]">// artikel paling dibaca</span><span className="font-mono text-xs text-[var(--text-muted)]">{position}</span></div>
            <p className="mt-8 text-xs font-semibold text-[var(--text-muted)]">{activeArticle.category.name}</p>
             <h1 className="mt-3 text-3xl font-bold leading-[1.05] tracking-tight text-[var(--text-primary)] sm:text-5xl">{activeArticle.title}</h1>
            <p className="mt-5 text-sm leading-relaxed text-[var(--text-muted)] sm:text-base">{activeArticle.excerpt}</p>
          </div>

          <div className="mt-8">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[var(--text-muted)]"><span>{activeArticle.readingTime} menit baca</span></div>
            <div className="mt-6 flex flex-wrap items-center gap-3"><Link href={`/${activeArticle.slug}`} className="inline-flex min-h-11 items-center gap-2 rounded-[14px] bg-[var(--color-obsidian)] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[var(--color-graphite)] dark:bg-white dark:text-[var(--color-obsidian)]">Baca artikel <ArrowRight className="h-4 w-4" /></Link><button type="button" onClick={() => moveTo(activeIndex - 1)} className="inline-flex h-11 w-11 items-center justify-center rounded-[14px] border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-[var(--bg-card-muted)]" aria-label="Artikel sebelumnya"><ArrowLeft className="h-4 w-4" /></button><button type="button" onClick={() => moveTo(activeIndex + 1)} className="inline-flex h-11 w-11 items-center justify-center rounded-[14px] border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-[var(--bg-card-muted)]" aria-label="Artikel berikutnya"><ArrowRight className="h-4 w-4" /></button></div>
             <div className="mt-6 flex items-center gap-2" aria-label="Pilihan artikel trending">{articles.map((article, index) => <button key={article.id} type="button" aria-pressed={index === activeIndex} aria-label={`Tampilkan artikel trending ${index + 1}`} onClick={() => moveTo(index)} className={`h-2.5 rounded-full transition-all ${index === activeIndex ? 'w-8 bg-[var(--ember-color)]' : 'w-2.5 bg-[var(--border-color)] hover:bg-[var(--text-muted)]'}`} />)}</div>
          </div>
        </div>
      </div>

      <div className="border-t border-[var(--border-color)] px-4 py-4 sm:px-6" aria-label="Artikel trending lainnya">
        <div className="flex gap-3 overflow-x-auto pb-1 lg:grid lg:grid-cols-5">
          {articles.map((article, index) => (
            <button
              key={article.id}
              type="button"
              aria-pressed={index === activeIndex}
              aria-label={`Tampilkan artikel trending ${index + 1}: ${article.title}`}
              onClick={() => moveTo(index)}
              className={`group min-w-[148px] rounded-[14px] border p-2 text-left transition-opacity lg:min-w-0 ${
                index === activeIndex
                  ? 'border-[var(--ember-color)] bg-[var(--bg-card-muted)] opacity-100'
                  : 'border-[var(--border-color)] bg-transparent opacity-60 hover:opacity-100 focus-visible:opacity-100'
              }`}
            >
              <span className="relative block aspect-[16/9] overflow-hidden rounded-[10px] bg-[var(--bg-primary)]">
                {article.coverImageUrl ? (
                  <Image src={article.coverImageUrl} alt="" fill sizes="(min-width: 1024px) 18vw, 148px" className="object-cover" />
                ) : (
                  <span className="flex h-full items-center justify-center font-mono text-lg font-bold text-[var(--ember-color)]" aria-hidden="true">//</span>
                )}
              </span>
              <span className="mt-2 block line-clamp-2 text-xs font-semibold leading-snug text-[var(--text-primary)]">{article.title}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
