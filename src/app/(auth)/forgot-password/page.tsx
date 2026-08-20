'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, Loader2, AlertCircle, CheckCircle2, KeyRound, ExternalLink, Sparkles } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetUrl, setResetUrl] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal memproses permintaan');

      setSubmitted(true);
      if (data.resetUrl) {
        setResetUrl(data.resetUrl);
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan sistem');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-[32px] border border-[#ececee] dark:border-[#27272a] bg-white dark:bg-[#18181b] p-6 sm:p-8 shadow-xl space-y-6">
      {/* Back to Login link */}
      <Link
        href="/login"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#71717a] dark:text-[#a1a1aa] hover:text-[#09090b] dark:hover:text-white transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Kembali ke Halaman Masuk</span>
      </Link>

      {/* Header */}
      <div className="space-y-1.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[10px] bg-orange-50 dark:bg-orange-950/30 border border-[var(--accent)]/20 text-[var(--accent)] text-[11px] font-bold uppercase tracking-wider mb-1">
          <KeyRound className="w-3.5 h-3.5" />
          <span>Pemulihan Akun</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#09090b] dark:text-white tracking-tight">
          Lupa Kata Sandi?
        </h1>
        <p className="text-xs text-[#71717a] dark:text-[#a1a1aa] leading-relaxed">
          Masukkan alamat email akun Anda. Kami akan menerbitkan token pemulihan aman yang berlaku selama 1 jam.
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-3.5 rounded-[16px] bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {!submitted ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#09090b] dark:text-white flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[var(--accent)]" />
              Alamat Email Terdaftar
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@domain.com"
              required
              autoFocus
              className="w-full px-4 py-3 rounded-[16px] bg-[#f4f4f5] dark:bg-[#27272a] border border-[#ececee] dark:border-[#3f3f46] text-xs text-[#09090b] dark:text-white focus:outline-none focus:border-[var(--accent)] transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-[16px] bg-[#09090b] dark:bg-white text-white dark:text-[#09090b] hover:bg-[#18181b] dark:hover:bg-zinc-200 text-xs font-bold transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-2 pt-3"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            <span>{loading ? 'Memproses...' : 'Kirim Tautan Pemulihan'}</span>
          </button>
        </form>
      ) : (
        <div className="space-y-5 animate-in fade-in duration-200">
          <div className="p-4 rounded-[20px] bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Instruksi Pemulihan Diterbitkan</span>
            </div>
            <p className="leading-relaxed">
              Tautan pemulihan telah disiapkan untuk <span className="font-bold underline">{email}</span>.
            </p>
          </div>

          {/* Instant Reset link button for easy testing */}
          {resetUrl && (
            <div className="p-4 rounded-[20px] bg-orange-50 dark:bg-orange-950/20 border border-[var(--accent)]/30 space-y-3">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-[var(--accent)] uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Akses Cepat Pengujian Token:</span>
              </div>
              <p className="text-xs text-[#52525b] dark:text-[#a1a1aa] leading-relaxed">
                Token HMAC telah dibuat secara otomatis. Klik tombol di bawah untuk langsung menuju formulir pembuatan kata sandi baru:
              </p>
              <Link
                href={resetUrl}
                className="w-full py-3 px-4 rounded-[14px] bg-[var(--accent)] hover:bg-[#e04f00] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs"
              >
                <span>Buka Formulir Reset Sandi</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}

          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={() => {
                setSubmitted(false);
                setResetUrl(null);
              }}
              className="text-xs font-semibold text-[#71717a] hover:text-[#09090b] dark:hover:text-white underline"
            >
              Kirim ulang dengan email lain
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
