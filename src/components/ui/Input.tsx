import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', error, ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          type={type}
          ref={ref}
          className={cn(
            'w-full rounded-input border border-[var(--border-color)] bg-[var(--bg-card)] px-4 py-2.5 text-[14px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none transition-all focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] disabled:bg-[var(--bg-card-muted)] disabled:text-[var(--text-muted)]',
            error && 'border-[var(--danger)] focus:border-[var(--danger)] focus:ring-[var(--danger)]',
            className
          )}
          {...props}
        />
        {error && <p className="mt-1 text-[12px] text-[var(--danger)]">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, rows = 4, ...props }, ref) => {
    return (
      <div className="w-full">
        <textarea
          ref={ref}
          rows={rows}
          className={cn(
            'w-full rounded-input border border-[var(--border-color)] bg-[var(--bg-card)] px-4 py-2.5 text-[14px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none transition-all focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] disabled:bg-[var(--bg-card-muted)] disabled:text-[var(--text-muted)]',
            error && 'border-[var(--danger)] focus:border-[var(--danger)] focus:ring-[var(--danger)]',
            className
          )}
          {...props}
        />
        {error && <p className="mt-1 text-[12px] text-[var(--danger)]">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
