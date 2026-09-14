'use client';

import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowUpDown, ArrowDownUp } from 'lucide-react';
import { Header } from '@/components/public/Header';
import { Footer } from '@/components/public/Footer';
import { CategoryNav } from '@/components/public/CategoryNav';
import { ArticleCard } from '@/components/public/ArticleCard';
import { MostRead } from '@/components/public/MostRead';
import { EditorsPick } from '@/components/public/EditorsPick';
import { Newsletter } from '@/components/public/Newsletter';
import { ArticleGridSkeleton, CategoryGridSkeleton } from '@/components/ui/Skeleton';
import { EmptyArticlesState } from '@/components/ui/EmptyState';
import { cn, formatRelativeTime } from '@/lib/utils';
import type { Article, Category } from '@/types';

interface CategoryPageProps {
  category: Category;
  articles: Article[];
  currentPage: number;
  hasMore: boolean;
  totalPages: number;
  sortBy: 'publishedAt' | 'views';
  categories: Category[];
}

export function CategoryPage({ category, articles, currentPage, hasMore, totalPages, sortBy, categories }: CategoryPageProps) {
  const basePath = `/kategori/${category.slug}`;

  const sortOptions = [
    { value: 'publishedAt', label: 'Terbaru' },
    { value: 'views', label: 'Paling Dibaca' },
  ];

  return (
    <>
      <Header />

      <main id="main-content" className="flex-1 pt-16">
        <header className="container-main py-12 bg-gradient-to-b from-primary-900/10 to-transparent">
          <nav className="mb-4" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-sm text-lexora-text-muted flex-wrap">
              <li className="flex items-center gap-2">
                <Link href="/" className="hover:text-lexora-text transition-colors">Beranda</Link>
                <ChevronLeft className="w-4 h-4 flex-shrink-0" />
              </li>
              <li className="flex items-center gap-2">
                <Link href="/berita" className="hover:text-lexora-text transition-colors">Berita</Link>
                <ChevronLeft className="w-4 h-4 flex-shrink-0" />
              </li>
              <li className="flex items-center gap-2">
                <span className="text-lexora-text font-medium" aria-current="page">{category.name}</span>
              </li>
            </ol>
          </nav>
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-lexora-text leading-tight mb-4">
              {category.name}
            </h1>
            {category.description && (
              <p className="text-lg text-lexora-text-muted leading-relaxed">
                {category.description}
              </p>
            )}
          </div>
        </header>

        <section className="py-8 bg-lexora-surface/50" aria-labelledby="categories-nav-heading">
          <div className="container-main">
            <CategoryNav categories={categories} variant="pills" maxItems={15} />
          </div>
        </section>

        <section className="py-8" aria-labelledby="articles-heading">
          <div className="container-main">
            <header className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 id="articles-heading" className="section-title">Artikel {category.name}</h2>
              <div className="flex items-center gap-3">
                <label htmlFor="sort-select" className="text-sm text-lexora-text-muted">Urutkan:</label>
                <select
                  id="sort-select"
                  value={sortBy}
                  onChange={(e) => window.location.href = `${basePath}?sort=${e.target.value}`}
                  className="input-field w-auto"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </header>

            {articles.length > 0 ? (
              <>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" role="list">
                  {articles.map((article, index) => (
                    <ArticleCard
                      key={article.id}
                      article={article}
                      variant="default"
                      showCategory={false}
                      showAuthor
                      showDate
                      showReadingTime
                      priority={index < 3}
                    />
                  ))}
                </div>

                {(hasMore || currentPage > 1) && (
                  <nav className="mt-10 flex items-center justify-center gap-2" aria-label="Pagination">
                    {currentPage > 1 && (
                      <Link
                        href={`${basePath}?page=${currentPage - 1}${sortBy !== 'publishedAt' ? `&sort=${sortBy}` : ''}`}
                        className="btn-secondary"
                        aria-label="Halaman sebelumnya"
                      >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Sebelumnya
                      </Link>
                    )}
                    <div className="flex items-center gap-1" role="group" aria-label="Nomor halaman">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum: number;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        return (
                          <Link
                            key={pageNum}
                            href={`${basePath}?page=${pageNum}${sortBy !== 'publishedAt' ? `&sort=${sortBy}` : ''}`}
                            className={cn(
                              'w-10 h-10 flex items-center justify-center rounded-lg font-medium transition-colors',
                              pageNum === currentPage
                                ? 'bg-primary-600 text-white'
                                : 'text-lexora-text hover:bg-lexora-surface-hover'
                            )}
                            aria-label={`Halaman ${pageNum}`}
                            aria-current={pageNum === currentPage ? 'page' : undefined}
                          >
                            {pageNum}
                          </Link>
                        );
                      })}
                    </div>
                    {hasMore && (
                      <Link
                        href={`${basePath}?page=${currentPage + 1}${sortBy !== 'publishedAt' ? `&sort=${sortBy}` : ''}`}
                        className="btn-secondary"
                        aria-label="Halaman selanjutnya"
                      >
                        Selanjutnya
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Link>
                    )}
                  </nav>
                )}
              </>
            ) : (
              <EmptyArticlesState categoryName={category.name} />
            )}
          </div>
        </section>

        <MostRead
          articles={articles}
          title="Paling Dibaca di Kategori Ini"
          limit={5}
        />

        <EditorsPick
          articles={articles.slice(0, 6)}
          title="Pilihan Editor"
          layout="carousel"
          columns={3}
        />

        <Newsletter />
      </main>

      <Footer />
    </>
  );
}