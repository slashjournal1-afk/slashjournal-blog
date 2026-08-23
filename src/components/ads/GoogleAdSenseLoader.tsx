'use client';

import { useEffect, useState } from 'react';

const CONSENT_KEY = 'slashjournal-consent-v2';

export function GoogleAdSenseLoader() {
  const [enabled, setEnabled] = useState(false);
  const publisherId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID;

  useEffect(() => {
    const readConsent = () => {
      try {
        const state = JSON.parse(localStorage.getItem(CONSENT_KEY) || 'null');
        setEnabled(state?.advertising === 'granted');
      } catch {
        setEnabled(false);
      }
    };
    readConsent();
    window.addEventListener('slashjournal:consent-update', readConsent);
    return () => window.removeEventListener('slashjournal:consent-update', readConsent);
  }, []);

  if (!enabled || !publisherId) return null;

  return (
    <script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`}
      crossOrigin="anonymous"
      onLoad={() => window.dispatchEvent(new CustomEvent('slashjournal:adsense-ready'))}
      onError={() => console.error('AdSense script failed to load')}
    />
  );
}
