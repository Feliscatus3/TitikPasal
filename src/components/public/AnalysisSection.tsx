'use client';

import { ArticleCard } from './ArticleCard';
import { Lightbulb, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { Article } from '@/types';

interface AnalysisSectionProps {
  articles: Article[];
  title?: string;
  subtitle?: string;
  layout?: 'grid' | 'carousel';
  columns?: number;
}

export function AnalysisSection({ articles, title = 'Analisis', subtitle, layout = 'grid', columns = 3 }: AnalysisSectionProps) {
  if (articles.length === 0) return null;

  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerView = layout === 'carousel' ? columns : articles.length;
  const maxIndex = Math.max(0, articles.length - itemsPerView);

  if (layout === 'carousel') {
    return (
      <section className="py-8" aria-labelledby="analysis-heading">
        <div className="container-main">
          <header className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-500" aria-hidden="true" />
              <h2 id="analysis-heading" className="section-title">{title}</h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentIndex === 0}
                className="p-2 rounded-lg bg-lexora-surface border border-lexora-border text-lexora-text-muted hover:text-lexora-text hover:bg-lexora-surface-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Analisis sebelumnya"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setCurrentIndex((prev) => Math.min(maxIndex, prev + 1))}
                disabled={currentIndex === maxIndex}
                className="p-2 rounded-lg bg-lexora-surface border border-lexora-border text-lexora-text-muted hover:text-lexora-text hover:bg-lexora-surface-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Analisis selanjutnya"
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
            <div className="flex justify-center gap-2 mt-6" role="tablist" aria-label="Navigasi analisis">
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
    <section className="py-8" aria-labelledby="analysis-heading">
      <div className="container-main">
        <header className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-5 h-5 text-yellow-500" aria-hidden="true" />
            <h2 id="analysis-heading" className="section-title">{title}</h2>
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
        {articles.length > columns && (
          <div className="mt-6 text-center">
            <a href="/kategori/analisis" className="btn-outline">
              Lihat Semua Analisis
            </a>
          </div>
        )}
      </div>
    </section>
  );
}