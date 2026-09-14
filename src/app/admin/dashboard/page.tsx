import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getDashboardStats } from '@/lib/firebase/firestore';
import { DashboardContent } from './DashboardContent';
import { DashboardSkeleton } from './DashboardSkeleton';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Dashboard Admin LEXORA',
};

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  return <DashboardContent stats={stats} />;
}