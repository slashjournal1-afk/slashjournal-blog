import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import AnalyticsDashboard from './AnalyticsDashboard';

export const dynamic = 'force-dynamic';

export default async function SuperAdminAnalyticsPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') redirect('/dashboard');
  return <AnalyticsDashboard />;
}
