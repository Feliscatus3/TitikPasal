import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { BreakingNewsContent } from './BreakingNewsContent';

export const metadata: Metadata = {
  title: 'Breaking News | Admin LEXORA',
  description: 'Kelola breaking news berita hukum',
};

export default async function BreakingNewsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || (session.user.role !== 'admin' && session.user.role !== 'editor')) {
    redirect('/admin');
  }

  return <BreakingNewsContent userRole={session.user.role} />;
}