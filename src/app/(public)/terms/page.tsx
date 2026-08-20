import React from 'react';
import type { Metadata } from 'next';
import { absoluteUrl } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Ketentuan Layanan & Komentar',
  description: 'Aturan etika berkomentar, tanggung jawab pengguna, dan pedoman platform.',
  alternates: { canonical: absoluteUrl('/terms') },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen max-w-[1200px] mx-auto px-4 sm:px-6 py-12">
      <div className="rounded-[36px] bg-white dark:bg-[#18181b] border border-[#ececee] dark:border-[#27272a] p-8 sm:p-14 mb-12 space-y-4">
        <span className="px-3 py-1 rounded-[12px] bg-[var(--accent)] text-white text-xs font-semibold tracking-wider">
          ATURAN PLATFORM
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#09090b] dark:text-white leading-[1.15]">
          Ketentuan Layanan & Pedoman Etika Komentar (S8).
        </h1>
        <p className="text-sm sm:text-base text-[#52525b] dark:text-[#a1a1aa] max-w-2xl leading-relaxed">
          Dengan mengakses SlashJournal dan berpartisipasi dalam diskusi komentar, Anda menyetujui ketentuan berikut demi menjaga kualitas intelektual platform.
        </p>
      </div>

      <div className="rounded-[36px] bg-white dark:bg-[#18181b] border border-[#ececee] dark:border-[#27272a] p-8 sm:p-12 space-y-8 text-sm text-[#18181b] dark:text-[#d4d4d8] leading-relaxed max-w-4xl">
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-[#09090b] dark:text-white">
            1. Etika Komentar & Diskusi Teknis
          </h2>
          <p>
            Komentar terbuka untuk semua pembaca terautentikasi. Dilarang keras memposting ujaran kebencian, spam tautan komersial yang tidak relevan, pelecehan personal, atau muatan yang melanggar hukum Republik Indonesia.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-[#09090b] dark:text-white">
            2. Tanggung Jawab Konten & Hak Cipta
          </h2>
          <p>
            Seluruh artikel, diagram arsitektur Mermaid, dan materi editorial adalah karya asli berhak cipta. Pengutipan diperbolehkan dengan mencantumkan tautan aktif ke halaman asli (prinsip atribusi).
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-[#09090b] dark:text-white">
            3. Penolakan Jaminan Teknis
          </h2>
          <p>
            Panduan teknis dan cuplikan kode disediakan dengan itikad baik untuk tujuan pembelajaran dan analisis arsitektur. Anda disarankan melakukan pengujian menyeluruh di lingkungan staging sebelum menerapkannya di sistem produksi Anda.
          </p>
        </section>
      </div>
    </div>
  );
}
