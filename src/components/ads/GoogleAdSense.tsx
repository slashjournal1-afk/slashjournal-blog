'use client';

import { useEffect, useRef, useState } from 'react';
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
  const [scriptReady, setScriptReady] = useState(() => typeof window !== 'undefined' && Array.isArray(window.adsbygoogle));
  const pushedRef = useRef(false);
  const publisherId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID;

  useEffect(() => {
    const readConsent = () => {
      try {
        const state = JSON.parse(localStorage.getItem('slashjournal-consent-v2') || 'null');
        setEnabled(state?.advertising === 'granted');
      } catch { setEnabled(false); }
    };
    readConsent();
    const handleReady = () => setScriptReady(true);
    window.addEventListener('slashjournal:consent-update', readConsent);
    window.addEventListener('slashjournal:adsense-ready', handleReady);
    return () => {
      window.removeEventListener('slashjournal:consent-update', readConsent);
      window.removeEventListener('slashjournal:adsense-ready', handleReady);
    };
  }, []);

  useEffect(() => {
    if (!enabled || !scriptReady || !slot || !publisherId || pushedRef.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushDataLayer('ad_impression', { ad_provider: 'adsense', ad_slot: slot });
      pushedRef.current = true;
    } catch (error) {
      console.error('AdSense slot initialization failed:', error);
    }
  }, [enabled, scriptReady, slot, publisherId]);

  if (!enabled || !slot || !publisherId) return null;

  return (
    <div className={`min-h-[100px] overflow-hidden ${className}`} aria-label="Iklan">
      <ins className="adsbygoogle block" style={{ display: 'block' }} data-ad-client={publisherId} data-ad-slot={slot} data-ad-format={format} data-full-width-responsive="true" />
    </div>
  );
}
