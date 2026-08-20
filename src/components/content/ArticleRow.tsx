import Image from 'next/image';
import Link from 'next/link';
import { ArticleMeta } from './ArticleMeta';

export function ArticleRow({
  href,
  title,
  excerpt,
  category,
  date,
  readingTime,
  imageUrl,
  sponsored,
  sponsorName,
}: {
  href: string;
  title: string;
  excerpt?: string | null;
  category?: string | null;
  date: string;
  readingTime?: number | null;
  imageUrl?: string | null;
  sponsored?: boolean;
  sponsorName?: string | null;
}) {
  return (
    <Link
      href={href}
      className="group grid grid-cols-[88px_1fr] gap-4 border-b border-[var(--border-color)] py-6 transition-colors first:border-t sm:grid-cols-[168px_1fr] sm:gap-6"
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-[var(--bg-card-muted)] sm:rounded-xl">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="(min-width: 640px) 168px, 88px"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full items-center justify-center font-display text-xl text-[var(--color-silver)]" aria-hidden="true">
            //
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-col justify-center">
        <ArticleMeta
          category={sponsored ? `Sponsor · ${sponsorName || 'Advertorial'}` : category || undefined}
          date={date}
          readingTime={readingTime ?? undefined}
        />
        <h3 className="mt-2 font-display text-lg font-medium leading-snug tracking-tight text-[var(--text-primary)] transition-colors group-hover:text-[var(--accent-hover)] sm:text-[21px]">
          {title}
        </h3>
        {excerpt && (
          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-[var(--text-muted)]">
            {excerpt}
          </p>
        )}
      </div>
    </Link>
  );
}