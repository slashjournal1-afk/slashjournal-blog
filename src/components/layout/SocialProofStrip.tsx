import React from 'react';

export function SocialProofStrip() {
  const stackItems = [
    'NEXT.JS APP ROUTER',
    'SQLITE EMBEDDED',
    'TAILWIND CSS V4',
    'TYPESCRIPT STRICT',
    'AWESOMIC ZINC SYSTEM',
    'ZERO CLS ADS ARCHITECTURE',
  ];

  return (
    <div className="w-full py-8 overflow-hidden">
      <div className="max-w-container mx-auto px-4">
        <p className="text-center text-[11px] uppercase tracking-[0.2em] text-ash font-medium mb-6">
          Standar Rekayasa & Prinsip Desain
        </p>
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12 opacity-60">
          {stackItems.map((item, idx) => (
            <span
              key={idx}
              className="text-[13px] md:text-[14px] font-bold text-steel tracking-wider font-mono select-none"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
