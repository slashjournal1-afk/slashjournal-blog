'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Mail, KeyRound, Eye, EyeOff, Loader2, AlertCircle, CheckCircle2, Shield } from 'lucide-react';
import { pushDataLayer } from '@/lib/data-layer';
import { OAuthButtons } from '@/components/auth/OAuthButtons';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || searchParams.get('callbackUrl');
  const isResetSuccess = searchParams.get('reset') === 'success';

  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(
    isResetSuccess ? 'Kata sandi berhasil direset! Silakan masuk dengan kata sandi baru Anda.' : null
  );

  // If already logged in, redirect to appropriate role dashboard
  React.useEffect(() => {
    if (user) {
      if (redirectUrl) {
        router.push(redirectUrl);
      } else if (user.role === 'ADMIN') {
        router.push('/dashboard/superadmin');
      } else if (user.role === 'EDITOR' || user.role === 'AUTHOR') {
        router.push('/dashboard/creator');
      } else {
        router.push('/dashboard/member');
      }
    }
  }, [user, redirectUrl, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Autentikasi gagal');

      setSuccessMsg('Login berhasil! Mengalihkan ke ruang kerja...');
      pushDataLayer('login', { method: 'password' });
      if (redirectUrl) {
        router.replace(redirectUrl);
      } else if (data.user?.role === 'ADMIN') {
        router.replace('/dashboard/superadmin');
      } else if (data.user?.role === 'EDITOR' || data.user?.role === 'AUTHOR') {
        router.replace('/dashboard/creator');
      } else {
        router.replace('/dashboard/member');
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat masuk');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-[32px] border border-[#ececee] dark:border-[#27272a] bg-white dark:bg-[#18181b] p-6 sm:p-8 shadow-xl space-y-6">
      {/* Header */}
      <div className="space-y-1.5 text-center sm:text-left">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[10px] bg-orange-50 dark:bg-orange-950/30 border border-[var(--accent)]/20 text-[var(--accent)] text-[11px] font-bold uppercase tracking-wider mb-1">
          <Shield className="w-3.5 h-3.5" />
          <span>Akses Portal Arsitektur</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#09090b] dark:text-white tracking-tight">
          Masuk ke Akun
        </h1>
        <p className="text-xs text-[#71717a] dark:text-[#a1a1aa] leading-relaxed">
          Kelola naskah, moderasi sistem, dan pantau telemetri pembaca.
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

      {/* Main Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
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
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#09090b] dark:text-white flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-[var(--accent)]" />
              Kata Sandi
            </label>
            <Link
              href="/forgot-password"
              className="text-[11px] font-bold text-[var(--accent)] hover:underline"
            >
              Lupa sandi?
            </Link>
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
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

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 px-4 rounded-[16px] bg-[#09090b] dark:bg-white text-white dark:text-[#09090b] hover:bg-[#18181b] dark:hover:bg-zinc-200 text-xs font-bold transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-2 pt-3"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          <span>{loading ? 'Memverifikasi...' : 'Masuk ke Akun'}</span>
        </button>
      </form>

      <OAuthButtons />

      {/* Switch to Register */}
      <div className="text-center text-xs text-[#71717a] pt-2">
        Belum memiliki akun?{' '}
        <Link href="/register" className="font-bold text-[var(--accent)] hover:underline">
          Daftar di sini
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 rounded-[32px] bg-white dark:bg-[#18181b] border border-[#ececee] dark:border-[#27272a] flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-[var(--accent)]" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
