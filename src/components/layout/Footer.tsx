import Link from 'next/link';
import { CookieSettingsButton } from '@/components/analytics/CookieSettingsButton';
import { BrandLogo } from '@/components/layout/BrandLogo';
import { siteConfig } from '@/lib/site';

const readingLinks = [
  { label: 'Tulisan', href: '/' },
  { label: 'Seri', href: '/series' },
  { label: 'Glosarium', href: '/glossary' },
  { label: 'Tentang', href: '/about' },
];

const supportLinks = [
  { label: 'Kontak', href: '/contact' },
  { label: 'Daftar menjadi penulis', href: '/contact?subject=author' },
  { label: 'Privasi', href: '/privacy-policy' },
  { label: 'Ketentuan', href: '/terms' },
  { label: 'Cookie', href: '/cookie-policy' },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-[var(--border-color)] bg-[var(--bg-primary)]">
      <div className="mx-auto max-w-editorial px-5 py-16 sm:px-8">
        <div className="grid gap-12 md:grid-cols-[minmax(0,1.6fr)_1fr_1fr]">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 font-display text-xl font-semibold tracking-tight text-[var(--text-primary)]"
            >
              <BrandLogo size={30} />
              <span>SlashJournal</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-[var(--text-muted)]">
              Catatan produksi tentang sistem terdistribusi, rekayasa antarmuka, dan keputusan teknis yang layak dipahami.
            </p>
            <p className="mt-4 text-sm text-[var(--text-muted)]">
              <a href={`mailto:${siteConfig.contactEmail}`} className="font-medium hover:text-[var(--text-primary)] transition-colors">
                {siteConfig.contactEmail}
              </a>
              <span aria-hidden="true"> · </span>
              <span>{siteConfig.operatorLocation}</span>
            </p>
            <p className="mt-3 text-sm text-[var(--text-muted)]">
              Ditulis oleh{' '}
              <Link href="/about#author" rel="author" className="font-semibold text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors">
                {siteConfig.authorName}
              </Link>
              .
            </p>
            {/* Tautan eksplisit identitas penulis — rel="me" untuk verifikasi Knowledge Graph */}
            <nav aria-label="Profil sosial Choirul Humam" className="mt-5 flex flex-wrap gap-2">
              {siteConfig.authorSocials.map((social) => (
                <a
                  key={social.href}
                  href={social.href}
                  rel="me noopener"
                  target="_blank"
                  className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-color)] px-3 py-1.5 text-xs font-medium text-[var(--text-muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--text-primary)]"
                >
                  {social.label}
                  <span aria-hidden="true" className="text-[var(--color-silver)]">·</span>
                  <span>{social.handle}</span>
                </a>
              ))}
            </nav>
          </div>
          <FooterColumn title="Baca" links={readingLinks} />
          <div>
            <FooterColumn title="Dukungan & legal" links={supportLinks} />
            <div className="mt-2.5"><CookieSettingsButton /></div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-[var(--border-color)] pt-6 text-xs text-[var(--text-muted)] sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} SlashJournal</span>
          <Link href="/feed.xml" className="hover:text-[var(--text-primary)] transition-colors">
            RSS feed
          </Link>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h2 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--text-primary)]">{title}</h2>
      <nav className="mt-4 space-y-2.5" aria-label={title}>
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="block text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
