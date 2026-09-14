'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MessageSquare, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { cn, formatRelativeTime, calculateReadingTime } from '@/lib/utils';
import type { Article } from '@/types';

interface OpinionSectionProps {
  articles: Article[];
  title?: string;
  subtitle?: string;
  layout?: 'grid' | 'carousel' | 'list';
  columns?: number;
}

export function OpinionSection({ articles, title = 'Opini', subtitle, layout = 'grid', columns = 3 }: OpinionSectionProps) {
  if (articles.length === 0) return null;

  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerView = layout === 'carousel' ? columns : articles.length;
  const maxIndex = Math.max(0, articles.length - itemsPerView);

  if (layout === 'list') {
    return (
      <section className="py-8" aria-labelledby="opinion-heading">
        <div className="container-main">
          <header className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="w-5 h-5 text-green-500" aria-hidden="true" />
              <h2 id="opinion-heading" className="section-title">{title}</h2>
            </div>
            {subtitle && <p className="section-subtitle">{subtitle}</p>}
          </header>
          <div className="space-y-4" role="list">
            {articles.map((article) => (
              <article
                key={article.id}
                className="group flex gap-4 p-4 bg-white dark:bg-lexora-surface rounded-xl border border-lexora-border hover:border-primary-500/50 transition-colors hover:bg-lexora-surface-hover"
                role="listitem"
              >
                {article.featuredImage && (
                  <Link href={`/artikel/${article.slug}`} className="relative w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden" aria-hidden="true">
                    <Image
                      src={article.featuredImage}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="128px"
                    />
                  </Link>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 rounded-full">
                      Opini
                    </span>
                    {article.categoryName && article.categoryName !== 'Opini' && (
                      <Link
                        href={`/kategori/${article.categoryId}`}
                        className="px-2 py-0.5 text-xs bg-lexora-border text-lexora-text-muted rounded-full hover:text-lexora-text transition-colors"
                      >
                        {article.categoryName}
                      </Link>
                    )}
                  </div>
                  <Link href={`/artikel/${article.slug}`} className="block" aria-label={`Baca opini: ${article.title}`}>
                    <h3 className="font-semibold text-lexora-text group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                  </Link>
                  {article.excerpt && (
                    <p className="text-sm text-lexora-text-muted mt-2 line-clamp-2">{article.excerpt}</p>
                  )}
                  <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-lexora-text-muted">
                    {article.authorName && (
                      <div className="flex items-center gap-1">
                        {article.authorPhoto ? (
                          <Image
                            src={article.authorPhoto}
                            alt=""
                            width={24}
                            height={24}
                            className="rounded-full"
                          />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center text-white text-xs font-medium">
                            {article.authorName.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <Link href={`/penulis/${article.authorId}`} className="font-medium hover:text-lexora-text transition-colors">
                          {article.authorName}
                        </Link>
                      </div>
                    )}
                    {article.publishedAt && (
                      <time dateTime={new Date(article.publishedAt).toISOString()}>
                        {formatRelativeTime(article.publishedAt)}
                      </time>
                    )}
                    <span className="flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {article.readingTime || calculateReadingTime(article.content)} menit
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (layout === 'carousel') {
    return (
      <section className="py-8" aria-labelledby="opinion-heading">
        <div className="container-main">
          <header className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-green-500" aria-hidden="true" />
              <h2 id="opinion-heading" className="section-title">{title}</h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentIndex === 0}
                className="p-2 rounded-lg bg-lexora-surface border border-lexora-border text-lexora-text-muted hover:text-lexora-text hover:bg-lexora-surface-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Opini sebelumnya"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setCurrentIndex((prev) => Math.min(maxIndex, prev + 1))}
                disabled={currentIndex === maxIndex}
                className="p-2 rounded-lg bg-lexora-surface border border-lexora-border text-lexora-text-muted hover:text-lexora-text hover:bg-lexora-surface-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Opini selanjutnya"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </header>
          <div
            className="grid gap-6"
            style={{ gridTemplateColumns: `repeat(${itemsPerView}, 1fr)` }}
            role="list"
          >
            {articles.map((article) => (
              <article
                key={article.id}
                className="group bg-white dark:bg-lexora-surface rounded-xl border border-lexora-border hover:border-primary-500/50 transition-colors overflow-hidden hover:bg-lexora-surface-hover"
                role="listitem"
              >
                {article.featuredImage && (
                  <Link href={`/artikel/${article.slug}`} className="relative aspect-video overflow-hidden" aria-hidden="true">
                    <Image
                      src={article.featuredImage}
                      alt=""
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </Link>
                )}
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 rounded-full">
                      Opini
                    </span>
                  </div>
                  <Link href={`/artikel/${article.slug}`} className="block" aria-label={`Baca opini: ${article.title}`}>
                    <h3 className="font-semibold text-lexora-text group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-3 mt-3 text-xs text-lexora-text-muted">
                    {article.authorName && (
                      <div className="flex items-center gap-1">
                        {article.authorPhoto ? (
                          <Image
                            src={article.authorPhoto}
                            alt=""
                            width={20}
                            height={20}
                            className="rounded-full"
                          />
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center text-white text-xs font-medium">
                            {article.authorName.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <span className="font-medium">{article.authorName}</span>
                      </div>
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
          {articles.length > itemsPerView && (
            <div className="flex justify-center gap-2 mt-6" role="tablist" aria-label="Navigasi opini">
              {Array.from({ length: Math.ceil(articles.length / itemsPerView) }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i * itemsPerView)}
                  className={cn(
                    'w-2.5 h-2.5 rounded-full transition-all',
                    currentIndex === i * itemsPerView
                      ? 'bg-primary-500 w-6'
                      : 'bg-lexora-border hover:bg-lexora-text-muted'
                  )}
                  role="tab"
                  aria-selected={currentIndex === i * itemsPerView}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="py-8" aria-labelledby="opinion-heading">
      <div className="container-main">
        <header className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="w-5 h-5 text-green-500" aria-hidden="true" />
            <h2 id="opinion-heading" className="section-title">{title}</h2>
          </div>
          {subtitle && <p className="section-subtitle">{subtitle}</p>}
        </header>
        <div
          className="grid gap-6"
          style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
          role="list"
        >
          {articles.map((article) => (
            <article
              key={article.id}
              className="group bg-white dark:bg-lexora-surface rounded-xl border border-lexora-border hover:border-primary-500/50 transition-colors overflow-hidden hover:bg-lexora-surface-hover"
              role="listitem"
            >
              {article.featuredImage && (
                <Link href={`/artikel/${article.slug}`} className="relative aspect-video overflow-hidden" aria-hidden="true">
                  <Image
                    src={article.featuredImage}
                    alt=""
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </Link>
              )}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 rounded-full">
                    Opini
                  </span>
                </div>
                <Link href={`/artikel/${article.slug}`} className="block" aria-label={`Baca opini: ${article.title}`}>
                  <h3 className="font-semibold text-lexora-text group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                </Link>
                <div className="flex items-center gap-3 mt-3 text-xs text-lexora-text-muted">
                  {article.authorName && (
                    <div className="flex items-center gap-1">
                      {article.authorPhoto ? (
                        <Image
                          src={article.authorPhoto}
                          alt=""
                          width={20}
                          height={20}
                          className="rounded-full"
                        />
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center text-white text-xs font-medium">
                          {article.authorName.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span className="font-medium">{article.authorName}</span>
                    </div>
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
        {articles.length > columns && (
          <div className="mt-6 text-center">
            <a href="/kategori/opini" className="btn-outline">
              Lihat Semua Opini
            </a>
          </div>
        )}
      </div>
    </section>
  );
}