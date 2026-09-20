import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getCategoriesAdmin } from '@/lib/firebase/firestore-admin';
import { CategoriesContent } from './CategoriesContent';

export const metadata: Metadata = {
  title: 'Kelola Kategori | Admin LEXORA',
  description: 'Kelola kategori berita dan hukum',
};

export default async function CategoriesPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || (session.user.role !== 'admin' && session.user.role !== 'editor')) {
    redirect('/admin');
  }

  const categories = await getCategoriesAdmin(true);

  return <CategoriesContent categories={categories || []} userRole={session.user.role} />;
}