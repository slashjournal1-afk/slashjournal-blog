'use client';

import React, { useState } from 'react';
import { Send, CheckCircle2, AlertTriangle } from 'lucide-react';

const subjectOptions = ['correction', 'sponsor', 'author', 'privacy', 'general'] as const;

const subjectLabels: Record<string, string> = {
  correction: 'Koreksi Kesalahan Teknis / Fakta',
  sponsor: 'Kerjasama Sponsor & Kemitraan',
  author: 'Daftar Menjadi Penulis Kontributor',
  privacy: 'Permintaan Data Pribadi / Hapus Akun (UU PDP)',
  general: 'Pertanyaan Umum Platform',
};

export function ContactForm({ initialSubject }: { initialSubject: string }) {
  const [subject, setSubject] = useState(
    (subjectOptions as readonly string[]).includes(initialSubject) ? initialSubject : 'general',
  );
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('sending');
    setError('');
    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: String(form.get('name') || ''),
          email: String(form.get('email') || ''),
          subject,
          message: String(form.get('message') || ''),
        }),
      });
      const data = (await res.json()) as { success?: boolean; error?: string };
      if (!res.ok || !data.success) {
        setError(data.error || 'Gagal mengirim pesan. Coba lagi nanti.');
        setStatus('error');
        return;
      }
      setStatus('sent');
    } catch {
      setError('Jaringan bermasalah. Coba lagi atau hubungi halo@slashjournal.my.id.');
      setStatus('error');
    }
  };

  if (status === 'sent') {
    return (
      <div className="p-8 rounded-[24px] bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-center space-y-3">
        <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
        <h3 className="text-lg font-bold text-emerald-900 dark:text-emerald-300">
          Pesan Anda Telah Diterima &amp; Tercatat
        </h3>
        <p className="text-xs text-emerald-700 dark:text-emerald-400 max-w-md mx-auto leading-relaxed">
          Terima kasih. Setiap pesan dibaca dan ditinjau pada hari kerja. Untuk keperluan
          mendesak, hubungi langsung{' '}
          <a href="mailto:halo@slashjournal.my.id" className="font-bold underline underline-offset-2">
            halo@slashjournal.my.id
          </a>
          .
        </p>
      </div>
    );
  }

  return (
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
          {subjectOptions.map((value) => (
            <option key={value} value={value}>{subjectLabels[value]}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="contact-name" className="text-xs font-bold text-[#09090b] dark:text-white uppercase tracking-wider">
            Nama Lengkap
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            required
            minLength={2}
            maxLength={120}
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
            name="email"
            type="email"
            required
            maxLength={320}
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
          name="message"
          rows={5}
          required
          minLength={20}
          maxLength={5000}
          placeholder="Tuliskan catatan koreksi, tautan artikel, atau detail kolaborasi (min. 20 karakter)..."
          className="w-full px-4 py-3 rounded-[14px] bg-[#f4f4f5] dark:bg-[#27272a] border border-[#ececee] dark:border-[#3f3f46] text-xs text-[#09090b] dark:text-white focus:outline-none resize-none"
        ></textarea>
      </div>

      {status === 'error' && (
        <p role="alert" className="flex items-start gap-2 text-xs font-semibold text-red-600 dark:text-red-400">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="w-full py-3.5 rounded-[14px] bg-[#09090b] text-white hover:bg-[#18181b] text-xs font-bold shadow-awesomic-dark-btn transition-all flex items-center justify-center gap-2 disabled:opacity-60"
      >
        <Send className="w-4 h-4" />
        {status === 'sending' ? 'Mengirim...' : 'Kirim Pesan Sekarang'}
      </button>
    </form>
  );
}
