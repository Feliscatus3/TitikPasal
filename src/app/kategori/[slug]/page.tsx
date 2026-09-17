import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPublishedArticles, getCategories, getCategoryBySlug } from '@/lib/firebase/firestore';
import { getCategoryBySlugAdmin, getCategoriesAdmin } from '@/lib/firebase/firestore-admin';
import { CategoryPage } from './CategoryPage';
import { CategorySkeleton } from './CategorySkeleton';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string; sort?: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlugAdmin(slug);
  
  if (!category) {
    return {
      title: 'Kategori Tidak Ditemukan',
    };
  }

  return {
    title: category.seoTitle || category.name,
    description: category.seoDescription || category.description || `Artikel kategori ${category.name} di LEXORA`,
    openGraph: {
      type: 'website',
      title: category.seoTitle || category.name,
      description: category.seoDescription || category.description || `Artikel kategori ${category.name} di LEXORA`,
    },
  };
}

export async function generateStaticParams() {
  const categories = await getCategoriesAdmin(true);
  if (!categories) return [];
  return categories.map((category) => ({
    slug: category.slug,
  }));
}

export default async function CategoryPageWrapper({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const { page = '1', sort = 'latest' } = await searchParams;
  const pageNum = parseInt(page, 10) || 1;
  const sortBy = sort === 'popular' ? 'views' : 'publishedAt';

  const [category, articlesResult, allCategories] = await Promise.all([
    getCategoryBySlug(slug),
    getPublishedArticles({
      categoryId: '',
      limit: 12,
      page: pageNum,
      sortBy,
      sortOrder: 'desc',
    }),
    getCategories(true),
  ]);

  if (!category) {
    notFound();
  }

  // Filter articles by category
  const articles = articlesResult.articles.filter((a: { categoryId: string }) => a.categoryId === category.id);

  return (
    <CategoryPage
      category={category}
      articles={articles}
      currentPage={pageNum}
      hasMore={articlesResult.hasMore}
      totalPages={Math.ceil(articlesResult.total / 12)}
      sortBy={sortBy}
      categories={allCategories}
    />
  );
}