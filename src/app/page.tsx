import { Metadata } from 'next';
import { Header } from '@/components/public/Header';
import { Footer } from '@/components/public/Footer';
import { BreakingNewsTicker } from '@/components/public/BreakingNewsTicker';
import { HeroSection } from '@/components/public/HeroSection';
import { LatestNews } from '@/components/public/LatestNews';
import { CategoryNav } from '@/components/public/CategoryNav';
import { AnalysisSection } from '@/components/public/AnalysisSection';
import { OpinionSection } from '@/components/public/OpinionSection';
import { EducationSection } from '@/components/public/EducationSection';
import { MostRead } from '@/components/public/MostRead';
import { EditorsPick } from '@/components/public/EditorsPick';
import { Newsletter } from '@/components/public/Newsletter';
import { ArticleGridSkeleton, CategoryGridSkeleton, LatestNewsSkeleton, HeroSkeleton } from '@/components/ui/Skeleton';
import { getPublishedArticles, getCategories, getBreakingNews, getLatestNews, getSiteSettings } from '@/lib/firebase/firestore';

export const metadata: Metadata = {
  title: 'Berita, Analisis & Edukasi Hukum',
  description: 'Portal berita dan edukasi hukum terpercaya. Berita, analisis, opini, dan edukasi hukum terkini dari Indonesia dan dunia.',
};

interface HomePageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  
  const [
    featuredResult,
    latestResult,
    categoriesResult,
    breakingNewsResult,
    latestNewsResult,
    analysisResult,
    opinionResult,
    educationResult,
    mostReadResult,
    editorsPickResult,
    siteSettingsResult,
  ] = await Promise.all([
    getPublishedArticles({ limit: 1, sortBy: 'publishedAt', sortOrder: 'desc' }),
    getPublishedArticles({ limit: 6, sortBy: 'publishedAt', sortOrder: 'desc' }),
    getCategories(true),
    getBreakingNews(),
    getLatestNews(10),
    getPublishedArticles({ limit: 6, categoryId: 'analisis', sortBy: 'publishedAt', sortOrder: 'desc' }),
    getPublishedArticles({ limit: 6, categoryId: 'opini', sortBy: 'publishedAt', sortOrder: 'desc' }),
    getPublishedArticles({ limit: 6, categoryId: 'edukasi', sortBy: 'publishedAt', sortOrder: 'desc' }),
    getPublishedArticles({ limit: 5, sortBy: 'views', sortOrder: 'desc' }),
    getPublishedArticles({ limit: 6, sortBy: 'publishedAt', sortOrder: 'desc' }),
    getSiteSettings(),
  ]);

  const featuredArticle = featuredResult.articles[0] || null;
  const secondaryArticles = latestResult.articles.slice(1, 5);
  const latestArticles = latestResult.articles;
  const categories = categoriesResult;
  const breakingNews = breakingNewsResult;
  const latestNews = latestNewsResult;
  const analysisArticles = analysisResult.articles;
  const opinionArticles = opinionResult.articles;
  const educationArticles = educationResult.articles;
  const mostReadArticles = mostReadResult.articles;
  const editorsPickArticles = editorsPickResult.articles;

  return (
    <>
      <Header />
      
      {breakingNews.length > 0 && (
        <BreakingNewsTicker items={breakingNews} />
      )}

      <main id="main-content" className="flex-1 pt-16">
        <HeroSection
          featuredArticle={featuredArticle}
          secondaryArticles={secondaryArticles}
          title="Berita Utama"
        />

        {latestArticles.length > 0 && (
          <LatestNews
            items={latestArticles.map((a, i) => ({
              id: a.id,
              title: a.title,
              url: `/artikel/${a.slug}`,
              categoryId: a.categoryId,
              categoryName: a.categoryName,
              time: new Date(a.publishedAt || a.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
              status: 'active' as const,
              order: i,
              createdAt: a.createdAt,
              updatedAt: a.updatedAt,
            }))}
            title="Berita Terbaru"
            limit={6}
            variant="list"
          />
        )}

        {categories.length > 0 && (
          <section className="py-8 bg-lexora-surface/50" aria-labelledby="categories-heading">
            <div className="container-main">
              <header className="mb-6">
                <h2 id="categories-heading" className="section-title">Kategori Hukum</h2>
                <p className="section-subtitle">Jelajahi berita hukum berdasarkan kategori</p>
              </header>
              <CategoryNav categories={categories} variant="grid" maxItems={12} />
            </div>
          </section>
        )}

        {analysisArticles.length > 0 && (
          <AnalysisSection
            articles={analysisArticles}
            title="Analisis Hukum"
            subtitle="Analisis mendalam terhadap isu-isu hukum terkini"
            layout="grid"
            columns={3}
          />
        )}

        {opinionArticles.length > 0 && (
          <OpinionSection
            articles={opinionArticles}
            title="Opini"
            subtitle="Perspektif dan pandangan para ahli hukum"
            layout="grid"
            columns={3}
          />
        )}

        {educationArticles.length > 0 && (
          <EducationSection
            articles={educationArticles}
            title="Edukasi Hukum"
            subtitle="Pahami hukum dengan bahasa yang mudah dipahami"
            layout="cards"
            columns={3}
          />
        )}

        {mostReadArticles.length > 0 && (
          <MostRead
            articles={mostReadArticles}
            title="Paling Dibaca"
            subtitle="Artikel paling populer minggu ini"
            limit={5}
          />
        )}

        {editorsPickArticles.length > 0 && (
          <EditorsPick
            articles={editorsPickArticles}
            title="Pilihan Editor"
            subtitle="Artikel terpilih oleh tim editorial kami"
            layout="carousel"
            columns={3}
          />
        )}

        <Newsletter
          title="Jangan Lewatkan Berita Hukum Terkini"
          description="Dapatkan berita hukum, analisis mendalam, dan edukasi hukum langsung di kotak masuk Anda setiap minggu."
        />
      </main>

      <Footer />
    </>
  );
}