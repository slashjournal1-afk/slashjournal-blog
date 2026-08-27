'use client';

import { useEffect } from 'react';
import { readConsent } from '@/lib/consent';

const ADSENSE_SCRIPT_SELECTOR = 'script[src*="pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]';

let adsenseScriptLoaded = false;

export function GoogleAdSenseLoader() {
  const publisherId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID;

  useEffect(() => {
    const load = () => {
      if (!publisherId) return;
      if (readConsent()?.advertising !== 'granted') return;

      const existing = document.querySelector<HTMLScriptElement>(ADSENSE_SCRIPT_SELECTOR);
      if (existing) {
        if (adsenseScriptLoaded) {
          window.dispatchEvent(new CustomEvent('slashjournal:adsense-ready'));
        } else {
          existing.addEventListener('load', () => {
            adsenseScriptLoaded = true;
            window.dispatchEvent(new CustomEvent('slashjournal:adsense-ready'));
          }, { once: true });
        }
        return;
      }

      const script = document.createElement('script');
      script.async = true;
      script.crossOrigin = 'anonymous';
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`;
      script.addEventListener('load', () => {
        adsenseScriptLoaded = true;
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
