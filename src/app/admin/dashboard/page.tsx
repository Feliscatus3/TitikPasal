import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getDashboardStatsAdmin } from '@/lib/firebase/firestore-admin';
import { DashboardContent } from './DashboardContent';
import { DashboardSkeleton } from './DashboardSkeleton';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Dashboard Admin LEXORA',
};

export default async function DashboardPage() {
  const stats = await getDashboardStatsAdmin();

  if (!stats) {
    redirect('/admin');
  }

  return <DashboardContent stats={stats} />;
}