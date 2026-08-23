import React from 'react';
import type { Metadata } from 'next';
import { absoluteUrl } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Kebijakan Cookie & Sesi',
  description: 'Informasi penggunaan cookie fungsional dan penyimpanan sesi aman.',
  alternates: { canonical: absoluteUrl('/cookie-policy') },
};

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen max-w-[1200px] mx-auto px-4 sm:px-6 py-12">
      <div className="rounded-[36px] bg-white dark:bg-[#18181b] border border-[#ececee] dark:border-[#27272a] p-8 sm:p-14 mb-12 space-y-4">
        <span className="px-3 py-1 rounded-[12px] bg-[var(--accent)] text-[var(--accent-foreground)] text-xs font-semibold tracking-wider">
          TRANSPARANSI SESI
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#09090b] dark:text-white leading-[1.15]">
          Kebijakan Cookie & Manajemen Sesi.
        </h1>
        <p className="text-sm sm:text-base text-[#52525b] dark:text-[#a1a1aa] max-w-2xl leading-relaxed">
          SlashJournal mengadopsi pendekatan minimalis: kami tidak menggunakan cookie pelacak iklan pihak ketiga yang invasif.
        </p>
      </div>

      <div className="rounded-[36px] bg-white dark:bg-[#18181b] border border-[#ececee] dark:border-[#27272a] p-8 sm:p-12 space-y-8 text-sm text-[#18181b] dark:text-[#d4d4d8] leading-relaxed max-w-4xl">
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-[#09090b] dark:text-white">
            1. Cookie Sesi Otentikasi (<code>slash_kb_token</code>)
          </h2>
          <p>
            Cookie <code>HttpOnly</code> aman yang digunakan untuk mengidentifikasi status login Anda saat berkomentar atau mengakses dashboard. Cookie ini dilindungi dari manipulasi skrip sisi klien (XSS Protection).
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-[#09090b] dark:text-white">
            2. Preferensi Tema Tampilan (<code>theme</code>)
          </h2>
          <p>
            Disimpan pada <code>localStorage</code> peramban Anda untuk mengingat preferensi Mode Terang (*Light Pure Canvas*) atau Mode Gelap (*Awesomic Dark Zinc*).
          </p>
        </section>
      </div>
    </div>
  );
}
