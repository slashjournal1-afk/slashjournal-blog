'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Send, CheckCircle2, MessageSquare, Sparkles, Shield, PenLine } from 'lucide-react';
import { PageIntro } from '@/components/layout/PageIntro';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [subject, setSubject] = useState('correction');
  const subjectOptions = ['correction', 'sponsor', 'author', 'privacy', 'general'];

  React.useEffect(() => {
    const requestedSubject = new URLSearchParams(window.location.search).get('subject');
    if (requestedSubject && subjectOptions.includes(requestedSubject)) setSubject(requestedSubject);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen max-w-[1200px] mx-auto px-4 sm:px-6 py-12">
      <div className="mb-12"><PageIntro eyebrow="Kontak dan hak jawab" title="Koreksi teknis, kemitraan, atau permintaan data" description="Kirim koreksi fakta atau kode, proposal sponsor yang relevan, atau permintaan hak akses data sesuai UU PDP." /></div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Contact Form */}
        <div className="lg:col-span-7">
          <div className="rounded-[36px] bg-white dark:bg-[#18181b] border border-[#ececee] dark:border-[#27272a] p-8 sm:p-10">
            {submitted ? (
              <div className="p-8 rounded-[24px] bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h3 className="text-lg font-bold text-emerald-900 dark:text-emerald-300">
                  Pesan Anda Telah Diterima
                </h3>
                <p className="text-xs text-emerald-700 dark:text-emerald-400 max-w-md mx-auto leading-relaxed">
                  Terima kasih atas kontribusi Anda. Penulis utama akan meninjau catatan Anda dalam 1-2 hari kerja.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                   <label htmlFor="contact-subject" className="text-xs font-bold text-[#09090b] dark:text-white uppercase tracking-wider">
                    Keperluan Pesan
                  </label>
                  <select
                    id="contact-subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-4 py-3 rounded-[14px] bg-[#f4f4f5] dark:bg-[#27272a] border border-[#ececee] dark:border-[#3f3f46] text-xs font-semibold text-[#09090b] dark:text-white focus:outline-none"
                  >
                    <option value="correction">Koreksi Kesalahan Teknis / Fakta (C10)</option>
                    <option value="sponsor">Kerjasama Sponsor & Advertorial (M1-M5)</option>
                    <option value="author">Daftar menjadi penulis kontributor</option>
                    <option value="privacy">Permintaan Data Pribadi / Hapus Akun (UU PDP)</option>
                    <option value="general">Pertanyaan Umum Arsitektur</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                     <label htmlFor="contact-name" className="text-xs font-bold text-[#09090b] dark:text-white uppercase tracking-wider">
                      Nama Lengkap
                    </label>
                    <input
                       id="contact-name"
                       type="text"
                      required
                      placeholder="Nama Anda"
                      className="w-full px-4 py-3 rounded-[14px] bg-[#f4f4f5] dark:bg-[#27272a] border border-[#ececee] dark:border-[#3f3f46] text-xs text-[#09090b] dark:text-white focus:outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                     <label htmlFor="contact-email" className="text-xs font-bold text-[#09090b] dark:text-white uppercase tracking-wider">
                      Alamat Email
                    </label>
                    <input
                       id="contact-email"
                       type="email"
                      required
                      placeholder="email@domain.com"
                      className="w-full px-4 py-3 rounded-[14px] bg-[#f4f4f5] dark:bg-[#27272a] border border-[#ececee] dark:border-[#3f3f46] text-xs text-[#09090b] dark:text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                   <label htmlFor="contact-message" className="text-xs font-bold text-[#09090b] dark:text-white uppercase tracking-wider">
                    Isi Pesan / Tautan Artikel Terkait
                  </label>
                  <textarea
                     id="contact-message"
                     rows={5}
                    required
                    placeholder="Tuliskan catatan koreksi, tautan artikel, atau detail kolaborasi..."
                    className="w-full px-4 py-3 rounded-[14px] bg-[#f4f4f5] dark:bg-[#27272a] border border-[#ececee] dark:border-[#3f3f46] text-xs text-[#09090b] dark:text-white focus:outline-none resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-[14px] bg-[#09090b] text-white hover:bg-[#18181b] text-xs font-bold shadow-awesomic-dark-btn transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Kirim Pesan Sekarang
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Info Col */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-[36px] bg-white dark:bg-[#18181b] border border-[#ececee] dark:border-[#27272a] p-8 space-y-4">
            <div className="w-10 h-10 rounded-[14px] bg-[#f4f4f5] dark:bg-[#27272a] flex items-center justify-center text-[var(--accent)]">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#09090b] dark:text-white">
              Slot Iklan & Advertorial (M1-M5)
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
