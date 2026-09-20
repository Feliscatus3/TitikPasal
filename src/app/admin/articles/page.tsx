import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getPublishedArticlesAdmin, getCategoriesAdmin } from '@/lib/firebase/firestore-admin';
import { adminAuth } from '@/lib/firebase/admin';
import { ArticlesContent } from './ArticlesContent';

export const metadata: Metadata = {
  title: 'Kelola Artikel | Admin LEXORA',
  description: 'Kelola artikel berita, analisis, dan edukasi hukum',
};

export default async function ArticlesPage() {
  // Check admin auth via cookie/session
  // For now, we'll check if adminAuth is available
  // In production, you'd verify the session cookie
  if (!adminAuth) {
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
      userRole="admin"
    />
  );
}