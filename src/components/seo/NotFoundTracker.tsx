'use client';

import { useEffect } from 'react';
import { pushDataLayer } from '@/lib/data-layer';

export function NotFoundTracker() {
  useEffect(() => {
    pushDataLayer('page_not_found', {
      path: window.location.pathname,
      referrer: document.referrer || undefined,
    });
  }, []);

  return null;
}
