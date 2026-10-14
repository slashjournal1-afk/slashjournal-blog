import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { absoluteUrl, siteConfig } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Ketentuan Layanan & Pedoman Platform',
  description: 'Aturan etika berkomentar, tanggung jawab pengguna, konten bersponsor, hak cipta, dan pedoman publikasi SlashJournal.',
  alternates: { canonical: absoluteUrl('/terms') },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen max-w-[1200px] mx-auto px-4 sm:px-6 py-12">
      <div className="rounded-[36px] bg-white dark:bg-[#18181b] border border-[#ececee] dark:border-[#27272a] p-8 sm:p-14 mb-12 space-y-4">
        <span className="px-3 py-1 rounded-[12px] bg-[var(--accent)] text-[var(--accent-foreground)] text-xs font-semibold tracking-wider uppercase">
          Aturan Platform
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#09090b] dark:text-white leading-[1.15]">
          Ketentuan Layanan &amp; Pedoman Platform
        </h1>
        <p className="text-sm sm:text-base text-[#52525b] dark:text-[#a1a1aa] max-w-2xl leading-relaxed">
          Dengan mengakses SlashJournal dan berpartisipasi dalam interaksi publikasi, Anda menyetujui ketentuan berikut demi menjaga kualitas dan keterbukaan informasi platform.
        </p>
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#71717a] dark:text-[#a1a1aa]">
          Berlaku sejak: {siteConfig.lastLegalUpdate}
        </p>
      </div>

      <div className="rounded-[36px] bg-white dark:bg-[#18181b] border border-[#ececee] dark:border-[#27272a] p-8 sm:p-12 space-y-8 text-sm text-[#18181b] dark:text-[#d4d4d8] leading-relaxed max-w-4xl">
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-[#09090b] dark:text-white">
            0. Penyelenggara Layanan
          </h2>
          <p>
            SlashJournal ({absoluteUrl()}) dikelola oleh <strong>{siteConfig.operatorName}</strong> ({siteConfig.operatorType.toLowerCase()},
            {siteConfig.operatorLocation}). Kontak redaksi:{' '}
            <a href={`mailto:${siteConfig.contactEmail}`} className="font-semibold text-[var(--accent)] underline underline-offset-4">{siteConfig.contactEmail}</a>
            {' '}atau <Link href="/contact" className="font-semibold text-[var(--accent)] underline underline-offset-4">/contact</Link>.
            Ketentuan ini diatur oleh dan ditafsirkan menurut hukum Republik Indonesia.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-[#09090b] dark:text-white">
            1. Etika Komentar &amp; Diskusi Teknis
          </h2>
          <p>
            Komentar terbuka untuk semua pembaca terautentikasi. Dilarang keras memposting ujaran kebencian, spam tautan komersial yang tidak relevan, pelecehan personal, atau muatan yang melanggar hukum Republik Indonesia.
          </p>
          <p className="text-xs text-[#52525b] dark:text-[#a1a1aa]">
            Pelanggaran berulang berakibat moderasi: komentar dihapus, akun dibatasi, dan pada kasus
            berat akun dihapus permanen. Keputusan moderasi dapat diajukan keberatan via{' '}
            <Link href="/contact?subject=general" className="font-semibold text-[var(--accent)] underline underline-offset-4">formulir kontak</Link>.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-[#09090b] dark:text-white">
            2. Tanggung Jawab Konten &amp; Hak Cipta
          </h2>
          <p>
            Seluruh artikel, diagram arsitektur Mermaid, dan materi editorial adalah karya asli berhak cipta. Pengutipan diperbolehkan dengan mencantumkan tautan aktif ke halaman asli (prinsip atribusi).
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-[#09090b] dark:text-white">
            2a. Konten Bersponsor &amp; Afiliasi
          </h2>
          <p>
            Sebagian naskah atau slot tampilan dapat merupakan kemitraan berbayar. Setiap konten
            bersponsor selalu diberi penanda transparan <code>POS BERSPONSOR</code> beserta nama
            sponsornya, dan tidak memengaruhi independensi penilaian teknis redaksi. Kami tidak
            menayangkan konten yang menyesatkan atau menyamar sebagai ulasan independen.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-[#09090b] dark:text-white">
            2b. Pelaporan Pelanggaran Hak Cipta (Takedown)
          </h2>
          <p className="text-xs text-[#52525b] dark:text-[#a1a1aa]">
            Pemegang hak yang meyakini karyanya digunakan tanpa izin dapat melapor ke{' '}
            <a href={`mailto:${siteConfig.contactEmail}?subject=Laporan%20Pelanggaran%20Hak%20Cipta`} className="font-semibold text-[var(--accent)] underline underline-offset-4">{siteConfig.contactEmail}</a>{' '}
            dengan subjek &ldquo;Laporan Pelanggaran Hak Cipta&rdquo;, menyertakan: identitas pelapor,
            URL materi yang dilaporkan, bukti kepemilikan hak, dan pernyataan itikad baik. Laporan
            valid kami tindaklanjuti dalam maks. 3×24 jam hari kerja (penghapusan atau pembatasan akses).
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

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-[#09090b] dark:text-white">
            3a. Batas Tanggung Jawab
          </h2>
          <p className="text-xs text-[#52525b] dark:text-[#a1a1aa]">
            Sejauh diizinkan hukum yang berlaku, penyelenggara tidak bertanggung jawab atas kerugian
            tidak langsung yang timbul dari penggunaan atau ketidakmampuan menggunakan layanan,
            termasuk namun tidak terbatas pada kehilangan keuntungan atau data. Tanggung jawab
            agregat maksimal terbatas pada nilai yang Anda bayarkan untuk layanan ini — layanan
            membaca bersifat gratis, sehingga batas tersebut adalah nihil. Ketentuan ini tidak
            membatasi hak konsumen yang tidak dapat dikesampingkan menurut hukum Indonesia.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-[#09090b] dark:text-white">
            4. Akun &amp; Keamanan
          </h2>
          <p className="text-xs text-[#52525b] dark:text-[#a1a1aa]">
            Anda bertanggung jawab menjaga kerahasiaan kredensial akun. Beri tahu kami segera via{' '}
            <a href={`mailto:${siteConfig.contactEmail}`} className="font-semibold text-[var(--accent)] underline underline-offset-4">{siteConfig.contactEmail}</a>{' '}
            bila mencurigai akses tanpa izin. Lihat <Link href="/privacy-policy" className="font-semibold text-[var(--accent)] underline underline-offset-4">Kebijakan Privasi</Link> untuk
            hak akses, perbaikan, dan penghapusan data Anda (UU PDP).
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-[#09090b] dark:text-white">
            5. Perubahan Ketentuan
          </h2>
          <p className="text-xs text-[#52525b] dark:text-[#a1a1aa]">
            Ketentuan ini dapat diperbarui mengikuti perkembangan layanan atau regulasi, dengan
            tanggal berlaku yang selalu tercantum di bagian atas halaman ini. Penggunaan layanan
            secara berkelanjutan setelah perubahan berarti Anda menyetujui ketentuan yang diperbarui.
          </p>
        </section>
      </div>
    </div>
  );
}
