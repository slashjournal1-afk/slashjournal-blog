'use client';

export function CookieSettingsButton() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event('slashjournal:cookie-settings'))}
      className="text-left text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
    >
      Pengaturan cookie
    </button>
  );
}
