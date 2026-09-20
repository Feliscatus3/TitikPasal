import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { adminAuth } from '@/lib/firebase/admin';
import { BreakingNewsContent } from './BreakingNewsContent';

export const metadata: Metadata = {
  title: 'Breaking News | Admin LEXORA',
  description: 'Kelola breaking news berita hukum',
};

export default async function BreakingNewsPage() {
  if (!adminAuth) {
    redirect('/admin');
  }

  return <BreakingNewsContent userRole="admin" />;
}