import React from 'react';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { formatDate } from '@/lib/utils';
import { Settings, ShieldCheck } from 'lucide-react';
import { ProfileSettingsForm } from '@/components/dashboard/ProfileSettingsForm';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Pengaturan Profil — SlashJournal',
  robots: { index: false, follow: false },
};

export default async function SettingsPage() {
  const session = await getCurrentUser();
  if (!session) {
    redirect('/?auth=login');
  }

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    select: {
      displayName: true,
      name: true,
      email: true,
      avatarUrl: true,
      role: true,
      provider: true,
      createdAt: true,
    },
  });
  if (!user) {
    redirect('/?auth=login');
  }

  return (
    <div className="space-y-10">
      {/* Settings Header */}
      <div className="pb-6 border-b border-[var(--border-color)]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-[8px] bg-[var(--accent-soft)] text-[var(--accent)] font-mono text-[10.5px] font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Settings className="w-3 h-3" />
              Pengaturan Akun
            </span>
          </div>
          <h1 className="text-[26px] md:text-[30px] font-extrabold text-[var(--text-primary)] tracking-tight">
            Pengaturan Profil
          </h1>
          <p className="text-[13.5px] text-[var(--text-muted)]">
            Kelola nama tampilan, foto profil, dan kata sandi akun Anda.
          </p>
        </div>
      </div>

      {/* Read-only Account Info */}
      <div className="rounded-[28px] border border-[var(--border-color)] bg-[var(--bg-card)] p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border-color)]">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Informasi Akun</span>
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-[10.5px] text-[var(--text-muted)] block">Email Terdaftar</span>
            <span className="font-mono text-[var(--text-primary)] break-all">{user.email}</span>
          </div>
          <div>
            <span className="text-[10.5px] text-[var(--text-muted)] block">Peran Sistem</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono font-bold text-[10px]">
              {user.role}
            </span>
          </div>
          <div>
            <span className="text-[10.5px] text-[var(--text-muted)] block">Metode Masuk</span>
            <span className="font-bold text-[var(--text-primary)]">{user.provider === 'LOCAL' ? 'Email & Kata Sandi' : user.provider}</span>
          </div>
          <div>
            <span className="text-[10.5px] text-[var(--text-muted)] block">Anggota Sejak</span>
            <span className="font-bold text-[var(--text-primary)]">{formatDate(user.createdAt)}</span>
          </div>
        </div>
        <p className="text-[10.5px] text-[var(--text-muted)]">
          Alamat email tidak dapat diubah. Hubungi redaksi jika Anda perlu mengganti email terdaftar.
        </p>
      </div>

      <ProfileSettingsForm
        initialDisplayName={user.displayName}
        initialName={user.name}
        initialAvatarUrl={user.avatarUrl}
        isLocalAccount={user.provider === 'LOCAL'}
      />
    </div>
  );
}
