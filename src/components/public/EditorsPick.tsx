'use client';

import { ArticleCard } from './ArticleCard';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { Article } from '@/types';

interface EditorsPickProps {
  articles: Article[];
  title?: string;
  subtitle?: string;
  layout?: 'grid' | 'carousel' | 'list';
  columns?: number;
}

export function EditorsPick({ articles, title = 'Pilihan Editor', subtitle, layout = 'grid', columns = 3 }: EditorsPickProps) {
  if (articles.length === 0) return null;

  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerView = layout === 'carousel' ? (columns === 1 ? 1 : columns) : articles.length;
  const maxIndex = Math.max(0, articles.length - itemsPerView);

  if (layout === 'list') {
    return (
      <section className="py-8" aria-labelledby="editors-pick-heading">
        <div className="container-main">
          <header className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-5 h-5 text-yellow-500" aria-hidden="true" />
              <h2 id="editors-pick-heading" className="section-title">{title}</h2>
            </div>
            {subtitle && <p className="section-subtitle">{subtitle}</p>}
          </header>
          <div className="space-y-4" role="list">
            {articles.map((article, index) => (
              <ArticleCard
                key={article.id}
                article={article}
                variant="horizontal"
                showCategory
                showAuthor
                showDate
                showReadingTime
                showViews
                priority={index === 0}
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (layout === 'carousel') {
    return (
      <section className="py-8" aria-labelledby="editors-pick-heading">
        <div className="container-main">
          <header className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" aria-hidden="true" />
              <h2 id="editors-pick-heading" className="section-title">{title}</h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentIndex === 0}
                className="p-2 rounded-lg bg-lexora-surface border border-lexora-border text-lexora-text-muted hover:text-lexora-text hover:bg-lexora-surface-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Artikel sebelumnya"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setCurrentIndex((prev) => Math.min(maxIndex, prev + 1))}
                disabled={currentIndex === maxIndex}
                className="p-2 rounded-lg bg-lexora-surface border border-lexora-border text-lexora-text-muted hover:text-lexora-text hover:bg-lexora-surface-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Artikel selanjutnya"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </header>
          <div
            className="grid gap-6"
            style={{
              gridTemplateColumns: `repeat(${itemsPerView}, 1fr)`,
              transform: `translateX(-${(currentIndex / maxIndex) * 100}%)`,
              transition: 'transform 0.3s ease-out',
            }}
            role="list"
          >
            {articles.map((article, index) => (
              <ArticleCard
                key={article.id}
                article={article}
                variant="default"
                showCategory
                showAuthor
                showDate
                showReadingTime
                priority={index === currentIndex}
              />
            ))}
          </div>
          {articles.length > itemsPerView && (
            <div className="flex justify-center gap-2 mt-6" role="tablist" aria-label="Navigasi pilihan editor">
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
    <section className="py-8" aria-labelledby="editors-pick-heading">
      <div className="container-main">
        <header className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-5 h-5 text-yellow-500" aria-hidden="true" />
            <h2 id="editors-pick-heading" className="section-title">{title}</h2>
          </div>
          {subtitle && <p className="section-subtitle">{subtitle}</p>}
        </header>
        <div
          className="grid gap-6"
          style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
          role="list"
        >
          {articles.map((article, index) => (
            <ArticleCard
              key={article.id}
              article={article}
              variant="default"
              showCategory
              showAuthor
              showDate
              showReadingTime
              priority={index < columns}
            />
          ))}
        </div>
      </div>
    </section>
  );
}