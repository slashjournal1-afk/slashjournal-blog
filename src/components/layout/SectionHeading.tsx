import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function SectionHeading({ title, description, href, action }: { title: string; description?: string; href?: string; action?: string }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="border-b border-[var(--border-color)] pb-4 sm:flex-1 sm:border-b">
        <h2 className="font-display text-[22px] font-medium tracking-tight text-[var(--text-primary)] sm:text-2xl">{title}</h2>
        {description && <p className="mt-1.5 text-sm leading-relaxed text-[var(--text-muted)]">{description}</p>}
      </div>
      {href && action && (
        <Link
          href={href}
          className="inline-flex shrink-0 items-center gap-1 border-b border-[var(--border-color)] pb-4 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--text-primary)] transition-colors hover:text-[var(--accent)]"
        >
          {action}
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}