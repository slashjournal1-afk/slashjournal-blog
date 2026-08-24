import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import {
  LayoutDashboard,
  FileText,
  Plus,
  Inbox,
  Activity,
  Shield,
  Bookmark,
  User,
  PenTool,
} from 'lucide-react';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';

export const metadata = {
  title: 'Dashboard Workspace — SlashJournal',
  robots: { index: false, follow: false },
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/?auth=login');
  }

  const role = user.role; // 'ADMIN', 'EDITOR', 'AUTHOR', 'READER'

  // Dynamic Navigation Items based on Role
  const superAdminNav = [
    { label: 'Overview Superadmin', href: '/dashboard/superadmin', icon: Shield },
    { label: 'Antrean Review Draf', href: '/admin/review-queue', icon: Inbox },
    { label: 'Telemetri & Kata Kunci', href: '/admin/telemetry', icon: Activity },
    { label: 'Google Analytics & AdSense', href: '/dashboard/superadmin/analytics', icon: Activity },
    { label: 'Log Audit & Keamanan', href: '/admin/audit-logs', icon: FileText },
  ];

  const creatorNav = [
    { label: 'Studio Penulis', href: '/dashboard/creator', icon: PenTool },
    { label: 'Pendapatan Artikel', href: '/dashboard/creator/revenue', icon: Activity },
    { label: 'Tulis Dokumen Baru', href: '/admin/docs/new', icon: Plus },
    ...(role === 'EDITOR' || role === 'ADMIN'
      ? [{ label: 'Antrean Review Redaksi', href: '/admin/review-queue', icon: Inbox }]
      : []),
    { label: 'Ruang Anggota (Member)', href: '/dashboard/member', icon: User },
  ];

  const memberNav = [
    { label: 'Ikhtisar Anggota', href: '/dashboard/member', icon: LayoutDashboard },
    { label: 'Pustaka Bookmark', href: '/bookmarks', icon: Bookmark },
  ];

  const activeNav =
    role === 'ADMIN'
      ? superAdminNav
      : role === 'EDITOR' || role === 'AUTHOR'
      ? creatorNav
      : memberNav;

  const roleLabels: Record<string, { label: string; bg: string; text: string }> = {
    ADMIN: { label: 'SUPERADMIN', bg: 'bg-rose-500/15', text: 'text-rose-500' },
    EDITOR: { label: 'EDITOR REDAKSI', bg: 'bg-purple-500/15', text: 'text-purple-500' },
    AUTHOR: { label: 'PENULIS / CREATOR', bg: 'bg-[var(--accent-soft)]', text: 'text-[var(--accent)]' },
    READER: { label: 'ANGGOTA / MEMBER', bg: 'bg-emerald-500/15', text: 'text-emerald-500' },
  };

  const currentRoleBadge = roleLabels[role] || roleLabels.READER;

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col md:flex-row">
      <DashboardSidebar
        navItems={activeNav}
        sectionLabel={
          role === 'ADMIN'
            ? 'System Control'
            : role === 'AUTHOR' || role === 'EDITOR'
            ? 'Creator Studio'
            : 'Workspace Anggota'
        }
        user={{ displayName: user.displayName, email: user.email }}
        roleBadge={currentRoleBadge}
      />

      {/* Main Content Viewport - Expansive width on desktop */}
      <main className="flex-1 min-w-0 p-6 md:p-8 xl:p-10 overflow-y-auto w-full max-w-[1720px] mx-auto">
        {children}
      </main>
    </div>
  );
}
