'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock, Eye, Bookmark } from 'lucide-react';
import { cn, formatDate, formatRelativeTime, calculateReadingTime } from '@/lib/utils';
import type { Article } from '@/types';

interface ArticleCardProps {
  article: Article;
  variant?: 'default' | 'featured' | 'compact' | 'horizontal' | 'list';
  showCategory?: boolean;
  showAuthor?: boolean;
  showDate?: boolean;
  showReadingTime?: boolean;
  showViews?: boolean;
  showBookmark?: boolean;
  priority?: boolean;
}

export function ArticleCard({
  article,
  variant = 'default',
  showCategory = true,
  showAuthor = true,
  showDate = true,
  showReadingTime = true,
  showViews = false,
  showBookmark = false,
  priority = false,
}: ArticleCardProps) {
  const readingTime = article.readingTime || calculateReadingTime(article.content);

  const variants = {
    default: 'group flex flex-col h-full',
    featured: 'group flex flex-col h-full',
    compact: 'group flex flex-col',
    horizontal: 'group flex flex-row gap-4',
    list: 'group flex flex-row gap-4',
  };

  const imageSizes = {
    default: 'w-full h-48 object-cover',
    featured: 'w-full h-64 object-cover',
    compact: 'w-full h-32 object-cover',
    horizontal: 'w-64 h-64 flex-shrink-0 object-cover',
    list: 'w-32 h-32 flex-shrink-0 object-cover',
  };

  const titleSizes = {
    default: 'text-lg font-semibold line-clamp-2',
    featured: 'text-xl sm:text-2xl font-bold line-clamp-2',
    compact: 'text-sm font-semibold line-clamp-2',
    horizontal: 'text-base font-semibold line-clamp-2',
    list: 'text-sm font-medium line-clamp-2',
  };

  const excerptSizes = {
    default: 'text-sm text-lexora-text-muted line-clamp-2 mt-2',
    featured: 'text-base text-lexora-text-muted line-clamp-3 mt-3',
    compact: 'hidden',
    horizontal: 'text-sm text-lexora-text-muted line-clamp-2',
    list: 'hidden',
  };

  if (variant === 'horizontal' || variant === 'list') {
    return (
      <article className={cn('flex items-start gap-4 p-4 bg-white dark:bg-lexora-surface rounded-xl border border-lexora-border hover:border-primary-500/50 transition-colors', variant === 'list' && 'hover:bg-lexora-surface-hover')}>
        {article.featuredImage && (
          <Link href={`/artikel/${article.slug}`} className="relative rounded-lg overflow-hidden" aria-label={`Baca artikel: ${article.title}`}>
            <Image
              src={article.featuredImage}
              alt={article.featuredImageAlt || article.title}
              width={variant === 'horizontal' ? 256 : 128}
              height={variant === 'horizontal' ? 256 : 128}
              className={cn(imageSizes[variant], 'transition-transform duration-300 group-hover:scale-105')}
              sizes={variant === 'horizontal' ? '256px' : '128px'}
              priority={priority}
            />
          </Link>
        )}
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            {showCategory && article.categoryName && (
              <Link
                href={`/kategori/${article.categoryId}`}
                className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 rounded-full mb-2"
              >
                {article.categoryName}
              </Link>
            )}
            <Link href={`/artikel/${article.slug}`} className="block" aria-label={`Baca artikel: ${article.title}`}>
              <h3 className={cn(titleSizes[variant], 'text-lexora-text group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors')}>
                {article.title}
              </h3>
            </Link>
            {article.excerpt && (
              <p className={excerptSizes[variant]}>{article.excerpt}</p>
            )}
            <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-lexora-text-muted">
              {showAuthor && article.authorName && (
                <span className="flex items-center gap-1">{article.authorName}</span>
              )}
              {showDate && article.publishedAt && (
                <time dateTime={new Date(article.publishedAt).toISOString()}>
                  {formatRelativeTime(article.publishedAt)}
                </time>
              )}
              {showReadingTime && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {readingTime} menit
                </span>
              )}
              {showViews && (
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {article.views.toLocaleString()}
                </span>
              )}
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className={variants[variant]}>
      {article.featuredImage && (
        <Link href={`/artikel/${article.slug}`} className="relative rounded-t-xl overflow-hidden" aria-label={`Baca artikel: ${article.title}`}>
          <Image
            src={article.featuredImage}
            alt={article.featuredImageAlt || article.title}
            fill
            className={cn(imageSizes[variant], 'transition-transform duration-300 group-hover:scale-105')}
            sizes={variant === 'featured' ? '(max-width: 768px) 100vw, 50vw' : '(max-width: 640px) 100vw, 33vw'}
            priority={priority}
          />
        </Link>
      )}
      <div className="flex-1 flex flex-col p-4 pt-0">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          {showCategory && article.categoryName && (
            <Link
              href={`/kategori/${article.categoryId}`}
              className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 rounded-full"
            >
              {article.categoryName}
            </Link>
          )}
          {article.status === 'published' && (
            <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 rounded-full">
              Terbit
            </span>
          )}
          {article.status === 'draft' && (
            <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300 rounded-full">
              Draft
            </span>
          )}
        </div>
        <Link href={`/artikel/${article.slug}`} className="block" aria-label={`Baca artikel: ${article.title}`}>
          <h3 className={cn(titleSizes[variant], 'text-lexora-text group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors')}>
            {article.title}
          </h3>
        </Link>
        {article.excerpt && (
          <p className={excerptSizes[variant]}>{article.excerpt}</p>
        )}
        <div className="mt-auto flex flex-wrap items-center gap-4 pt-3 border-t border-lexora-border">
          <div className="flex flex-wrap items-center gap-4 text-xs text-lexora-text-muted">
            {showAuthor && article.authorName && (
              <span className="flex items-center gap-1">{article.authorName}</span>
            )}
            {showDate && article.publishedAt && (
              <time dateTime={new Date(article.publishedAt).toISOString()} className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {formatDate(article.publishedAt)}
              </time>
            )}
            {showReadingTime && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {readingTime} menit
              </span>
            )}
            {showViews && (
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {article.views.toLocaleString()}
              </span>
            )}
          </div>
          {showBookmark && (
            <button className="p-1.5 rounded-lg text-lexora-text-muted hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors" aria-label="Bookmark">
              <Bookmark className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}