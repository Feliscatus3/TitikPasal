import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getPublishedArticlesAdmin, getCategoriesAdmin } from '@/lib/firebase/firestore-admin';
import { ArticlesContent } from './ArticlesContent';

export const metadata: Metadata = {
  title: 'Kelola Artikel | Admin LEXORA',
  description: 'Kelola artikel berita, analisis, dan edukasi hukum',
};

export default async function ArticlesPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || (session.user.role !== 'admin' && session.user.role !== 'editor')) {
    redirect('/admin');
  }

  const [articlesResult, categories] = await Promise.all([
    getPublishedArticlesAdmin({ limit: 20, page: 1, sortBy: 'createdAt', sortOrder: 'desc' }),
    getCategoriesAdmin(true),
  ]);

  return (
    <ArticlesContent
      articles={articlesResult?.articles || []}
      categories={categories || []}
      hasMore={articlesResult?.hasMore || false}
      currentPage={1}
      userRole={session.user.role}
    />
  );
}