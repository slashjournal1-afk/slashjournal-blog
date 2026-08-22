'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';
import { pushDataLayer } from '@/lib/data-layer';

declare global {
  interface Window { adsbygoogle: unknown[]; }
}

interface GoogleAdSenseProps {
  slot: string | undefined;
  format?: string;
  className?: string;
}

export function GoogleAdSense({ slot, format = 'auto', className = '' }: GoogleAdSenseProps) {
  const [enabled, setEnabled] = useState(false);
  const publisherId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID;

  useEffect(() => {
    const readConsent = () => {
      try {
        const state = JSON.parse(localStorage.getItem('slashjournal-consent-v2') || 'null');
        setEnabled(state?.advertising === 'granted');
      } catch { setEnabled(false); }
    };
    readConsent();
    window.addEventListener('slashjournal:consent-update', readConsent);
    return () => window.removeEventListener('slashjournal:consent-update', readConsent);
  }, []);

  useEffect(() => {
    if (!enabled || !slot || !publisherId) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushDataLayer('ad_impression', { ad_provider: 'adsense', ad_slot: slot });
    } catch {}
  }, [enabled, slot, publisherId]);

  if (!enabled || !slot || !publisherId) return null;

  return (
    <div className={`min-h-[100px] overflow-hidden ${className}`} aria-label="Iklan">
      <Script id="google-adsense-script" async strategy="afterInteractive" crossOrigin="anonymous" src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`} />
      <ins className="adsbygoogle block" style={{ display: 'block' }} data-ad-client={publisherId} data-ad-slot={slot} data-ad-format={format} data-full-width-responsive="true" />
    </div>
  );
}
