import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Mail, Send, Shield, PenLine, Sparkles, Clock } from 'lucide-react';
import { PageIntro } from '@/components/layout/PageIntro';
import { ContactForm } from './ContactForm';
import { absoluteUrl, siteConfig } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Kontak & Hak Jawab',
  description:
    'Hubungi redaksi SlashJournal untuk koreksi teknis, kemitraan sponsor, kontribusi penulis, atau permintaan data pribadi sesuai UU PDP.',
  alternates: { canonical: absoluteUrl('/contact') },
};

const VALID_SUBJECTS = ['correction', 'sponsor', 'author', 'privacy', 'general'];

export default async function ContactPage({
  searchParams,
}: {
  searchParams?: Promise<{ subject?: string }>;
}) {
  const params = (await searchParams) || {};
  const initialSubject = VALID_SUBJECTS.includes(params.subject || '') ? params.subject! : 'general';

  return (
    <div className="min-h-screen max-w-[1200px] mx-auto px-4 sm:px-6 py-12">
      <div className="mb-12"><PageIntro eyebrow="Kontak dan hak jawab" title="Koreksi teknis, kemitraan, atau permintaan data" description="Kirim koreksi fakta atau kode, proposal sponsor yang relevan, atau permintaan hak akses data sesuai UU PDP." /></div>

      {/* Jalur kontak langsung — verifikabel, bukan hanya formulir */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <a
          href={`mailto:${siteConfig.contactEmail}`}
          className="rounded-[24px] bg-white dark:bg-[#18181b] border border-[#ececee] dark:border-[#27272a] p-5 flex items-center gap-4 hover:border-[var(--accent)] transition-colors"
        >
          <span className="w-10 h-10 rounded-[14px] bg-[#f4f4f5] dark:bg-[#27272a] flex items-center justify-center text-[var(--accent)] shrink-0">
            <Mail className="w-5 h-5" />
          </span>
          <span>
            <span className="block text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--text-muted)]">Email Redaksi</span>
            <span className="block text-sm font-bold text-[#09090b] dark:text-white">{siteConfig.contactEmail}</span>
          </span>
        </a>
        <a
          href={`mailto:${siteConfig.privacyEmail}?subject=Permintaan%20Data%20Pribadi%20(UU%20PDP)`}
          className="rounded-[24px] bg-white dark:bg-[#18181b] border border-[#ececee] dark:border-[#27272a] p-5 flex items-center gap-4 hover:border-[var(--accent)] transition-colors"
        >
          <span className="w-10 h-10 rounded-[14px] bg-[#f4f4f5] dark:bg-[#27272a] flex items-center justify-center text-[var(--accent)] shrink-0">
            <Shield className="w-5 h-5" />
          </span>
          <span>
            <span className="block text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--text-muted)]">Privasi &amp; Data (UU PDP)</span>
            <span className="block text-sm font-bold text-[#09090b] dark:text-white">{siteConfig.privacyEmail}</span>
          </span>
        </a>
        <div className="rounded-[24px] bg-white dark:bg-[#18181b] border border-[#ececee] dark:border-[#27272a] p-5 flex items-center gap-4">
          <span className="w-10 h-10 rounded-[14px] bg-[#f4f4f5] dark:bg-[#27272a] flex items-center justify-center text-[var(--accent)] shrink-0">
            <Clock className="w-5 h-5" />
          </span>
          <span>
            <span className="block text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--text-muted)]">Waktu Respons</span>
            <span className="block text-sm font-bold text-[#09090b] dark:text-white">Hari kerja, maks. 3×24 jam</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Contact Form */}
        <div className="lg:col-span-7">
          <div className="rounded-[36px] bg-white dark:bg-[#18181b] border border-[#ececee] dark:border-[#27272a] p-8 sm:p-10">
            <ContactForm initialSubject={initialSubject} />
            <p className="mt-5 text-[11px] leading-relaxed text-[#71717a] dark:text-[#a1a1aa]">
              Setiap pesan tersimpan di sistem redaksi dan ditinjau manual. Pesan terkait data
              pribadi diproses sesuai <Link href="/privacy-policy" className="font-semibold underline underline-offset-2">Kebijakan Privasi</Link> dan
              UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi.
            </p>
          </div>
        </div>

        {/* Info Col */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-[36px] bg-white dark:bg-[#18181b] border border-[#ececee] dark:border-[#27272a] p-8 space-y-4">
            <div className="w-10 h-10 rounded-[14px] bg-[#f4f4f5] dark:bg-[#27272a] flex items-center justify-center text-[var(--accent)]">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#09090b] dark:text-white">
              Slot Kemitraan &amp; Advertorial
            </h3>
            <p className="text-xs text-[#52525b] dark:text-[#a1a1aa] leading-relaxed">
              Kami menerima penempatan banner sponsor billboard, native in-feed cards, dan penulisan artikel bersponsor mendalam. Seluruh pos bersponsor akan memiliki penanda transparan <code>POS BERSPONSOR</code>.
            </p>
          </div>

          <div className="rounded-[36px] bg-white dark:bg-[#18181b] border border-[#ececee] dark:border-[#27272a] p-8 space-y-4">
            <div className="w-10 h-10 rounded-[14px] bg-[#f4f4f5] dark:bg-[#27272a] flex items-center justify-center text-[var(--accent)]">
              <PenLine className="w-5 h-5" />
            </div>
            <p className="text-[11px] font-bold uppercase tracking-wide text-[var(--accent)]">Kontributor</p>
            <h3 className="text-base font-bold text-[#09090b] dark:text-white">Punya pengalaman produksi untuk dibagikan?</h3>
            <p className="text-xs text-[#52525b] dark:text-[#a1a1aa] leading-relaxed">Kirim proposal tulisan tentang sistem, database, backend, atau rekayasa antarmuka.</p>
             <Link href="/contact?subject=author" className="inline-flex items-center gap-2 text-xs font-bold text-[#09090b] dark:text-white hover:text-[var(--accent)]">Daftar menjadi penulis <Send className="w-3.5 h-3.5" /></Link>
          </div>

          <div className="rounded-[36px] bg-white dark:bg-[#18181b] border border-[#ececee] dark:border-[#27272a] p-8 space-y-4">
            <div className="w-10 h-10 rounded-[14px] bg-[#f4f4f5] dark:bg-[#27272a] flex items-center justify-center text-[var(--accent)]">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#09090b] dark:text-white">
              Hak Jawab & Koreksi Terbuka
            </h3>
            <p className="text-xs text-[#52525b] dark:text-[#a1a1aa] leading-relaxed">
              Setiap catatan pembaca akan dicatat dalam riwayat revisi permanen untuk menjamin akurasi dan integritas intelektual platform.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
