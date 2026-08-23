'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type ConsentChoice = 'granted' | 'denied';
type ConsentState = { analytics: ConsentChoice; advertising: ConsentChoice };

const STORAGE_KEY = 'slashjournal-consent-v2';

declare global {
  interface Window {
    dataLayer: Array<IArguments | Record<string, unknown>>;
    gtag: (...args: unknown[]) => void;
  }
}

export function updateConsent(state: ConsentState) {
  window.dataLayer = window.dataLayer || [];
  window.gtag?.('consent', 'update', {
    analytics_storage: state.analytics,
    ad_storage: state.advertising,
    ad_user_data: state.advertising,
    ad_personalization: state.advertising,
  });
  window.dataLayer.push({ event: 'consent_update', analytics_storage: state.analytics, ad_storage: state.advertising });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  window.dispatchEvent(new CustomEvent('slashjournal:consent-update', { detail: state }));
}

export function GoogleConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const storedValue = localStorage.getItem(STORAGE_KEY);
    let stored: ConsentState | null = null;
    try {
      const parsed = storedValue ? JSON.parse(storedValue) : null;
      if (parsed?.analytics && parsed?.advertising) stored = parsed;
    } catch {
      stored = null;
    }
    // Migrate the previous single-value consent format without granting ad consent.
    if (!stored && (storedValue === 'granted' || storedValue === 'denied')) {
      stored = { analytics: storedValue, advertising: 'denied' };
      updateConsent(stored);
    }
    if (stored) updateConsent(stored);
    // localStorage is an external store; this update intentionally happens after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVisible(!stored);

    const openSettings = () => setVisible(true);
    window.addEventListener('slashjournal:cookie-settings', openSettings);
    return () => window.removeEventListener('slashjournal:cookie-settings', openSettings);
  }, []);

  if (!visible) return null;

  return (
    <aside
      aria-label="Persetujuan cookie"
      className="fixed inset-x-4 bottom-4 z-[70] mx-auto max-w-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5 shadow-xs sm:inset-x-auto"
    >
      <h2 className="text-sm font-semibold text-[var(--text-primary)]">Pengaturan cookie</h2>
      <p className="mt-2 text-xs leading-relaxed text-[var(--text-muted)]">
        SlashJournal menggunakan pengukuran anonim untuk memahami halaman yang membantu pembaca. Cookie analitik hanya aktif setelah Anda menyetujuinya. Baca <Link className="underline" href="/cookie-policy">kebijakan cookie</Link> untuk detailnya.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
           onClick={() => { updateConsent({ analytics: 'granted', advertising: 'granted' }); setVisible(false); }}
          className="min-h-10 bg-[var(--color-ink)] px-4 text-xs font-semibold text-white"
        >
           Terima semua
        </button>
        <button
          type="button"
           onClick={() => { updateConsent({ analytics: 'denied', advertising: 'denied' }); setVisible(false); }}
          className="min-h-10 border border-[var(--border-color)] px-4 text-xs font-semibold text-[var(--text-primary)]"
        >
          Tolak
        </button>
      </div>
    </aside>
  );
}
