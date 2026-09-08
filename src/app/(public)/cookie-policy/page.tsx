import React from 'react';
import type { Metadata } from 'next';
import { absoluteUrl } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Kebijakan Cookie',
  description: 'Informasi penggunaan cookie fungsional, analitik, dan periklanan pihak ketiga Google AdSense pada SlashJournal.',
  alternates: { canonical: absoluteUrl('/cookie-policy') },
};

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen max-w-[1200px] mx-auto px-4 sm:px-6 py-12">
      <div className="rounded-[36px] bg-white dark:bg-[#18181b] border border-[#ececee] dark:border-[#27272a] p-8 sm:p-14 mb-12 space-y-4">
        <span className="px-3 py-1 rounded-[12px] bg-[var(--accent)] text-[var(--accent-foreground)] text-xs font-semibold tracking-wider uppercase">
          Transparansi Cookie
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#09090b] dark:text-white leading-[1.15]">
          Kebijakan Cookie &amp; Pengelolaan Sesi
        </h1>
        <p className="text-sm sm:text-base text-[#52525b] dark:text-[#a1a1aa] max-w-2xl leading-relaxed">
          SlashJournal menggunakan cookie dan teknologi penyimpanan web lokal untuk memastikan keandalan fungsi platform, mengingat preferensi pengguna, mengukur performa bacaan, serta menayangkan iklan yang relevan.
        </p>
      </div>

      <div className="rounded-[36px] bg-white dark:bg-[#18181b] border border-[#ececee] dark:border-[#27272a] p-8 sm:p-12 space-y-8 text-sm text-[#18181b] dark:text-[#d4d4d8] leading-relaxed max-w-4xl">
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-[#09090b] dark:text-white">
            1. Cookie Esensial &amp; Autentikasi (<code>slash_kb_token</code>)
          </h2>
          <p>
            Cookie <code>HttpOnly</code> aman yang digunakan untuk memverifikasi status masuk (login) akun Anda secara terenkripsi saat berkomentar, menyimpan bookmark, atau mengakses dasbor. Cookie ini mutlak diperlukan demi keamanan akun dan pencegahan serangan XSS/CSRF.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-[#09090b] dark:text-white">
            2. Penyimpanan Preferensi (<code>localStorage</code>)
          </h2>
          <p>
            Disimpan pada penyimpanan lokal peramban Anda untuk mengingat preferensi antarmuka pengguna, seperti pemilihan Mode Terang (*Light Canvas*) atau Mode Gelap (*Dark Zinc*), serta status persetujuan banner cookie.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-[#09090b] dark:text-white">
            3. Cookie Analitik &amp; Pengukuran Performa
          </h2>
          <p>
            Digunakan oleh Google Tag Manager dan analitik untuk mengumpulkan data statistik anonim mengenai bagaimana pembaca berinteraksi dengan artikel kami. Cookie ini hanya diaktifkan setelah Anda menyetujui izin analitik pada banner privasi.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-[#09090b] dark:text-white">
            4. Cookie Periklanan Pihak Ketiga (Google AdSense)
          </h2>
          <p>
            Situs kami menggunakan Google AdSense untuk menayangkan iklan. Google dan jaringan mitra iklannya menggunakan cookie periklanan (*advertising cookies*) guna:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs text-[#52525b] dark:text-[#a1a1aa]">
            <li>Menayangkan iklan yang relevan berdasarkan kunjungan Anda ke SlashJournal maupun situs web lain di internet.</li>
            <li>Membatasi frekuensi penayangan agar Anda tidak melihat iklan yang sama secara berulang.</li>
            <li>Mengukur efektivitas kampanye pengiklan.</li>
          </ul>
          <p className="mt-2 text-xs">
            Pengaturan periklanan diproses melalui mekanisme Google Consent Mode v2. Anda dapat mengatur atau menonaktifkan personalisasi iklan Google kapan saja melalui <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-[var(--accent)] underline underline-offset-4">Setelan Iklan Google</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
