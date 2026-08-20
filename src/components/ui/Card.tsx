import React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'surface' | 'subtle' | 'dark' | 'glass';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({
  className,
  variant = 'surface',
  padding = 'md',
  children,
  ...props
}: CardProps) {
  const base = 'rounded-card border transition-all duration-200 overflow-hidden';

  const variants = {
    // Standard 36px white card with hairline border
    surface: 'bg-snow border-cloud text-graphite',
    subtle: 'bg-[#fafafa] border-cloud text-graphite',
    // Inverted dark card (#18181b or #27272a)
    dark: 'bg-slate border-[#3f3f46] text-white',
    glass: 'bg-white/80 backdrop-blur-md border-cloud text-graphite',
  };

  const paddings = {
    none: 'p-0',
    sm: 'p-4 md:p-5',
    md: 'p-6 md:p-7', // ~28px padding as in DESIGN.md
    lg: 'p-8 md:p-10',
  };

  return (
    <div className={cn(base, variants[variant], paddings[padding], className)} {...props}>
      {children}
    </div>
  );
}
