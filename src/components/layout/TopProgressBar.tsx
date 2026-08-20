'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export function TopProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isNavigating, setIsNavigating] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Whenever pathname or searchParams finish updating, complete progress bar
    if (isNavigating) {
      setProgress(100);
      const timeout = setTimeout(() => {
        setIsNavigating(false);
        setProgress(0);
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [pathname, searchParams]);

  useEffect(() => {
    // Intercept all internal anchor clicks for immediate visual response
    const handleAnchorClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const anchor = target.closest('a');

      if (!anchor) return;

      const href = anchor.getAttribute('href');
      const isTargetBlank = anchor.getAttribute('target') === '_blank';

      if (
        href &&
        href.startsWith('/') &&
        !isTargetBlank &&
        !href.startsWith('#') &&
        href !== pathname
      ) {
        setIsNavigating(true);
        setProgress(30);

        // Smooth incremental progress simulation
        const interval = setInterval(() => {
          setProgress((prev) => {
            if (prev >= 85) {
              clearInterval(interval);
              return 85;
            }
            return prev + 15;
          });
        }, 150);

        setTimeout(() => clearInterval(interval), 4000);
      }
    };

    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, [pathname]);

  if (!isNavigating && progress === 0) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 h-[2.5px] z-[9999] pointer-events-none transition-all duration-200 ease-out"
      style={{
        width: `${progress}%`,
        background: '#00A86B',
      }}
    />
  );
}
