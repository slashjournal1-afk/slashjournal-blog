'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { X, AlertCircle, CheckCircle2, Loader2, KeyRound, Mail, User } from 'lucide-react';
import { pushDataLayer } from '@/lib/data-layer';
import { OAuthButtons } from './OAuthButtons';
import { BrandLogo } from '@/components/layout/BrandLogo';

export function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, completeLogin } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const body: any = { email, password };
      if (mode === 'register') body.displayName = displayName;

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Autentikasi gagal');

      setSuccessMsg(mode === 'login' ? 'Login berhasil!' : 'Pendaftaran berhasil!');
      pushDataLayer(mode === 'login' ? 'login' : 'sign_up', { method: 'password' });
      completeLogin(data.user);
      closeAuthModal();
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan sistem');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-150">
      <div
        className="w-full max-w-md rounded-[36px] border border-[#ececee] dark:border-[#27272a] bg-white dark:bg-[#18181b] shadow-2xl p-6 sm:p-8 relative animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-6 right-6 p-2 rounded-full text-[#71717a] hover:text-[#09090b] dark:hover:text-white hover:bg-[#f4f4f5] dark:hover:bg-[#27272a] transition-all active:scale-90"
          aria-label="Tutup modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-6">
          {/* Header */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <BrandLogo size={32} className="rounded-icon" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--accent)]">
                Akses Arsitek
              </span>
            </div>

            <h3 className="text-2xl font-extrabold text-[#09090b] dark:text-white tracking-tight pt-1">
              {mode === 'login' ? 'Masuk ke Akun' : 'Buat Akun Peneliti'}
            </h3>
            <p className="text-xs text-[#71717a] dark:text-[#a1a1aa] leading-relaxed">
              Akses pustaka bookmark, voting umpan balik, dan partisipasi diskusi rekayasa sistem.
            </p>
          </div>

          {/* Feedback messages */}
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

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-[#09090b] dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[var(--accent)]" />
                  Nama Tampilan
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Contoh: Andi Pratama"
                  required
                  className="w-full px-4 py-3 rounded-[16px] bg-[#f4f4f5] dark:bg-[#27272a] border border-[#ececee] dark:border-[#3f3f46] text-xs text-[#09090b] dark:text-white focus:outline-none focus:border-[var(--accent)] transition-colors"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#09090b] dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[var(--accent)]" />
                Alamat Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@domain.com"
                required
                className="w-full px-4 py-3 rounded-[16px] bg-[#f4f4f5] dark:bg-[#27272a] border border-[#ececee] dark:border-[#3f3f46] text-xs text-[#09090b] dark:text-white focus:outline-none focus:border-[var(--accent)] transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#09090b] dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-[var(--accent)]" />
                Kata Sandi
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 rounded-[16px] bg-[#f4f4f5] dark:bg-[#27272a] border border-[#ececee] dark:border-[#3f3f46] text-xs text-[#09090b] dark:text-white focus:outline-none focus:border-[var(--accent)] transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-[16px] bg-[#09090b] dark:bg-white text-white dark:text-[#09090b] hover:bg-[#18181b] dark:hover:bg-zinc-200 text-xs font-bold transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-2 pt-3"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              <span>{mode === 'login' ? 'Masuk ke Akun' : 'Daftar Akun Baru'}</span>
            </button>
          </form>

          <OAuthButtons />

          {/* Mode Switcher */}
          <div className="text-center text-xs text-[#71717a] pt-3 border-t border-[#ececee] dark:border-[#27272a]">
            {mode === 'login' ? (
              <p>
                Belum memiliki akun?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setError(null);
                  }}
                  className="font-bold text-[var(--accent)] hover:underline"
                >
                  Daftar di sini
                </button>
              </p>
            ) : (
              <p>
                Sudah memiliki akun?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setError(null);
                  }}
                  className="font-bold text-[var(--accent)] hover:underline"
                >
                  Masuk di sini
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
