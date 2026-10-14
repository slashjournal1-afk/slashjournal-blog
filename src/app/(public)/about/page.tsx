import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Shield, Terminal, Award, ArrowRight, Mail, MapPin } from 'lucide-react';
import { PageIntro } from '@/components/layout/PageIntro';
import type { Metadata } from 'next';
import { absoluteUrl, siteConfig } from '@/lib/site';
import { JsonLd } from '@/components/seo/JsonLd';
import { authorId, authorSameAs, organizationId } from '@/lib/structured-data';

export const metadata: Metadata = {
  title: 'Tentang Penulis & Standar Rekayasa',
  description: 'Profil Choirul Humam, alumni Universitas Amikom Yogyakarta asal Pati, beserta standar rekayasa dan komitmen kualitas konten SlashJournal.',
  alternates: { canonical: absoluteUrl('/about') },
  authors: [{ name: siteConfig.authorName, url: absoluteUrl('/about#author') }],
};

export default function AboutPage() {
  const personSchema = {
    '@context': 'https://schema.org', '@type': 'Person', '@id': authorId,
    name: siteConfig.authorName, url: absoluteUrl('/about#author'), jobTitle: siteConfig.authorJobTitle,
    image: absoluteUrl('/choirul-humam.webp'),
    description:
      'Choirul Humam adalah penulis dan Software Engineer di balik SlashJournal — publikasi independen tentang arsitektur sistem dan rekayasa perangkat lunak.',
    worksFor: { '@id': organizationId },
    alumniOf: { '@type': 'CollegeOrUniversity', name: 'Universitas Amikom Yogyakarta' },
    homeLocation: { '@type': 'Place', name: 'Pati, Jawa Tengah, Indonesia' },
    sameAs: authorSameAs,
    knowsAbout: ['Software Architecture', 'Distributed Systems', 'PostgreSQL', 'Next.js', 'Microservices'],
  };
  return (
    <div className="min-h-screen max-w-[1200px] mx-auto px-4 sm:px-6 py-12">
      <JsonLd data={personSchema} />
      <p className="mb-8 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">
        Terakhir diperbarui: {siteConfig.lastLegalUpdate}
      </p>
      <div className="mb-12">
        <div id="author" className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center scroll-mt-24">
          <div className="lg:col-span-8 space-y-6">
            <PageIntro
              eyebrow="Tentang penulis"
              title="Choirul Humam, penulis di balik SlashJournal"
              description="SlashJournal adalah ruang publikasi independen tentang rekayasa sistem terdistribusi, integritas database transaksional, dan keputusan desain yang dapat dipertanggungjawabkan."
            />
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-[20px] bg-white dark:bg-[#18181b] border border-[#ececee] dark:border-[#27272a] p-4">
                <dt className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--text-muted)]">Nama Lengkap</dt>
                <dd className="mt-1 text-sm font-bold text-[#09090b] dark:text-white">Choirul Humam</dd>
              </div>
              <div className="rounded-[20px] bg-white dark:bg-[#18181b] border border-[#ececee] dark:border-[#27272a] p-4">
                <dt className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--text-muted)]">Institusi Pendidikan</dt>
                <dd className="mt-1 text-sm font-bold text-[#09090b] dark:text-white">Alumni Universitas Amikom Yogyakarta</dd>
              </div>
              <div className="rounded-[20px] bg-white dark:bg-[#18181b] border border-[#ececee] dark:border-[#27272a] p-4">
                <dt className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--text-muted)]">Asal</dt>
                <dd className="mt-1 text-sm font-bold text-[#09090b] dark:text-white">Pati, Jawa Tengah</dd>
              </div>
              <div className="rounded-[20px] bg-white dark:bg-[#18181b] border border-[#ececee] dark:border-[#27272a] p-4">
                <dt className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--text-muted)]">Bidang Fokus</dt>
                <dd className="mt-1 text-sm font-bold text-[#09090b] dark:text-white">Rekayasa Sistem Terdistribusi &amp; Pengembangan Web</dd>
              </div>
            </dl>
          </div>

          <div className="lg:col-span-4 flex justify-center">
            <div className="relative w-full max-w-[280px] aspect-[3/4] rounded-[36px] overflow-hidden border-2 border-[#ececee] dark:border-[#27272a] shadow-md">
              <Image
                src="/choirul-humam.webp"
                alt="Foto Choirul Humam, penulis SlashJournal"
                fill
                priority
                sizes="(min-width: 1024px) 280px, 70vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Profil sosial & verifikasi identitas — tautan eksplisit rel="me" agar
          Google Knowledge Graph mengaitkan "Choirul Humam" ↔ slashjournal.my.id */}
      <div className="rounded-[36px] bg-white dark:bg-[#18181b] border border-[#ececee] dark:border-[#27272a] p-8 sm:p-10 space-y-5 mb-16 max-w-4xl">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--accent)]">Verifikasi identitas penulis</p>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#09090b] dark:text-white">
          Choirul Humam di tempat lain
        </h2>
        <p className="text-sm leading-relaxed text-[#3f3f46] dark:text-[#d4d4d8]">
          Akun-akun di bawah ini adalah profil resmi <strong>Choirul Humam</strong>, penulis{' '}
          <Link href="/" className="font-semibold text-[var(--accent)] underline underline-offset-2">SlashJournal</Link>.
          Tautan memakai atribut <code className="font-mono text-xs bg-[#f4f4f5] dark:bg-[#27272a] px-1.5 py-0.5 rounded">rel=&quot;me&quot;</code> sebagai
          sinyal verifikasi dua arah antara situs ini dan profil sosial tersebut.
        </p>
        <nav aria-label="Profil sosial Choirul Humam" className="flex flex-wrap gap-3">
          {siteConfig.authorSocials.map((social) => (
            <a
              key={social.href}
              href={social.href}
              rel="me noopener"
              target="_blank"
              className="inline-flex items-center gap-2 rounded-[14px] border border-[#ececee] dark:border-[#27272a] bg-[#f4f4f5] dark:bg-[#27272a] px-4 py-2.5 text-sm font-semibold text-[#09090b] dark:text-white transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              <span>{social.label}</span>
              <span className="font-normal text-[#52525b] dark:text-[#a1a1aa]">{social.handle}</span>
            </a>
          ))}
        </nav>
        <p className="text-xs leading-relaxed text-[#71717a] dark:text-[#a1a1aa]">
          Mencari dengan kata kunci &ldquo;Choirul Humam SlashJournal&rdquo; akan mengarah ke halaman ini sebagai
          profil penulis kanonis di <span className="font-semibold">slashjournal.my.id</span>.
        </p>
      </div>

      {/* Core Principles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div className="rounded-[36px] bg-white dark:bg-[#18181b] border border-[#ececee] dark:border-[#27272a] p-8 space-y-3">
          <div className="w-10 h-10 rounded-[14px] bg-[#f4f4f5] dark:bg-[#27272a] flex items-center justify-center text-[var(--accent)]">
            <Terminal className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-[#09090b] dark:text-white">Rekayasa Terverifikasi</h3>
          <p className="text-xs text-[#52525b] dark:text-[#a1a1aa] leading-relaxed">
            Setiap arsitektur dan potongan kode diuji pada beban produksi nyata sebelum dipublikasikan sebagai panduan.
          </p>
        </div>

        <div className="rounded-[36px] bg-white dark:bg-[#18181b] border border-[#ececee] dark:border-[#27272a] p-8 space-y-3">
          <div className="w-10 h-10 rounded-[14px] bg-[#f4f4f5] dark:bg-[#27272a] flex items-center justify-center text-[var(--accent)]">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-[#09090b] dark:text-white">Material Design Restrained</h3>
          <p className="text-xs text-[#52525b] dark:text-[#a1a1aa] leading-relaxed">
            Menolak template generik; mengadopsi standar elevasi hairline 1px Awesomic dengan palet zinc netral dan aksen Ember.
          </p>
        </div>

        <div className="rounded-[36px] bg-white dark:bg-[#18181b] border border-[#ececee] dark:border-[#27272a] p-8 space-y-3">
          <div className="w-10 h-10 rounded-[14px] bg-[#f4f4f5] dark:bg-[#27272a] flex items-center justify-center text-[var(--accent)]">
            <Shield className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-[#09090b] dark:text-white">Kepatuhan & Transparansi</h3>
          <p className="text-xs text-[#52525b] dark:text-[#a1a1aa] leading-relaxed">
            Kepatuhan penuh pada UU Perlindungan Data Pribadi (UU PDP) dan keterbukaan label pos bersponsor.
          </p>
        </div>
      </div>

      {/* Editorial Policy & Correction Statement */}
      <div className="rounded-[36px] bg-[#27272a] text-white p-8 sm:p-12 space-y-6 mb-16">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Kebijakan Koreksi &amp; Integritas Publikasi
        </h2>
        <p className="text-sm text-zinc-300 leading-relaxed max-w-3xl">
          Sebagai entitas perorangan dengan tanggung jawab hukum melekat, kami menerapkan transparansi penuh pada setiap koreksi. Kesalahan ketik diperbaiki secara langsung, sementara koreksi fakta atau arsitektur dicatat secara transparan dengan riwayat versi permanen pada basis data.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-[14px] bg-white text-[#09090b] hover:bg-zinc-100 text-xs font-bold transition-all"
        >
          <span>Kirim Catatan Koreksi atau Pertanyaan</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Cara setiap naskah dibuat */}
      <div className="rounded-[36px] bg-white dark:bg-[#18181b] border border-[#ececee] dark:border-[#27272a] p-8 sm:p-12 space-y-5 mb-16 max-w-4xl">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--accent)]">Metodologi editorial</p>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#09090b] dark:text-white">
          Cara setiap naskah dibuat
        </h2>
        <div className="space-y-4 text-sm leading-relaxed text-[#3f3f46] dark:text-[#d4d4d8]">
          <p>
            Setiap artikel SlashJournal berangkat dari masalah produksi yang nyata: bottleneck database,
            kegagalan idempotensi pembayaran, atau keputusan arsitektur yang biayanya baru terasa berbulan-bulan
            kemudian. Kami mereproduksi masalahnya terlebih dahulu — menulis skema, menjalankan beban uji,
            dan mencatat angka yang keluar — sebelum satu paragraf pun dipublikasikan.
          </p>
          <p>
            Potongan kode di artikel bukan ilustrasi; ia dijalankan dan diuji pada dependensi yang
            disebutkan di badan naskah. Diagram arsitektur digambar dari topologi yang benar-benar diuji,
            bukan dari dokumentasi vendor. Ketika sebuah pendekatan memiliki trade-off — misalnya konsistensi
            versus latensi, atau normalisasi versus kecepatan baca — trade-off itu ditulis eksplisit beserta
            kondisi kapan pendekatan tersebut <em>tidak</em> boleh dipakai.
          </p>
          <p>
            Klaim yang merujuk pada pihak ketiga dicantumkan di blok sumber di bawah setiap artikel dengan
            tautan ke dokumentasi resmi atau publikasi primer. Artikel yang sudah tidak akurat diperbarui
            dengan tanggal revisi yang terlihat, bukan ditulis ulang diam-diam. Pembaca yang menemukan
            kekeliruan dapat melaporkannya melalui <Link href="/contact?subject=correction" className="font-semibold text-[var(--accent)] underline underline-offset-2">formulir koreksi</Link>;
            setiap koreksi fakta yang diterima dicatat dalam riwayat revisi permanen.
          </p>
        </div>
      </div>

      {/* Pengelola & kontak */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl">
        <a
          href={`mailto:${siteConfig.contactEmail}`}
          className="rounded-[24px] bg-white dark:bg-[#18181b] border border-[#ececee] dark:border-[#27272a] p-6 flex items-center gap-4 hover:border-[var(--accent)] transition-colors"
        >
          <span className="w-10 h-10 rounded-[14px] bg-[#f4f4f5] dark:bg-[#27272a] flex items-center justify-center text-[var(--accent)] shrink-0">
            <Mail className="w-5 h-5" />
          </span>
          <span>
            <span className="block text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--text-muted)]">Email redaksi</span>
            <span className="block text-sm font-bold text-[#09090b] dark:text-white">{siteConfig.contactEmail}</span>
          </span>
        </a>
        <div className="rounded-[24px] bg-white dark:bg-[#18181b] border border-[#ececee] dark:border-[#27272a] p-6 flex items-center gap-4">
          <span className="w-10 h-10 rounded-[14px] bg-[#f4f4f5] dark:bg-[#27272a] flex items-center justify-center text-[var(--accent)] shrink-0">
            <MapPin className="w-5 h-5" />
          </span>
          <span>
            <span className="block text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--text-muted)]">Pengelola</span>
            <span className="block text-sm font-bold text-[#09090b] dark:text-white">{siteConfig.operatorType} · {siteConfig.operatorLocation}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
