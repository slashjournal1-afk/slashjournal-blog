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
    outlined: 'bg-transparent border border-[var(--border-color)] text-[var(--text-secondary)] hover:border-[var(--text-muted)]',
    filled: 'bg-[var(--text-secondary)] text-[var(--bg-primary)]',
    ember: 'bg-[var(--accent)] text-[var(--accent-foreground)] font-semibold',
    ai: 'bg-[var(--accent-soft)] border border-[var(--accent-line)] text-[var(--accent)] font-semibold',
    source: 'bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-secondary)] text-[11px]',
    'status-published': 'bg-[var(--success-soft)] text-[var(--success)] border border-[var(--success)]/30',
    'status-draft': 'bg-[var(--warning-soft)] text-[var(--warning)] border border-[var(--warning)]/30',
    'status-retracted': 'bg-[var(--danger-soft)] text-[var(--danger)] border border-[var(--danger)]/30',
    'status-scheduled': 'bg-[var(--accent-soft)] text-[var(--accent)] border border-[var(--accent)]/30',
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
