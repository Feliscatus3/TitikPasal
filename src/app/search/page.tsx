'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, X, Loader2, FileText, Tag, User, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { Header } from '@/components/public/Header';
import { Footer } from '@/components/public/Footer';
import { ArticleCard } from '@/components/public/ArticleCard';
import { ArticleGridSkeleton } from '@/components/ui/Skeleton';
import { EmptySearchState } from '@/components/ui/EmptyState';
import { cn, formatRelativeTime } from '@/lib/utils';
import type { Article } from '@/types';

interface SearchResult {
  articles: Article[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const performSearch = useCallback(async (searchQuery: string, page: number = 1) => {
    if (searchQuery.length < 2) {
      setResults({ articles: [], total: 0, page: 1, limit: 12, hasMore: false });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        q: searchQuery,
        page: page.toString(),
        limit: '12',
      });

      const response = await fetch(`/api/search?${params.toString()}`);
      const data = await response.json();

      if (response.ok) {
        setResults(data);
      } else {
        setError(data.error || 'Gagal mencari');
        setResults({ articles: [], total: 0, page: 1, limit: 12, hasMore: false });
      }
    } catch {
      setError('Terjadi kesalahan. Silakan coba lagi.');
      setResults({ articles: [], total: 0, page: 1, limit: 12, hasMore: false });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery, 1);
    }
  }, [initialQuery, performSearch]);

  const handleSearch = (newQuery: string) => {
    setQuery(newQuery);
    setCurrentPage(1);
    const params = new URLSearchParams(searchParams.toString());
    if (newQuery) {
      params.set('q', newQuery);
    } else {
      params.delete('q');
    }
    params.delete('page');
    router.push(`/search?${params.toString()}`, { scroll: false });
    performSearch(newQuery, 1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.push(`/search?${params.toString()}`, { scroll: false });
    performSearch(query, page);
  };

  return (
    <>
      <Header />

      <main id="main-content" className="flex-1 pt-16">
        <header className="container-main py-12 bg-gradient-to-b from-primary-900/10 to-transparent">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-lexora-text mb-4">Pencarian</h1>
            <p className="text-lg text-lexora-text-muted mb-8">Temukan berita, analisis, dan edukasi hukum yang Anda butuhkan</p>

            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-lexora-text-muted" aria-hidden="true" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch(e.target.value)}
                placeholder="Cari berita, hukum, regulasi, analisis..."
                className="w-full pl-12 pr-16 py-4 bg-white dark:bg-lexora-surface border border-lexora-border rounded-xl text-lg text-lexora-text placeholder-lexora-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                autoFocus
                aria-label="Cari artikel"
              />
              {query && (
                <button
                  onClick={() => handleSearch('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-lg text-lexora-text-muted hover:text-lexora-text hover:bg-lexora-surface transition-colors"
                  aria-label="Hapus pencarian"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </header>

        <section className="py-8" aria-labelledby="search-results-heading">
          <div className="container-main">
            {query && (
              <div className="mb-6 text-sm text-lexora-text-muted">
                {results !== null && (
                  <>
                    Menampilkan <strong>{results.articles.length}</strong> dari <strong>{results.total}</strong> hasil untuk <strong>&ldquo;{query}&rdquo;</strong>
                  </>
                )}
              </div>
            )}

            {loading ? (
              <ArticleGridSkeleton count={6} />
            ) : error ? (
              <div className="text-center py-12" role="alert">
                <div className="w-16 h-16 text-red-500 mx-auto mb-4">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <p className="text-lexora-text mb-4">{error}</p>
                <button
                  onClick={() => performSearch(query, currentPage)}
                  className="btn-primary"
                >
                  Coba Lagi
                </button>
              </div>
            ) : results && results.articles.length > 0 ? (
              <>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" role="list">
                  {results.articles.map((article, index) => (
                    <ArticleCard
                      key={article.id}
                      article={article}
                      variant="default"
                      showCategory
                      showAuthor
                      showDate
                      showReadingTime
                      priority={index < 3}
                    />
                  ))}
                </div>

                {results.hasMore && (
                  <nav className="mt-10 flex items-center justify-center gap-2" aria-label="Pagination">
                    {currentPage > 1 && (
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        className="btn-secondary"
                        aria-label="Halaman sebelumnya"
                      >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Sebelumnya
                      </button>
                    )}
                    <span className="px-4 py-2 text-lexora-text-muted">
                      Halaman {currentPage}
                    </span>
                    {results.hasMore && (
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        className="btn-secondary"
                        aria-label="Halaman selanjutnya"
                      >
                        Selanjutnya
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </button>
                    )}
                  </nav>
                )}
              </>
            ) : query.length >= 2 ? (
              <EmptySearchState query={query} />
            ) : (
              <div className="text-center py-16">
                <Search className="w-16 h-16 text-lexora-border mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-lexora-text mb-2">Mulai Pencarian</h2>
                <p className="text-lexora-text-muted">Ketik minimal 2 karakter untuk mencari artikel, kategori, penulis, atau tag.</p>
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  {['Hukum Pidana', 'Mahkamah Konstitusi', 'Restorative Justice', 'Peradilan', 'Regulasi Baru'].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => handleSearch(suggestion)}
                      className="px-4 py-2 bg-lexora-surface border border-lexora-border text-lexora-text rounded-full text-sm hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}