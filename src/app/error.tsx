'use client';

import { useEffect } from 'react';

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {}, []);
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-6 text-center">
      <h1 className="font-display text-3xl font-medium">Terjadi kesalahan</h1>
      <p className="mt-3 text-sm text-[var(--text-muted)]">Halaman ini tidak dapat dimuat. Silakan coba lagi.</p>
      <button onClick={() => reset()} className="mt-6 rounded-btn bg-[var(--text-primary)] px-4 py-2 text-sm font-semibold text-[var(--bg-primary)]">Coba lagi</button>
    </main>
  );
}
