'use client';

import React from 'react';
import { Sparkles, ExternalLink } from 'lucide-react';

interface SponsoredBadgeProps {
  sponsorName?: string | null;
  sponsorUrl?: string | null;
  className?: string;
}

export function SponsoredBadge({ sponsorName, sponsorUrl, className = '' }: SponsoredBadgeProps) {
  if (!sponsorName) return null;

  const handleSponsorClick = (e: React.MouseEvent) => {
    if (!sponsorUrl) return;
    e.preventDefault();
    e.stopPropagation();
    window.open(sponsorUrl, '_blank', 'noopener,noreferrer,nofollow');
  };

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[12px] bg-[var(--accent)] text-[var(--accent-foreground)] text-[11px] font-bold tracking-wide shadow-xs ${className}`}
    >
      <Sparkles className="w-3.5 h-3.5" />
      <span className="opacity-90">POS BERSPONSOR:</span>
      {sponsorUrl ? (
        <span
          role="link"
          tabIndex={0}
          onClick={handleSponsorClick}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleSponsorClick(e as any);
            }
          }}
          className="underline font-bold hover:text-zinc-100 inline-flex items-center gap-0.5 cursor-pointer transition-colors"
          title={`Buka situs sponsor: ${sponsorUrl}`}
        >
          {sponsorName}
          <ExternalLink className="w-3 h-3 inline ml-0.5" />
        </span>
      ) : (
        <span className="font-bold">{sponsorName}</span>
      )}
    </div>
  );
}
