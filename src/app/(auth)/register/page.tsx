'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Mail, KeyRound, User, Eye, EyeOff, Loader2, AlertCircle, CheckCircle2, Check, Sparkles } from 'lucide-react';
import { pushDataLayer } from '@/lib/data-layer';

export default function RegisterPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Password Strength Indicators
  const isMinLength = password.length >= 8;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const isPasswordValid = isMinLength && hasLetter && hasNumber;
  const isMatch = password.length > 0 && password === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!isMinLength) {
      setError('Kata sandi minimal harus 8 karakter');
      return;
    }

    if (password !== confirmPassword) {
      setError('Konfirmasi kata sandi tidak cocok');
      return;
    }

    if (!agreeTerms) {
      setError('Anda harus menyetujui ketentuan layanan');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          displayName,
          email,
          password,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Pendaftaran akun gagal');

      setSuccessMsg('Pendaftaran berhasil! Menyiapkan ruang kerja Anda...');
      pushDataLayer('sign_up', { method: 'password' });
      await refreshUser();

      setTimeout(() => {
        router.push('/dashboard/member');
      }, 700);
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
          <Sparkles className="w-3.5 h-3.5" />
          <span>Komunitas Arsitektur &amp; Redaksi</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#09090b] dark:text-white tracking-tight">
          Daftar Akun Baru
        </h1>
        <p className="text-xs text-[#71717a] dark:text-[#a1a1aa] leading-relaxed">
          Simpan artikel ke bookmark pribadi, berikan umpan balik, dan berdiskusi.
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
        <div className="p-3.5 rounded-[16px] bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Register Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Field */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold uppercase tracking-wider text-[#09090b] dark:text-white flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-[var(--accent)]" />
            Nama Lengkap / Tampilan
          </label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Contoh: Rian Sanjaya"
            required
            className="w-full px-4 py-3 rounded-[16px] bg-[#f4f4f5] dark:bg-[#27272a] border border-[#ececee] dark:border-[#3f3f46] text-xs text-[#09090b] dark:text-white focus:outline-none focus:border-[var(--accent)] transition-colors"
          />
        </div>

        {/* Email Field */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold uppercase tracking-wider text-[#09090b] dark:text-white flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-[var(--accent)]" />
            Alamat Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="nama@domain.com"
            required
            autoComplete="email"
            className="w-full px-4 py-3 rounded-[16px] bg-[#f4f4f5] dark:bg-[#27272a] border border-[#ececee] dark:border-[#3f3f46] text-xs text-[#09090b] dark:text-white focus:outline-none focus:border-[var(--accent)] transition-colors"
          />
        </div>

        {/* Password Field */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold uppercase tracking-wider text-[#09090b] dark:text-white flex items-center gap-1.5">
            <KeyRound className="w-3.5 h-3.5 text-[var(--accent)]" />
            Kata Sandi
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
            Konfirmasi Kata Sandi
          </label>
          <input
            type={showPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Ulangi kata sandi..."
            required
            autoComplete="new-password"
            className="w-full px-4 py-3 rounded-[16px] bg-[#f4f4f5] dark:bg-[#27272a] border border-[#ececee] dark:border-[#3f3f46] text-xs text-[#09090b] dark:text-white focus:outline-none focus:border-[var(--accent)] transition-colors"
          />
        </div>

        {/* Real-time Password Requirements Checklist */}
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

        {/* Terms Checkbox */}
        <div className="flex items-start gap-2 pt-1">
          <input
            type="checkbox"
            id="terms"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            className="mt-0.5 rounded border-[#ececee] dark:border-[#3f3f46] text-[var(--accent)] focus:ring-[var(--accent)]"
          />
          <label htmlFor="terms" className="text-xs text-[#71717a] dark:text-[#a1a1aa] leading-tight">
            Saya menyetujui{' '}
            <Link href="/terms" className="text-[#09090b] dark:text-white font-bold hover:underline">
              Ketentuan Layanan
            </Link>{' '}
            dan{' '}
            <Link href="/privacy-policy" className="text-[#09090b] dark:text-white font-bold hover:underline">
              Kebijakan Privasi
            </Link>
            .
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !isPasswordValid || !isMatch}
          className="w-full py-3.5 px-4 rounded-[16px] bg-[#09090b] dark:bg-white text-white dark:text-[#09090b] hover:bg-[#18181b] dark:hover:bg-zinc-200 text-xs font-bold transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-2 pt-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          <span>{loading ? 'Mendaftarkan...' : 'Buat Akun Sekarang'}</span>
        </button>
      </form>

      {/* Switch to Login */}
      <div className="text-center text-xs text-[#71717a] pt-2 border-t border-[#ececee] dark:border-[#27272a]">
        Sudah memiliki akun?{' '}
        <Link href="/login" className="font-bold text-[var(--accent)] hover:underline">
          Masuk di sini
        </Link>
      </div>
    </div>
  );
}
