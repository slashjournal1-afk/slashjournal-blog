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
            'w-full rounded-input border border-cloud bg-snow px-4 py-2.5 text-[14px] text-graphite placeholder:text-ash outline-none transition-all focus:border-obsidian focus:ring-1 focus:ring-obsidian disabled:bg-paper disabled:text-ash',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
            className
          )}
          {...props}
        />
        {error && <p className="mt-1 text-[12px] text-red-600">{error}</p>}
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
            'w-full rounded-input border border-cloud bg-snow px-4 py-2.5 text-[14px] text-graphite placeholder:text-ash outline-none transition-all focus:border-obsidian focus:ring-1 focus:ring-obsidian disabled:bg-paper disabled:text-ash',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
            className
          )}
          {...props}
        />
        {error && <p className="mt-1 text-[12px] text-red-600">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
