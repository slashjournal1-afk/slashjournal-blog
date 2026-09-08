'use client';

import { useEffect } from 'react';

const ADSENSE_SCRIPT_SELECTOR = 'script[src*="pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]';

let adsenseScriptLoaded = false;

export function GoogleAdSenseLoader() {
  useEffect(() => {
    const notifyReady = () => {
      adsenseScriptLoaded = true;
      window.dispatchEvent(new CustomEvent('slashjournal:adsense-ready'));
    };

    if (typeof window !== 'undefined' && Array.isArray(window.adsbygoogle)) {
      notifyReady();
      return;
    }

    const script = document.querySelector<HTMLScriptElement>(ADSENSE_SCRIPT_SELECTOR);
    if (script) {
      if (adsenseScriptLoaded) {
        notifyReady();
      } else {
        script.addEventListener('load', notifyReady, { once: true });
      }
    }
  }, []);

  return null;
}
