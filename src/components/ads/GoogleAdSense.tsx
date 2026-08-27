'use client';

import { useEffect, useRef, useState } from 'react';
import { pushDataLayer } from '@/lib/data-layer';
import { getAdSlotConfig, type AdSlotName } from '@/lib/ad-slots';
import { readAdvertisingConsent } from '@/lib/consent';

declare global {
  interface Window { adsbygoogle: unknown[]; }
}

interface GoogleAdSenseProps {
  slot: string | undefined;
  slotName: AdSlotName;
  layoutKey?: string;
  className?: string;
}

export function GoogleAdSense({ slot, slotName, layoutKey, className = '' }: GoogleAdSenseProps) {
  const config = getAdSlotConfig(slotName);
  const [enabled, setEnabled] = useState(false);
  const [scriptReady, setScriptReady] = useState(() => typeof window !== 'undefined' && Array.isArray(window.adsbygoogle));
  const [visible, setVisible] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const pushedRef = useRef(false);
  const publisherId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID;

  useEffect(() => {
    const readConsent = () => setEnabled(readAdvertisingConsent());
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
    if (!enabled) return;
    const element = boxRef.current;
    if (!element) return;
    if (typeof IntersectionObserver === 'undefined') {
      queueMicrotask(() => setVisible(true));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '400px 0px' },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [enabled]);

  useEffect(() => {
    if (!enabled || !scriptReady || !visible || !slot || !publisherId || pushedRef.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushDataLayer('ad_impression', { ad_provider: 'adsense', ad_slot: slot });
      pushedRef.current = true;
    } catch (error) {
      console.error('AdSense slot initialization failed:', error);
    }
  }, [enabled, scriptReady, visible, slot, publisherId]);

  if (!enabled || !slot || !publisherId) return null;

  return (
    <div
      ref={boxRef}
      className={`relative overflow-hidden border border-[var(--border-color)] bg-[var(--bg-card)] ${config.aspectClass} ${config.roundedClass} ${className}`}
      aria-label="Iklan"
    >
      <ins
        className="adsbygoogle absolute inset-0 block"
        style={{ display: 'block' }}
        data-ad-client={publisherId}
        data-ad-slot={slot}
        data-ad-format={layoutKey ? 'fluid' : 'auto'}
        data-ad-layout-key={layoutKey}
        data-full-width-responsive="true"
      />
    </div>
  );
}
