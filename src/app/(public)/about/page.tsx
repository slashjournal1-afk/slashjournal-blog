import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Shield, Sparkles, Terminal, Award, BookOpen, Layers, CheckCircle2, ArrowRight } from 'lucide-react';
import { PageIntro } from '@/components/layout/PageIntro';
import type { Metadata } from 'next';
import { absoluteUrl } from '@/lib/site';
import { JsonLd } from '@/components/seo/JsonLd';
import { authorId, organizationId } from '@/lib/structured-data';

export const metadata: Metadata = {
  title: 'Tentang Penulis & Standar Rekayasa',
  description: 'Profil penulis, latar belakang 15 tahun rekayasa sistem, dan komitmen kualitas konten.',
  alternates: { canonical: absoluteUrl('/about') },
};

export default function AboutPage() {
  const personSchema = {
    '@context': 'https://schema.org', '@type': 'Person', '@id': authorId,
    name: 'Choirul Arsitek', url: absoluteUrl('/about'), jobTitle: 'Software Architect',
    worksFor: { '@id': organizationId },
  };
  return (
    <div className="min-h-screen max-w-[1200px] mx-auto px-4 sm:px-6 py-12">
      <JsonLd data={personSchema} />
      <div className="mb-12">
        <div id="author" className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center scroll-mt-24">
          <div className="lg:col-span-8 space-y-5"><PageIntro eyebrow="Tentang penulis dan arsitek" title="15 tahun merancang fondasi sistem dan antarmuka digital" description="SlashJournal adalah ruang publikasi independen tentang rekayasa sistem terdistribusi, integritas database transaksional, dan keputusan desain yang dapat dipertanggungjawabkan." /></div>

          <div className="lg:col-span-4 flex justify-center">
            <div className="w-48 h-48 rounded-[36px] overflow-hidden relative border-2 border-[#ececee] dark:border-[#27272a] shadow-md">
              <Image
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80"
                alt="Choirul - Chief Architect"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
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
      <div className="rounded-[36px] bg-[#27272a] text-white p-8 sm:p-12 space-y-6">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Kebijakan Koreksi & Integritas Publikasi (C10 & E4)
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
    </div>
  );
}
