import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'outlined' | 'filled' | 'ember' | 'ai' | 'source' | 'status-published' | 'status-draft' | 'status-retracted' | 'status-scheduled';
  size?: 'sm' | 'md';
}

export function Badge({ className, variant = 'outlined', size = 'md', children, ...props }: BadgeProps) {
  const base = 'inline-flex items-center font-medium tracking-tight rounded-badge transition-colors select-none';

  const variants = {
    // 12px radius, 1px hairline border
    outlined: 'bg-transparent border border-cloud text-graphite hover:border-mist',
    filled: 'bg-iron text-[#fafafa]',
    ember: 'bg-ember text-white font-semibold',
    ai: 'bg-[var(--accent-soft)] border border-[var(--accent-line)] text-[var(--accent)] font-semibold',
    source: 'bg-paper border border-cloud text-steel text-[11px]',
    'status-published': 'bg-emerald-500/10 text-emerald-700 border border-emerald-500/20',
    'status-draft': 'bg-amber-500/10 text-amber-700 border border-amber-500/20',
    'status-retracted': 'bg-rose-500/10 text-rose-700 border border-rose-500/20',
    'status-scheduled': 'bg-blue-500/10 text-blue-700 border border-blue-500/20',
  };

  const sizes = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-[12px] px-2.5 py-1 gap-1.5',
  };

  return (
    <span className={cn(base, variants[variant], sizes[size], className)} {...props}>
      {children}
    </span>
  );
}
