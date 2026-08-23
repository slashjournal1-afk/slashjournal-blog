'use client';

import React, { RefObject, useEffect, useId, useRef, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { X, AlertCircle, CheckCircle2, Loader2, KeyRound, Mail, User } from 'lucide-react';
import { pushDataLayer } from '@/lib/data-layer';
import { OAuthButtons } from './OAuthButtons';
import { BrandLogo } from '@/components/layout/BrandLogo';

export function AuthModal({ restoreFocusRef }: { restoreFocusRef?: RefObject<HTMLElement | null> }) {
  const { isAuthModalOpen } = useAuth();
  return isAuthModalOpen ? <AuthModalContent restoreFocusRef={restoreFocusRef} /> : null;
}

function AuthModalContent({ restoreFocusRef }: { restoreFocusRef?: RefObject<HTMLElement | null> }) {
  const { closeAuthModal, completeLogin } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const closeAuthModalRef = useRef(closeAuthModal);
  const requestControllerRef = useRef<AbortController | null>(null);
  const requestIdRef = useRef(0);
  const displayNameId = useId();
  const emailId = useId();
  const passwordId = useId();

  useEffect(() => {
    closeAuthModalRef.current = closeAuthModal;
  }, [closeAuthModal]);

  useEffect(() => {
    previousFocusRef.current = restoreFocusRef?.current ?? (document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null);
    if (restoreFocusRef) restoreFocusRef.current = null;
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeAuthModalRef.current();
        return;
      }
      if (event.key !== 'Tab') return;

      const focusable = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [contenteditable="true"], [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable?.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (previousFocusRef.current?.isConnected) previousFocusRef.current.focus();
    };
  }, [restoreFocusRef]);

  useEffect(() => () => {
    requestControllerRef.current?.abort();
    requestIdRef.current += 1;
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);
    requestControllerRef.current?.abort();
    const controller = new AbortController();
    requestControllerRef.current = controller;
    const requestId = ++requestIdRef.current;

    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const body: { email: string; password: string; displayName?: string } = { email, password };
      if (mode === 'register') body.displayName = displayName;

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      const data = await res.json() as { error?: string; user: Parameters<typeof completeLogin>[0] };
      if (requestId !== requestIdRef.current) return;
      if (!res.ok) throw new Error(data.error || 'Autentikasi gagal');

      setSuccessMsg(mode === 'login' ? 'Login berhasil!' : 'Pendaftaran berhasil!');
      pushDataLayer(mode === 'login' ? 'login' : 'sign_up', { method: 'password' });
      completeLogin(data.user);
      closeAuthModal();
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === 'AbortError') return;
      if (requestId !== requestIdRef.current) return;
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan sistem');
    } finally {
      if (requestId === requestIdRef.current) setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-150" onPointerDown={(event) => { if (event.target === event.currentTarget) closeAuthModal(); }}>
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
         className="relative my-auto max-h-[calc(100dvh_-_2rem)] w-full max-w-md overflow-y-auto rounded-[36px] border border-[#ececee] dark:border-[#27272a] bg-white p-6 shadow-2xl dark:bg-[#18181b] sm:p-8 animate-in zoom-in-95 duration-150"
      >
        {/* Close Button */}
        <button
          ref={closeButtonRef}
          type="button"
          onClick={closeAuthModal}
           className="absolute top-6 right-6 p-2 rounded-full text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-muted)] transition-all active:scale-90"
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

             <h2 id="auth-modal-title" className="text-2xl font-extrabold text-[var(--text-primary)] tracking-tight pt-1">
              {mode === 'login' ? 'Masuk ke Akun' : 'Buat Akun Peneliti'}
            </h2>
             <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Akses pustaka bookmark, voting umpan balik, dan partisipasi diskusi rekayasa sistem.
            </p>
          </div>

          {/* Feedback messages */}
          {error && (
            <div role="alert" aria-live="assertive" className="p-3.5 rounded-[16px] bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div role="status" aria-live="polite" className="p-3.5 rounded-[16px] bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div className="space-y-1.5">
               <label htmlFor={displayNameId} className="text-[11px] font-bold text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[var(--accent)]" />
                  Nama Tampilan
                </label>
                <input
                  id={displayNameId}
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Contoh: Andi Pratama"
                  required
                 className="w-full px-4 py-3 rounded-[16px] bg-[var(--bg-card-muted)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] transition-colors"
                />
              </div>
            )}

            <div className="space-y-1.5">
               <label htmlFor={emailId} className="text-[11px] font-bold text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[var(--accent)]" />
                Alamat Email
              </label>
              <input
                id={emailId}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@domain.com"
                required
                 className="w-full px-4 py-3 rounded-[16px] bg-[var(--bg-card-muted)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] transition-colors"
              />
            </div>

            <div className="space-y-1.5">
               <label htmlFor={passwordId} className="text-[11px] font-bold text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-[var(--accent)]" />
                Kata Sandi
              </label>
              <input
                id={passwordId}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                 className="w-full px-4 py-3 rounded-[16px] bg-[var(--bg-card-muted)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
               className="w-full py-3.5 px-4 rounded-[16px] bg-[var(--text-primary)] text-[var(--bg-primary)] hover:bg-[var(--text-secondary)] text-xs font-bold transition-all active:scale-[0.98] flex items-center justify-center gap-2 pt-3"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              <span>{mode === 'login' ? 'Masuk ke Akun' : 'Daftar Akun Baru'}</span>
            </button>
          </form>

          <OAuthButtons />

          {/* Mode Switcher */}
           <div className="text-center text-xs text-[var(--text-muted)] pt-3 border-t border-[var(--border-color)]">
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
