'use client';

import { usePathname } from 'next/navigation';
import React from 'react';

const RESERVED_ROOT_SEGMENTS = new Set(['series', 'glossary', 'category', 'about', 'contact']);

export function TopBannerGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (!pathname) return null;

  const segments = pathname.split('/').filter(Boolean);
  const isArticleRoute = segments.length === 1 && !RESERVED_ROOT_SEGMENTS.has(segments[0]);
  if (isArticleRoute) return null;

  return <>{children}</>;
}
