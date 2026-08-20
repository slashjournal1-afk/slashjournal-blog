import React from 'react';
import { ShieldCheck, Lock, CheckCircle2, FileText } from 'lucide-react';
import type { Metadata } from 'next';
import { absoluteUrl } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Kebijakan Privasi (UU PDP)',
  description: 'Pernyataan kepatuhan perlindungan data pribadi dan hak penghapusan akun pembaca.',
  alternates: { canonical: absoluteUrl('/privacy-policy') },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen max-w-[1200px] mx-auto px-4 sm:px-6 py-12">
      <div className="rounded-[36px] bg-white dark:bg-[#18181b] border border-[#ececee] dark:border-[#27272a] p-8 sm:p-14 mb-12 space-y-4">
        <span className="px-3 py-1 rounded-[12px] bg-[var(--accent)] text-white text-xs font-semibold tracking-wider">
          KEPATUHAN REGULASI
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#09090b] dark:text-white leading-[1.15]">
          Kebijakan Privasi & Perlindungan Data Pribadi (UU PDP).
        </h1>
        <p className="text-sm sm:text-base text-[#52525b] dark:text-[#a1a1aa] max-w-2xl leading-relaxed">
          SlashJournal menghormati hak privasi setiap pembaca dan berkomitmen penuh untuk mematuhi Undang-Undang No. 27 Tahun 2022 tentang Pelindungan Data Pribadi (UU PDP).
        </p>
      </div>

      <div className="rounded-[36px] bg-white dark:bg-[#18181b] border border-[#ececee] dark:border-[#27272a] p-8 sm:p-12 space-y-8 text-sm text-[#18181b] dark:text-[#d4d4d8] leading-relaxed max-w-4xl">
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-[#09090b] dark:text-white">
            1. Data yang Kami Kumpulkan (Prinsip Minimalitas Data)
          </h2>
          <p>
            Sesuai keputusan arsitektur (U7), kami hanya mengumpulkan data yang mutlak diperlukan untuk mengoperasikan fungsi diskusi dan personalisasi bookmark:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs text-[#52525b] dark:text-[#a1a1aa]">
            <li><strong>Alamat Email:</strong> Untuk autentikasi sesi aman dan pengiriman ringkasan bila Anda berlangganan secara sukarela.</li>
            <li><strong>Nama Tampilan (Display Name):</strong> Identitas publik saat Anda berkomentar pada artikel.</li>
            <li><strong>Data Log Keamanan:</strong> Alamat IP tersamar untuk pencegahan spam dan pencatatan audit log (S3).</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-[#09090b] dark:text-white">
            2. Hak Penghapusan Akun & Penyamaran Komentar (U5)
          </h2>
          <p>
            Pembaca memiliki hak penuh untuk meminta penghapusan akun kapan saja. Ketika akun dihapus:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs text-[#52525b] dark:text-[#a1a1aa]">
            <li>Alamat email dan profil Anda akan dihapus secara permanen dari basis data utama kami.</li>
            <li>Komentar historis yang Anda tinggalkan pada artikel akan tetap ada demi integritas diskusi publik, namun identitasnya akan disamarkan menjadi <em>&quot;Pengguna Terhapus&quot;</em>.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-[#09090b] dark:text-white">
            3. Transparansi Iklan & Penelusuran Pihak Ketiga (M1-M4)
          </h2>
          <p>
            Kami tidak menjual data pribadi Anda kepada pihak mana pun. Slot iklan yang ditayangkan menggunakan penempatan terkurasi dengan label eksplisit <code>SPONSORED</code> atau <code>IKLAN</code> tanpa skrip penelusuran invasif.
          </p>
        </section>
      </div>
    </div>
  );
}
