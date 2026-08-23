'use client';

type OAuthProvider = 'google' | 'github' | 'x';

const providers: Array<{ id: OAuthProvider; label: string }> = [
  { id: 'google', label: 'Google' },
  { id: 'github', label: 'GitHub' },
  { id: 'x', label: 'X' },
];

function ProviderIcon({ provider }: { provider: OAuthProvider }) {
  if (provider === 'github') {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
        <path d="M12 .7a11.3 11.3 0 0 0-3.58 22.02c.57.1.78-.25.78-.55v-2.16c-3.18.69-3.85-1.35-3.85-1.35-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.75 1.18 1.75 1.18 1.02 1.74 2.67 1.24 3.32.95.1-.74.4-1.24.73-1.53-2.54-.29-5.2-1.27-5.2-5.66 0-1.25.45-2.27 1.18-3.07-.12-.29-.51-1.45.11-3.02 0 0 .96-.31 3.12 1.17a10.8 10.8 0 0 1 5.68 0c2.16-1.48 3.12-1.17 3.12-1.17.62 1.57.23 2.73.11 3.02.73.8 1.18 1.82 1.18 3.07 0 4.4-2.67 5.36-5.21 5.65.41.35.78 1.04.78 2.1v3.11c0 .3.2.65.79.54A11.3 11.3 0 0 0 12 .7Z" />
      </svg>
    );
  }
  if (provider === 'x') {
    return <span className="font-sans text-base font-black leading-none" aria-hidden="true">X</span>;
  }

  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path fill="#4285F4" d="M21.35 12.23c0-.7-.06-1.37-.18-2.02H12v3.82h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.7 2.91-4.2 2.91-7.19Z" />
      <path fill="#34A853" d="M12 21.75c2.63 0 4.84-.87 6.45-2.33l-3.14-2.45c-.87.58-1.98.93-3.31.93-2.54 0-4.7-1.72-5.47-4.03H3.28v2.53A9.74 9.74 0 0 0 12 21.75Z" />
      <path fill="#FBBC05" d="M6.53 13.87a5.86 5.86 0 0 1 0-3.74V7.6H3.28a9.75 9.75 0 0 0 0 8.8l3.25-2.53Z" />
      <path fill="#EA4335" d="M12 6.1c1.43 0 2.72.49 3.73 1.46l2.8-2.8C16.83 3.22 14.63 2.25 12 2.25a9.74 9.74 0 0 0-8.72 5.36l3.25 2.53C7.3 7.83 9.46 6.1 12 6.1Z" />
    </svg>
  );
}

export function OAuthButtons() {
  const handleOAuth = (provider: OAuthProvider) => {
    window.location.assign(`/api/auth/oauth?provider=${provider}&next=${encodeURIComponent(window.location.pathname)}`);
  };

  return (
    <div className="space-y-2.5">
      <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--text-muted)]">
        <span className="h-px flex-1 bg-[var(--border-color)]" />
        <span>atau lanjutkan dengan</span>
        <span className="h-px flex-1 bg-[var(--border-color)]" />
      </div>
      <div className="grid grid-cols-3 gap-2">
        {providers.map((provider) => (
          <button
            key={provider.id}
            type="button"
            onClick={() => handleOAuth(provider.id)}
            className="flex min-h-11 items-center justify-center gap-2 rounded-btn border border-[var(--border-color)] bg-[var(--bg-card)] px-2 text-xs font-bold text-[var(--text-primary)] transition-colors hover:border-[var(--accent)] hover:bg-[var(--bg-card-muted)]"
          >
            <ProviderIcon provider={provider.id} />
            <span>{provider.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
