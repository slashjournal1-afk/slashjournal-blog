import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function AdminRootPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/?auth=login');
  }

  if (user.role === 'ADMIN') {
    redirect('/dashboard/superadmin');
  }

  if (user.role === 'EDITOR' || user.role === 'AUTHOR') {
    redirect('/dashboard/creator');
  }

  redirect('/dashboard/member');
}
