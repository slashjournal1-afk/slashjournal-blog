import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { absoluteUrl, siteConfig } from '@/lib/site';

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
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#71717a] dark:text-[#a1a1aa]">
          Berlaku sejak: {siteConfig.lastLegalUpdate}
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

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-[#09090b] dark:text-white">
            5. Masa Berlaku &amp; Cara Mengubah Persetujuan
          </h2>
          <div className="overflow-x-auto rounded-[20px] border border-[#ececee] dark:border-[#27272a]">
            <table className="w-full min-w-[520px] text-left text-xs">
              <thead>
                <tr className="bg-[#f4f4f5] dark:bg-[#27272a] text-[#09090b] dark:text-white">
                  <th className="px-4 py-3 font-bold">Penyimpanan</th>
                  <th className="px-4 py-3 font-bold">Tujuan</th>
                  <th className="px-4 py-3 font-bold">Masa berlaku</th>
                </tr>
              </thead>
              <tbody className="text-[#52525b] dark:text-[#a1a1aa]">
                <tr className="border-t border-[#ececee] dark:border-[#27272a]">
                  <td className="px-4 py-3 font-mono">slash_kb_token</td>
                  <td className="px-4 py-3">Sesi masuk (HttpOnly, esensial)</td>
                  <td className="px-4 py-3">Sesi + maks. 30 hari (ingat saya)</td>
                </tr>
                <tr className="border-t border-[#ececee] dark:border-[#27272a]">
                  <td className="px-4 py-3 font-mono">slash_theme</td>
                  <td className="px-4 py-3">Preferensi tema terang/gelap</td>
                  <td className="px-4 py-3">Persisten hingga dihapus pengguna</td>
                </tr>
                <tr className="border-t border-[#ececee] dark:border-[#27272a]">
                  <td className="px-4 py-3 font-mono">slashjournal-consent-v2</td>
                  <td className="px-4 py-3">Status persetujuan cookie</td>
                  <td className="px-4 py-3">6 bulan, lalu diminta ulang</td>
                </tr>
                <tr className="border-t border-[#ececee] dark:border-[#27272a]">
                  <td className="px-4 py-3 font-mono">_ga, _ga_*</td>
                  <td className="px-4 py-3">Analitik (hanya setelah persetujuan)</td>
                  <td className="px-4 py-3">Maks. 13 bulan (Google Analytics)</td>
                </tr>
                <tr className="border-t border-[#ececee] dark:border-[#27272a]">
                  <td className="px-4 py-3 font-mono">Cookie AdSense</td>
                  <td className="px-4 py-3">Penayangan &amp; pengukuran iklan</td>
                  <td className="px-4 py-3">Mengikuti kebijakan Google (lihat <Link href="/privacy-policy" className="font-semibold text-[var(--accent)] underline underline-offset-4">Kebijakan Privasi</Link>)</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-[#52525b] dark:text-[#a1a1aa]">
            Anda dapat menarik atau mengubah persetujuan kapan saja melalui tombol{' '}
            <strong>pengaturan cookie</strong> di bagian bawah setiap halaman (footer), melalui
            pengaturan peramban Anda (blokir/hapus cookie), atau dengan menghubungi{' '}
            <a href={`mailto:${siteConfig.privacyEmail}`} className="font-semibold text-[var(--accent)] underline underline-offset-4">{siteConfig.privacyEmail}</a>.
            Menonaktifkan cookie esensial dapat membuat fungsi masuk, komentar, dan bookmark tidak bekerja.
          </p>
        </section>
      </div>
    </div>
  );
}
