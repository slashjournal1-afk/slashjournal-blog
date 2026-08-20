'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { KeyRound, Eye, EyeOff, Loader2, AlertCircle, CheckCircle2, Check, ArrowRight, ShieldCheck } from 'lucide-react';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tokenFromQuery = searchParams.get('token') || '';

  const [token, setToken] = useState(tokenFromQuery);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Password requirements
  const isMinLength = password.length >= 8;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const isPasswordValid = isMinLength && hasLetter && hasNumber;
  const isMatch = password.length > 0 && password === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!token.trim()) {
      setError('Token pemulihan wajib diisi.');
      return;
    }

    if (!isMinLength) {
      setError('Kata sandi minimal harus 8 karakter.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Konfirmasi kata sandi tidak cocok.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: token.trim(),
          password,
          confirmPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal mereset kata sandi');

      setSuccessMsg('Kata sandi berhasil diperbarui! Mengalihkan ke halaman login...');
      setTimeout(() => {
        router.push('/login?reset=success');
      }, 1400);
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan sistem');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-[32px] border border-[#ececee] dark:border-[#27272a] bg-white dark:bg-[#18181b] p-6 sm:p-8 shadow-xl space-y-6">
      {/* Header */}
      <div className="space-y-1.5 text-center sm:text-left">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[10px] bg-orange-50 dark:bg-orange-950/30 border border-[var(--accent)]/20 text-[var(--accent)] text-[11px] font-bold uppercase tracking-wider mb-1">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Keamanan Kredensial</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#09090b] dark:text-white tracking-tight">
          Buat Kata Sandi Baru
        </h1>
        <p className="text-xs text-[#71717a] dark:text-[#a1a1aa] leading-relaxed">
          Tentukan kata sandi baru yang kuat untuk mengamankan akses akun Anda.
        </p>
      </div>

      {/* Feedback Alerts */}
      {error && (
        <div className="p-3.5 rounded-[16px] bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-[20px] bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold space-y-2">
          <div className="flex items-center gap-2 text-sm font-bold">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Berhasil!</span>
          </div>
          <p>{successMsg}</p>
          <Link
            href="/login?reset=success"
            className="inline-flex items-center gap-1 text-[var(--accent)] font-bold hover:underline pt-1"
          >
            <span>Masuk sekarang →</span>
          </Link>
        </div>
      )}

      {!successMsg && (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Token Field */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#09090b] dark:text-white flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-[var(--accent)]" />
              Token Pemulihan
            </label>
            <input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Tempel token pemulihan di sini..."
              required
              className="w-full font-mono px-4 py-3 rounded-[16px] bg-[#f4f4f5] dark:bg-[#27272a] border border-[#ececee] dark:border-[#3f3f46] text-xs text-[#09090b] dark:text-white focus:outline-none focus:border-[var(--accent)] transition-colors"
            />
          </div>

          {/* New Password Field */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#09090b] dark:text-white flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-[var(--accent)]" />
              Kata Sandi Baru
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 8 karakter..."
                required
                autoComplete="new-password"
                className="w-full px-4 py-3 pr-10 rounded-[16px] bg-[#f4f4f5] dark:bg-[#27272a] border border-[#ececee] dark:border-[#3f3f46] text-xs text-[#09090b] dark:text-white focus:outline-none focus:border-[var(--accent)] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#71717a] hover:text-[#09090b] dark:hover:text-white p-1"
                aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#09090b] dark:text-white flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-[var(--accent)]" />
              Konfirmasi Kata Sandi Baru
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Ulangi kata sandi baru..."
              required
              autoComplete="new-password"
              className="w-full px-4 py-3 rounded-[16px] bg-[#f4f4f5] dark:bg-[#27272a] border border-[#ececee] dark:border-[#3f3f46] text-xs text-[#09090b] dark:text-white focus:outline-none focus:border-[var(--accent)] transition-colors"
            />
          </div>

          {/* Real-time Validation Checklist */}
          {password.length > 0 && (
            <div className="p-3 rounded-[14px] bg-[#f4f4f5] dark:bg-[#27272a]/60 border border-[#ececee] dark:border-[#27272a] space-y-1 text-[11px]">
              <div className={`flex items-center gap-1.5 ${isMinLength ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-[#71717a]'}`}>
                <Check className={`w-3.5 h-3.5 ${isMinLength ? 'opacity-100' : 'opacity-30'}`} />
                <span>Minimal 8 karakter</span>
              </div>
              <div className={`flex items-center gap-1.5 ${hasLetter && hasNumber ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-[#71717a]'}`}>
                <Check className={`w-3.5 h-3.5 ${hasLetter && hasNumber ? 'opacity-100' : 'opacity-30'}`} />
                <span>Kombinasi huruf dan angka</span>
              </div>
              {confirmPassword.length > 0 && (
                <div className={`flex items-center gap-1.5 ${isMatch ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-rose-500 font-semibold'}`}>
                  <Check className={`w-3.5 h-3.5 ${isMatch ? 'opacity-100' : 'opacity-30'}`} />
                  <span>{isMatch ? 'Konfirmasi kata sandi cocok' : 'Kata sandi belum sama'}</span>
                </div>
              )}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !isPasswordValid || !isMatch || !token}
            className="w-full py-3.5 px-4 rounded-[16px] bg-[#09090b] dark:bg-white text-white dark:text-[#09090b] hover:bg-[#18181b] dark:hover:bg-zinc-200 text-xs font-bold transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-2 pt-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            <span>{loading ? 'Menyimpan...' : 'Perbarui Kata Sandi'}</span>
          </button>
        </form>
      )}

      {/* Link to login */}
      <div className="text-center text-xs text-[#71717a] pt-2 border-t border-[#ececee] dark:border-[#27272a]">
        Ingat kata sandi Anda?{' '}
        <Link href="/login" className="font-bold text-[var(--accent)] hover:underline">
          Masuk di sini
        </Link>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 rounded-[32px] bg-white dark:bg-[#18181b] border border-[#ececee] dark:border-[#27272a] flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-[var(--accent)]" />
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
