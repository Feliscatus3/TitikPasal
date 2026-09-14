'use client';

import Link from 'next/link';
import { Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { cn, formatRelativeTime } from '@/lib/utils';
import type { LatestNews } from '@/types';

interface LatestNewsProps {
  items: LatestNews[];
  title?: string;
  limit?: number;
  variant?: 'ticker' | 'list' | 'cards';
  autoScroll?: boolean;
  scrollInterval?: number;
}

export function LatestNews({
  items,
  title = 'Berita Terbaru',
  limit = 6,
  variant = 'list',
  autoScroll = false,
  scrollInterval = 3000,
}: LatestNewsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const activeItems = items.filter((item) => item.status === 'active').slice(0, limit);

  if (activeItems.length === 0) return null;

  if (variant === 'ticker') {
    return (
      <div className="bg-lexora-surface border-b border-lexora-border overflow-hidden" role="region" aria-label="Berita terbaru">
        <div className="container-main">
          <div className="flex items-center h-10 overflow-hidden" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
            <span className="flex-shrink-0 px-3 py-1 bg-primary-600 text-white text-sm font-semibold rounded-r-lg whitespace-nowrap">
              BERITA TERBARU
            </span>
            <div className="flex-1 ml-3 overflow-hidden relative">
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {activeItems.map((item) => (
                  <div key={item.id} className="w-full flex-shrink-0 px-3">
                    <Link
                      href={item.url}
                      className="flex items-center gap-3 text-sm font-medium text-lexora-text hover:text-primary-500 transition-colors whitespace-nowrap"
                    >
                      <span className="text-lexora-text-muted whitespace-nowrap">{item.time}</span>
                      {item.categoryName && (
                        <span className="px-2 py-0.5 text-xs bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 rounded-full">
                          {item.categoryName}
                        </span>
                      )}
                      {item.title}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'cards') {
    return (
      <section className="py-8" aria-labelledby="latest-news-heading">
        <div className="container-main">
          <header className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary-500" aria-hidden="true" />
              <h2 id="latest-news-heading" className="section-title">{title}</h2>
            </div>
            <a href="/berita/terbaru" className="btn-ghost text-sm">
              Lihat Semua
            </a>
          </header>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" role="list">
            {activeItems.map((item, index) => (
              <article key={item.id} className="group bg-white dark:bg-lexora-surface rounded-xl border border-lexora-border hover:border-primary-500/50 transition-colors p-4 hover:bg-lexora-surface-hover" role="listitem">
                <div className="flex items-center gap-2 mb-2">
                  <time className="text-xs text-lexora-text-muted whitespace-nowrap">{item.time}</time>
                  {item.categoryName && (
                    <span className="px-2 py-0.5 text-xs bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 rounded-full">
                      {item.categoryName}
                    </span>
                  )}
                </div>
                <Link href={item.url} className="block" aria-label={`Baca berita: ${item.title}`}>
                  <h3 className="font-semibold text-lexora-text group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8" aria-labelledby="latest-news-heading">
      <div className="container-main">
        <header className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary-500" aria-hidden="true" />
            <h2 id="latest-news-heading" className="section-title">{title}</h2>
          </div>
          <a href="/berita/terbaru" className="btn-ghost text-sm">
            Lihat Semua
          </a>
        </header>
        <div className="space-y-3" role="list">
          {activeItems.map((item) => (
            <article
              key={item.id}
              className="group flex items-center gap-4 p-3 bg-white dark:bg-lexora-surface rounded-xl border border-lexora-border hover:border-primary-500/50 transition-colors hover:bg-lexora-surface-hover"
              role="listitem"
            >
              <time className="text-sm font-medium text-lexora-text-muted whitespace-nowrap flex-shrink-0">
                {item.time}
              </time>
              {item.categoryName && (
                <span className="px-2 py-0.5 text-xs bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 rounded-full flex-shrink-0">
                  {item.categoryName}
                </span>
              )}
              <Link href={item.url} className="flex-1 min-w-0 block" aria-label={`Baca berita: ${item.title}`}>
                <h3 className="font-medium text-lexora-text group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors truncate">
                  {item.title}
                </h3>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}