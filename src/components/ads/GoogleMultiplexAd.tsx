'use client';

import React, { useEffect, useRef, useState } from 'react';
import { pushDataLayer } from '@/lib/data-layer';
import { Sparkles } from 'lucide-react';

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

interface GoogleMultiplexAdProps {
  slot?: string;
  publisherId?: string;
  title?: string;
  className?: string;
}

export function GoogleMultiplexAd({
  slot = process.env.NEXT_PUBLIC_ADSENSE_MULTIPLEX_SLOT || '5979804118',
  publisherId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID || 'ca-pub-7524844307744923',
  title = 'Rekomendasi & Materi Terkait',
  className = '',
}: GoogleMultiplexAdProps) {
  const [scriptReady, setScriptReady] = useState(
    () => typeof window !== 'undefined' && Array.isArray(window.adsbygoogle),
  );
  const [visible, setVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const pushedRef = useRef(false);

  useEffect(() => {
    const handleReady = () => setScriptReady(true);
    if (typeof window !== 'undefined' && Array.isArray(window.adsbygoogle)) {
      setScriptReady(true);
    }
    window.addEventListener('slashjournal:adsense-ready', handleReady);
    return () => {
      window.removeEventListener('slashjournal:adsense-ready', handleReady);
    };
  }, []);

  useEffect(() => {
    const element = containerRef.current;
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
  }, []);

  useEffect(() => {
    if (!scriptReady || !visible || !slot || !publisherId || pushedRef.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushDataLayer('ad_impression', {
        ad_provider: 'adsense',
        ad_format: 'multiplex',
        ad_slot: slot,
      });
      pushedRef.current = true;
    } catch (error) {
      console.error('Multiplex AdSense initialization failed:', error);
    }
  }, [scriptReady, visible, slot, publisherId]);

  if (!slot || !publisherId) return null;

  return (
    <section
      ref={containerRef}
      className={`my-10 overflow-hidden rounded-[28px] border border-[var(--border-color)] bg-[var(--bg-card)] p-5 sm:p-7 transition-all ${className}`}
      aria-label="Iklan Rekomendasi Multipleks"
    >
      {/* Header Label yang Mematuhi Aturan Google (Jelas & Tidak Menyesatkan) */}
      <div className="mb-4 flex items-center justify-between border-b border-[var(--border-color)] pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-[var(--accent)]" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">
            {title}
          </span>
        </div>
        <span className="text-[10px] font-medium tracking-wider text-[var(--text-muted)] opacity-70">
          Sponsor / Iklan Google
        </span>
      </div>

      {/* Container Iklan Multipleks */}
      <div className="relative min-h-[250px] w-full overflow-hidden rounded-[20px] bg-[var(--bg-card-muted)]">
        <ins
          className="adsbygoogle block w-full"
          style={{ display: 'block' }}
          data-ad-client={publisherId}
          data-ad-slot={slot}
          data-ad-format="autorelaxed"
          data-full-width-responsive="true"
        />
      </div>
    </section>
  );
}
