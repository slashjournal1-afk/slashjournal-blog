import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function DashboardRootPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/?auth=login');
  }

  // Smart Role Gateway
  if (user.role === 'ADMIN') {
    redirect('/dashboard/superadmin');
  } else if (user.role === 'EDITOR' || user.role === 'AUTHOR') {
    redirect('/dashboard/creator');
  } else {
    redirect('/dashboard/member');
  }
}
