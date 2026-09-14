'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock, Eye, ChevronRight } from 'lucide-react';
import { cn, formatDate, formatRelativeTime, calculateReadingTime } from '@/lib/utils';
import type { Article } from '@/types';

interface HeroSectionProps {
  featuredArticle?: Article | null;
  secondaryArticles?: Article[];
  title?: string;
}

export function HeroSection({ featuredArticle, secondaryArticles = [], title = 'Berita Utama' }: HeroSectionProps) {
  if (!featuredArticle) return null;

  const readingTime = featuredArticle.readingTime || calculateReadingTime(featuredArticle.content);

  return (
    <section className="py-8" aria-labelledby="hero-heading">
      <div className="container-main">
        <header className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 id="hero-heading" className="section-title">{title}</h2>
          </div>
          <Link href="/berita" className="btn-ghost text-sm">
            Lihat Semua Berita
          </Link>
        </header>

        <div className="grid gap-6 lg:grid-cols-12">
          <article className="lg:col-span-8" aria-labelledby="featured-title">
            {featuredArticle.featuredImage && (
              <Link href={`/artikel/${featuredArticle.slug}`} className="relative rounded-2xl overflow-hidden mb-4" aria-label={`Baca artikel utama: ${featuredArticle.title}`}>
                <Image
                  src={featuredArticle.featuredImage}
                  alt={featuredArticle.featuredImageAlt || featuredArticle.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" aria-hidden="true" />
                {featuredArticle.categoryName && (
                  <div className="absolute bottom-4 left-4 z-10">
                    <Link
                      href={`/kategori/${featuredArticle.categoryId}`}
                      className="px-3 py-1 text-sm font-medium bg-white/90 text-gray-900 rounded-full backdrop-blur-sm"
                    >
                      {featuredArticle.categoryName}
                    </Link>
                  </div>
                )}
              </Link>
            )}

            <div>
              {featuredArticle.categoryName && (
                <Link
                  href={`/kategori/${featuredArticle.categoryId}`}
                  className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 rounded-full mb-3"
                >
                  {featuredArticle.categoryName}
                </Link>
              )}

              <Link href={`/artikel/${featuredArticle.slug}`} className="block" aria-label={`Baca artikel: ${featuredArticle.title}`}>
                <h1 id="featured-title" className="text-3xl sm:text-4xl lg:text-5xl font-bold text-lexora-text leading-tight mb-4 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  {featuredArticle.title}
                </h1>
              </Link>

              {featuredArticle.subtitle && (
                <p className="text-lg text-lexora-text-muted mb-6 leading-relaxed">{featuredArticle.subtitle}</p>
              )}

              {featuredArticle.excerpt && (
                <p className="text-base text-lexora-text-muted mb-6 leading-relaxed max-w-2xl">{featuredArticle.excerpt}</p>
              )}

              <div className="flex flex-wrap items-center gap-6 text-sm text-lexora-text-muted">
                {featuredArticle.authorName && (
                  <div className="flex items-center gap-2">
                    <Link href={`/penulis/${featuredArticle.authorId}`} className="font-medium text-lexora-text hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                      {featuredArticle.authorName}
                    </Link>
                  </div>
                )}
                {featuredArticle.publishedAt && (
                  <time dateTime={new Date(featuredArticle.publishedAt).toISOString()} className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formatDate(featuredArticle.publishedAt)}
                  </time>
                )}
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {readingTime} menit baca
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {featuredArticle.views.toLocaleString()} views
                </span>
              </div>
            </div>
          </article>

          {secondaryArticles.length > 0 && (
            <aside className="lg:col-span-4 space-y-4" aria-labelledby="secondary-heading">
              <h3 id="secondary-heading" className="text-lg font-semibold text-lexora-text pb-2 border-b border-lexora-border">
                Berita Terkait
              </h3>
              <div className="space-y-4" role="list">
                {secondaryArticles.map((article, index) => (
                  <article
                    key={article.id}
                    className="group flex gap-3"
                    role="listitem"
                  >
                    <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-sm font-bold text-primary-500 bg-primary-50 dark:bg-primary-900/30 rounded-full">
                      {index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      {article.featuredImage && (
                        <Link href={`/artikel/${article.slug}`} className="relative w-full h-24 rounded-lg overflow-hidden mb-2" aria-hidden="true">
                          <Image
                            src={article.featuredImage}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="100px"
                          />
                        </Link>
                      )}
                      <Link href={`/artikel/${article.slug}`} className="block" aria-label={`Baca artikel: ${article.title}`}>
                        <h4 className="font-semibold text-lexora-text group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2 text-sm">
                          {article.title}
                        </h4>
                      </Link>
                      <div className="flex items-center gap-3 mt-1 text-xs text-lexora-text-muted">
                        {article.categoryName && (
                          <span className="px-1.5 py-0.5 bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 rounded-full text-xs">
                            {article.categoryName}
                          </span>
                        )}
                        {article.publishedAt && (
                          <time dateTime={new Date(article.publishedAt).toISOString()}>
                            {formatRelativeTime(article.publishedAt)}
                          </time>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </aside>
          )}
        </div>
      </div>
    </section>
  );
}