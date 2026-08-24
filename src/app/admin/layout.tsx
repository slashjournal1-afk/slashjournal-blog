import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import {
  FileText,
  Plus,
  Inbox,
  Activity,
  Shield,
  PenTool,
} from 'lucide-react';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';

export const metadata = {
  title: 'Editorial CMS Workspace — SlashJournal',
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  if (!user || user.role === 'READER') {
    redirect('/');
  }

  const navItems = [
    { label: 'Overview Superadmin', href: '/dashboard/superadmin', icon: Shield, roles: ['ADMIN'] },
    { label: 'Studio Penulis', href: '/dashboard/creator', icon: PenTool, roles: ['ADMIN', 'EDITOR', 'AUTHOR'] },
    { label: 'Tulis Dokumen Baru', href: '/admin/docs/new', icon: Plus, roles: ['ADMIN', 'EDITOR', 'AUTHOR'] },
    { label: 'Antrean Review Draf', href: '/admin/review-queue', icon: Inbox, roles: ['ADMIN', 'EDITOR'] },
    { label: 'Telemetri Pencarian', href: '/admin/telemetry', icon: Activity, roles: ['ADMIN', 'EDITOR'] },
    { label: 'Log Audit & Revisi', href: '/admin/audit-logs', icon: FileText, roles: ['ADMIN'] },
  ];

  const allowedNav = navItems
    .filter((item) => item.roles.includes(user.role))
    .map(({ label, href, icon }) => ({ label, href, icon }));

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col md:flex-row">
      <DashboardSidebar
        navItems={allowedNav}
        sectionLabel="Menu Navigasi"
        user={{ displayName: user.displayName, email: user.email }}
        roleBadge={{ label: user.role, bg: 'bg-[var(--accent-soft)]', text: 'text-[var(--accent)]' }}
      />

      {/* Main Admin Area - Expansive width on desktop */}
      <main className="flex-1 min-w-0 p-6 md:p-8 xl:p-10 overflow-y-auto w-full max-w-[1720px] mx-auto">
        {children}
      </main>
    </div>
  );
}
