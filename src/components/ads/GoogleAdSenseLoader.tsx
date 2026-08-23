'use client';

import { useEffect } from 'react';

const CONSENT_KEY = 'slashjournal-consent-v2';

export function GoogleAdSenseLoader() {
  const publisherId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID;

  useEffect(() => {
    const load = () => {
      if (!publisherId) return;
      try {
        const state = JSON.parse(localStorage.getItem(CONSENT_KEY) || 'null');
        if (state?.advertising !== 'granted') return;
      } catch {
        return;
      }

      const existing = document.querySelector<HTMLScriptElement>('script[data-slashjournal-adsense]');
      if (existing) {
        if (existing.dataset.loaded === 'true') window.dispatchEvent(new CustomEvent('slashjournal:adsense-ready'));
        return;
      }

      const script = document.createElement('script');
      script.async = true;
      script.crossOrigin = 'anonymous';
      script.dataset.slashjournalAdsense = 'true';
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`;
      script.addEventListener('load', () => {
        script.dataset.loaded = 'true';
        window.dispatchEvent(new CustomEvent('slashjournal:adsense-ready'));
      }, { once: true });
      script.addEventListener('error', () => console.error('AdSense script failed to load'), { once: true });
      document.head.appendChild(script);
    };

    load();
    window.addEventListener('slashjournal:consent-update', load);
    return () => window.removeEventListener('slashjournal:consent-update', load);
  }, [publisherId]);

  return null;
}
