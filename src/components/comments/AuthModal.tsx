'use client';

import React, { useState } from 'react';
import { X, Mail, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (reader: { id: string; email: string; displayName: string }) => void;
}

export function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [step, setStep] = useState<'email' | 'verify' | 'profile'>('email');
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [magicLinkUrl, setMagicLinkUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRequestMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Masukkan alamat email yang valid.');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/reader/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal mengirim tautan masuk');

      if (data.magicLink) {
        setMagicLinkUrl(data.magicLink);
      }
      setStep('verify');
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyToken = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError('Masukkan token verifikasi.');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/reader/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Token tidak valid atau kedaluwarsa');

      if (data.isNewReader) {
        setStep('profile');
      } else {
        onSuccess(data.reader);
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Verifikasi gagal');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) {
      setError('Masukkan nama tampilan.');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/reader/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ displayName }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal menyimpan nama tampilan');

      onSuccess(data.reader);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan profil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md rounded-[32px] border border-cloud bg-snow p-6 md:p-8 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full text-fog hover:text-obsidian hover:bg-paper transition-colors"
          aria-label="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        {step === 'email' && (
          <form onSubmit={handleRequestMagicLink} className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-paper border border-cloud flex items-center justify-center text-ember mb-4">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-[20px] font-bold text-obsidian tracking-tight">
                Masuk untuk Berkomentar
              </h3>
              <p className="text-[14px] text-fog mt-1 leading-relaxed">
                Kami menggunakan tautan masuk instan tanpa password. Cukup masukkan email Anda.
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-btn bg-red-50 border border-red-200 text-red-700 text-[13px] flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[13px] font-semibold text-graphite">Alamat Email</label>
              <Input
                type="email"
                placeholder="nama@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>

            <Button type="submit" variant="primary" className="w-full" disabled={loading}>
              {loading ? 'Mengirim...' : 'Kirim Tautan Masuk'}
            </Button>
          </form>
        )}

        {step === 'verify' && (
          <form onSubmit={handleVerifyToken} className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-4">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-[20px] font-bold text-obsidian tracking-tight">
                Periksa Email Anda
              </h3>
              <p className="text-[14px] text-fog mt-1 leading-relaxed">
                Tautan masuk telah dikirim ke <span className="font-semibold text-graphite">{email}</span>.
              </p>
            </div>

            {magicLinkUrl && (
              <div className="p-4 rounded-btn bg-amber-50 border border-amber-200 text-[13px] space-y-2">
                <p className="font-semibold text-amber-900">Mode Lokal (Simulasi Email):</p>
                <a
                  href={magicLinkUrl}
                  onClick={(e) => {
                    e.preventDefault();
                    const url = new URL(magicLinkUrl, window.location.origin);
                    const t = url.searchParams.get('token');
                    if (t) {
                      setToken(t);
                    }
                  }}
                  className="text-ember hover:underline font-mono text-[12px] break-all block"
                >
                  Klik di sini untuk mengisi token otomatis
                </a>
              </div>
            )}

            {error && (
              <div className="p-3 rounded-btn bg-red-50 border border-red-200 text-red-700 text-[13px] flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[13px] font-semibold text-graphite">Kode / Token Masuk</label>
              <Input
                placeholder="Masukkan token dari email"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                required
              />
            </div>

            <Button type="submit" variant="primary" className="w-full" disabled={loading}>
              {loading ? 'Memverifikasi...' : 'Verifikasi & Masuk'}
            </Button>
          </form>
        )}

        {step === 'profile' && (
          <form onSubmit={handleCompleteProfile} className="space-y-4">
            <div>
              <h3 className="text-[20px] font-bold text-obsidian tracking-tight">
                Pilih Nama Tampilan
              </h3>
              <p className="text-[14px] text-fog mt-1 leading-relaxed">
                Nama ini akan ditampilkan di kolom komentar. Anda dapat menggunakan nama panggilan atau nama asli.
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-btn bg-red-50 border border-red-200 text-red-700 text-[13px] flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[13px] font-semibold text-graphite">Nama Tampilan</label>
              <Input
                placeholder="Misal: Andi Pratama"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                autoFocus
              />
              <p className="text-[12px] text-ash">
                Nama sistem seperti &quot;Admin&quot; atau &quot;Redaksi&quot; tidak diperkenankan.
              </p>
            </div>

            <Button type="submit" variant="primary" className="w-full" disabled={loading}>
              {loading ? 'Menyimpan...' : 'Selesai & Lanjut Komentar'}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
