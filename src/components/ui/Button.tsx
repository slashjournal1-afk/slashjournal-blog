import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'pill' | 'ember' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-150 active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none cursor-pointer select-none';

    const variants = {
      // Primary Action: #09090b filled, white text, 14px radius, subtle hairline & inset highlight
      primary:
        'bg-[var(--text-primary)] text-[var(--bg-primary)] border border-[var(--text-primary)] hover:bg-[var(--text-secondary)] rounded-btn',
      // Secondary: light canvas button with 1px border
      secondary:
        'bg-[var(--bg-card)] text-[var(--text-primary)] border border-[var(--border-color)] hover:bg-[var(--bg-card-muted)] rounded-btn',
      // Ghost: transparent button
      ghost:
        'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-muted)] rounded-btn',
      // Pill: 10000px radius for nav & prominent links
      pill:
        'bg-[var(--text-primary)] text-[var(--bg-primary)] rounded-pill hover:bg-[var(--text-secondary)] px-5 py-2 border border-[var(--border-color)]',
      // Ember Accent: Confetti-orange
      ember:
        'bg-[var(--accent)] text-[var(--accent-foreground)] rounded-btn hover:bg-[var(--accent-hover)]',
      // Danger:
      danger:
        'bg-[var(--danger)] text-[var(--bg-primary)] hover:brightness-110 rounded-btn',
    };

    const sizes = {
      sm: 'text-[13px] px-3 py-1.5 gap-1.5',
      md: 'text-[14px] px-4 py-2.5 gap-2',
      lg: 'text-[15px] px-6 py-3 gap-2.5',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
