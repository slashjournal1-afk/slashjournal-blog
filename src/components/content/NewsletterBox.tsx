'use client';

import React, { useState } from 'react';
import { Mail, CheckCircle2, Loader2 } from 'lucide-react';

interface NewsletterBoxProps {
  className?: string;
  defaultTopic?: string;
}

export function NewsletterBox({ className = '', defaultTopic = 'all' }: NewsletterBoxProps) {
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState(defaultTopic);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, topic }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal mendaftarkan email');

      setSuccess(true);
      setEmail('');
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat mendaftar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={className}>
      {success ? (
        <div className="space-y-4 py-4 text-left animate-in fade-in">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--accent-soft)] text-[var(--accent)]">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <h4 className="font-display text-xl font-medium text-[var(--text-primary)]">
            Terima kasih telah berlangganan.
          </h4>
          <p className="max-w-md text-sm leading-relaxed text-[var(--text-muted)]">
            Anda akan menerima catatan berkala langsung di kotak masuk email Anda.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">
              Catatan Mingguan
            </p>
            <h3 className="font-display text-2xl font-medium tracking-tight text-[var(--text-primary)]">
              Bawa naskah baru ke inbox Anda.
            </h3>
            <p className="max-w-xl text-sm leading-relaxed text-[var(--text-muted)]">
              Satu email berkala saat naskah baru terbit. Tanpa spam, tanpa promosi kosong.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Topic Selector */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium text-[var(--text-muted)]">Fokus minat:</span>
              {[
                { id: 'all', label: 'Semua Kanal' },
                { id: 'rekayasa-sistem', label: 'Rekayasa Sistem' },
                { id: 'desain-antarmuka', label: 'Desain Antarmuka' },
              ].map((t) => (
                <button
                  type="button"
                  key={t.id}
                  onClick={() => setTopic(t.id)}
                  className={`rounded-full px-3 py-1 text-xs transition-colors ${
                    topic === t.id
                      ? 'bg-[var(--color-ink)] font-medium text-white'
                      : 'text-[var(--text-muted)] ring-1 ring-inset ring-[var(--border-color)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Email Input */}
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative flex-1">
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-[var(--text-muted)]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alamat-email@contoh.com"
                  className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)] py-2.5 pl-10 pr-4 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="flex shrink-0 items-center justify-center gap-2 rounded-lg bg-[var(--color-ink)] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[var(--color-charcoal)] disabled:opacity-60"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Berlangganan
              </button>
            </div>

            {error && <p className="text-xs text-rose-600">{error}</p>}
          </form>
        </div>
      )}
    </div>
  );
}