'use client';

import Link from 'next/link';
import { ArticleCard } from './ArticleCard';
import { TrendingUp, Clock, Eye } from 'lucide-react';
import { cn, formatRelativeTime } from '@/lib/utils';
import type { Article } from '@/types';

interface MostReadProps {
  articles: Article[];
  title?: string;
  subtitle?: string;
  limit?: number;
  showRank?: boolean;
}

export function MostRead({ articles, title = 'Paling Dibaca', subtitle, limit = 5, showRank = true }: MostReadProps) {
  const displayArticles = articles.slice(0, limit);

  if (displayArticles.length === 0) return null;

  return (
    <section className="py-8" aria-labelledby="most-read-heading">
      <div className="container-main">
        <header className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-primary-500" aria-hidden="true" />
            <h2 id="most-read-heading" className="section-title">{title}</h2>
          </div>
          {subtitle && <p className="section-subtitle">{subtitle}</p>}
        </header>
        <div className="space-y-3" role="list">
          {displayArticles.map((article, index) => (
            <article
              key={article.id}
              className={cn(
                'group flex items-start gap-4 p-3 bg-white dark:bg-lexora-surface rounded-xl border border-lexora-border hover:border-primary-500/50 transition-colors',
                'hover:bg-lexora-surface-hover'
              )}
              role="listitem"
            >
              {showRank && (
                <span className={cn(
                  'flex-shrink-0 w-8 h-8 flex items-center justify-center text-sm font-bold rounded-lg',
                  index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-500 text-white' :
                  index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-white' :
                  index === 2 ? 'bg-gradient-to-br from-amber-600 to-amber-700 text-white' :
                  'bg-lexora-border text-lexora-text-muted'
                )}>
                  {index + 1}
                </span>
              )}
              <div className="flex-1 min-w-0">
                <Link href={`/artikel/${article.slug}`} className="block" aria-label={`Baca artikel: ${article.title}`}>
                  <h3 className="font-semibold text-lexora-text group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                </Link>
                <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-lexora-text-muted">
                  {article.categoryName && (
                    <span className="px-2 py-0.5 bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 rounded-full">
                      {article.categoryName}
                    </span>
                  )}
                  {article.publishedAt && (
                    <time dateTime={new Date(article.publishedAt).toISOString()} className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatRelativeTime(article.publishedAt)}
                    </time>
                  )}
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {article.views.toLocaleString()} views
                  </span>
                </div>
              </div>
              {article.featuredImage && (
                <Link href={`/artikel/${article.slug}`} className="relative w-24 h-16 flex-shrink-0 rounded-lg overflow-hidden" aria-hidden="true">
                  <img
                    src={article.featuredImage}
                    alt=""
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </Link>
              )}
            </article>
          ))}
        </div>
        {articles.length > limit && (
          <div className="mt-6 text-center">
            <a href="/berita/paling-dibaca" className="btn-outline">
              Lihat Semua Paling Dibaca
            </a>
          </div>
        )}
      </div>
    </section>
  );
}