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
    surface: 'bg-[var(--bg-card)] border-[var(--border-color)] text-[var(--text-primary)]',
    subtle: 'bg-[var(--bg-card-muted)] border-[var(--border-color)] text-[var(--text-primary)]',
    // Inverted dark card (#18181b or #27272a)
    dark: 'bg-[#18181b] border-[#3f3f46] text-white',
    glass: 'bg-[var(--bg-card)]/80 backdrop-blur-md border-[var(--border-color)] text-[var(--text-primary)]',
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
