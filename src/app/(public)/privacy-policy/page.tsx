import React from 'react';
import type { Metadata } from 'next';
import { absoluteUrl } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Kebijakan Privasi',
  description: 'Pernyataan transparansi data pribadi, kepatuhan UU PDP, dan kebijakan periklanan pihak ketiga Google AdSense.',
  alternates: { canonical: absoluteUrl('/privacy-policy') },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen max-w-[1200px] mx-auto px-4 sm:px-6 py-12">
      <div className="rounded-[36px] bg-white dark:bg-[#18181b] border border-[#ececee] dark:border-[#27272a] p-8 sm:p-14 mb-12 space-y-4">
        <span className="px-3 py-1 rounded-[12px] bg-[var(--accent)] text-[var(--accent-foreground)] text-xs font-semibold tracking-wider uppercase">
          Kepatuhan Privasi &amp; Regulasi
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#09090b] dark:text-white leading-[1.15]">
          Kebijakan Privasi &amp; Perlindungan Data
        </h1>
        <p className="text-sm sm:text-base text-[#52525b] dark:text-[#a1a1aa] max-w-2xl leading-relaxed">
          SlashJournal menghormati hak privasi setiap pembaca dan berkomitmen untuk melindungi data pribadi sesuai dengan Undang-Undang No. 27 Tahun 2022 tentang Pelindungan Data Pribadi (UU PDP) serta standar perlindungan data dan periklanan global.
        </p>
      </div>

      <div className="rounded-[36px] bg-white dark:bg-[#18181b] border border-[#ececee] dark:border-[#27272a] p-8 sm:p-12 space-y-8 text-sm text-[#18181b] dark:text-[#d4d4d8] leading-relaxed max-w-4xl">
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-[#09090b] dark:text-white">
            1. Data yang Kami Kumpulkan
          </h2>
          <p>
            Kami menerapkan prinsip minimalitas data dan hanya mengumpulkan informasi yang diperlukan untuk mengoperasikan layanan platform, interaksi diskusi, dan preferensi baca:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs text-[#52525b] dark:text-[#a1a1aa]">
            <li><strong>Alamat Email:</strong> Digunakan untuk autentikasi sesi akun aman dan pengiriman ringkasan buletin bacaan bila Anda berlangganan secara sukarela.</li>
            <li><strong>Nama Tampilan (Display Name):</strong> Identitas publik saat Anda berkomentar atau berkontribusi pada artikel.</li>
            <li><strong>Data Log Teknis &amp; Keamanan:</strong> Alamat IP tersamar dan informasi peramban untuk pencegahan spam, penipuan lalu lintas, dan audit sistem.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-[#09090b] dark:text-white">
            2. Hak Pengguna &amp; Penghapusan Akun
          </h2>
          <p>
            Sesuai UU PDP, setiap pembaca memiliki hak penuh untuk meminta akses, perbaikan, atau penghapusan akun serta data pribadi kapan saja:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs text-[#52525b] dark:text-[#a1a1aa]">
            <li>Alamat email dan profil Anda akan dihapus secara permanen dari basis data utama kami saat permintaan diajukan.</li>
            <li>Komentar historis yang Anda tinggalkan pada artikel akan tetap ada demi integritas diskusi publik, namun identitasnya akan disamarkan menjadi <em>&quot;Pengguna Terhapus&quot;</em>.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-[#09090b] dark:text-white">
            3. Kebijakan Iklan Pihak Ketiga &amp; Google AdSense
          </h2>
          <p>
            Platform kami menayangkan iklan melalui jaringan mitra periklanan pihak ketiga, termasuk Google AdSense. Berikut adalah transparansi kebijakan privasi terkait:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-xs text-[#52525b] dark:text-[#a1a1aa]">
            <li>
              <strong>Cookie Pihak Ketiga:</strong> Vendor pihak ketiga, termasuk Google, menggunakan cookie untuk menayangkan iklan berdasarkan kunjungan pengguna sebelumnya ke situs web ini atau situs web lain di internet.
            </li>
            <li>
              <strong>Cookie Periklanan Google:</strong> Penggunaan cookie periklanan memungkinkan Google dan mitranya menayangkan iklan kepada pengguna kami berdasarkan kunjungan mereka ke SlashJournal dan/atau situs web lain di internet.
            </li>
            <li>
              <strong>Pilihan Pengaturan Personalisasi Iklan (Opt-out):</strong> Pengguna dapat memilih untuk menonaktifkan iklan yang dipersonalisasi dengan mengunjungi{' '}
              <a
                href="https://adssettings.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[var(--accent)] underline underline-offset-4 hover:opacity-80"
              >
                Setelan Iklan Google (Google Ads Settings)
              </a>
              . Selain itu, Anda juga dapat menolak penggunaan cookie periklanan dari vendor pihak ketiga dengan mengunjungi{' '}
              <a
                href="https://www.aboutads.info"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[var(--accent)] underline underline-offset-4 hover:opacity-80"
              >
                www.aboutads.info
              </a>
              .
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-[#09090b] dark:text-white">
            4. Cookie Analitik &amp; Manajemen Persetujuan
          </h2>
          <p>
            Kami menerapkan Google Consent Mode v2 untuk menghormati preferensi privasi Anda. Pengukuran performa analitik hanya aktif setelah mendapatkan persetujuan. Anda dapat memperbarui izin cookie kapan saja melalui tautan pengaturan cookie di bagian bawah halaman.
          </p>
        </section>
      </div>
    </div>
  );
}
