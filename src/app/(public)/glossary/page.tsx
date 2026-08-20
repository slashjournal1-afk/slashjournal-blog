import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import { ArrowRight } from 'lucide-react';
import { PageIntro } from '@/components/layout/PageIntro';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Glosarium Istilah Arsitektur A-Z | SlashJournal',
  description: 'Kamus teknis arsitektur perangkat lunak, database engineering, dan protokol terdistribusi.',
};

export default async function GlossaryIndexPage() {
  const terms = await prisma.glossaryTerm.findMany({
    orderBy: { term: 'asc' },
  });

  // Group terms by first letter
  const alphabetMap: { [key: string]: typeof terms } = {};
  for (const t of terms) {
    const letter = t.term.charAt(0).toUpperCase();
    if (!alphabetMap[letter]) alphabetMap[letter] = [];
    alphabetMap[letter].push(t);
  }

  const sortedLetters = Object.keys(alphabetMap).sort();

  return (
    <div className="min-h-screen max-w-[1200px] mx-auto px-4 sm:px-6 py-12">
      <div className="mb-12 space-y-6">
        <PageIntro eyebrow="Kamus teknis A-Z" title="Glosarium arsitektur dan rekayasa" description="Definisi padat yang terhubung langsung dari setiap naskah melalui WikiLink." count={`${terms.length} istilah`} />

        {/* Quick jump letters */}
        <div className="flex flex-wrap gap-2 pt-2">
          {sortedLetters.map((letter) => (
            <a
              key={letter}
              href={`#letter-${letter}`}
              className="w-8 h-8 rounded-[10px] bg-[#f4f4f5] dark:bg-[#27272a] hover:bg-[#09090b] hover:text-white dark:hover:bg-white dark:hover:text-[#09090b] flex items-center justify-center text-xs font-bold transition-colors"
            >
              {letter}
            </a>
          ))}
        </div>
      </div>

      {/* Grouped Alphabetical List */}
      <div className="space-y-12">
        {sortedLetters.map((letter) => (
          <div key={letter} id={`letter-${letter}`} className="space-y-4">
            <div className="flex items-center gap-3 border-b border-[#ececee] dark:border-[#27272a] pb-2">
              <span className="w-10 h-10 rounded-[14px] bg-[#09090b] text-white dark:bg-white dark:text-[#09090b] flex items-center justify-center font-bold text-lg">
                {letter}
              </span>
              <span className="text-xs font-semibold text-[#71717a] dark:text-[#a1a1aa]">
                {alphabetMap[letter].length} Istilah
              </span>
            </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
              {alphabetMap[letter].map((term) => (
                <Link
                  key={term.id}
                  href={`/glossary/${term.slug}`}
                  className="border-b border-[#ececee] py-5 group flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-[#09090b] dark:text-white group-hover:text-[var(--accent)] transition-colors">
                        {term.term}
                      </h3>
                      <span className="text-[10px] px-2 py-0.5 rounded-[8px] bg-[#f4f4f5] dark:bg-[#27272a] text-[#71717a] dark:text-[#a1a1aa] font-semibold">
                        {term.category}
                      </span>
                    </div>
                    <p className="text-xs text-[#52525b] dark:text-[#a1a1aa] leading-relaxed line-clamp-2">
                      {term.shortDef}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#ececee] dark:border-[#27272a] flex items-center justify-between text-xs font-semibold text-[#09090b] dark:text-white">
                    <span>Lihat Definisi Lengkap</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
