'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { Category } from '@/types';

interface CategoryNavProps {
  categories: Category[];
  variant?: 'pills' | 'grid' | 'list' | 'dropdown';
  maxItems?: number;
  showCount?: boolean;
}

export function CategoryNav({ categories, variant = 'pills', maxItems = 10, showCount = false }: CategoryNavProps) {
  const activeCategories = categories.filter((c) => c.isActive);
  const displayCategories = activeCategories.slice(0, maxItems);
  const remainingCount = activeCategories.length - maxItems;

  if (variant === 'pills') {
    return (
      <nav aria-label="Kategori berita" className="overflow-x-auto pb-4 -mx-4 px-4">
        <div className="flex gap-2 min-w-max">
          <Link
            href="/berita"
            className="px-4 py-2 text-sm font-medium bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 rounded-full whitespace-nowrap flex-shrink-0"
          >
            Semua
          </Link>
          {displayCategories.map((category) => (
            <Link
              key={category.id}
              href={`/kategori/${category.slug}`}
              className="px-4 py-2 text-sm font-medium bg-lexora-surface text-lexora-text hover:bg-primary-100 hover:text-primary-700 dark:hover:bg-primary-900/30 dark:hover:text-primary-300 border border-lexora-border rounded-full whitespace-nowrap flex-shrink-0 transition-colors"
            >
              {category.name}
              {showCount && category._count && (
                <span className="ml-1.5 px-1.5 py-0.5 text-xs bg-lexora-border rounded-full">
                  {category._count}
                </span>
              )}
            </Link>
          ))}
          {remainingCount > 0 && (
            <button className="px-4 py-2 text-sm font-medium bg-lexora-surface text-lexora-text-muted hover:text-lexora-text border border-lexora-border rounded-full whitespace-nowrap flex-shrink-0 transition-colors">
              +{remainingCount} Lainnya
            </button>
          )}
        </div>
      </nav>
    );
  }

  if (variant === 'grid') {
    return (
      <nav aria-label="Kategori berita">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {displayCategories.map((category) => (
            <Link
              key={category.id}
              href={`/kategori/${category.slug}`}
              className="group p-4 bg-lexora-surface rounded-xl border border-lexora-border hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all text-center"
            >
              {category.icon && (
                <div className="w-12 h-12 mx-auto mb-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center text-primary-600 dark:text-primary-400 group-hover:scale-110 transition-transform">
                  {category.icon}
                </div>
              )}
              <h3 className="font-medium text-lexora-text group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                {category.name}
              </h3>
              {showCount && category._count && (
                <span className="text-xs text-lexora-text-muted mt-1 block">{category._count} artikel</span>
              )}
            </Link>
          ))}
          {remainingCount > 0 && (
            <Link
              href="/kategori"
              className="group p-4 bg-lexora-surface rounded-xl border border-lexora-border hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all text-center"
            >
              <div className="w-12 h-12 mx-auto mb-2 bg-lexora-border rounded-lg flex items-center justify-center text-lexora-text-muted group-hover:text-primary-600 transition-colors">
                <span className="text-2xl font-bold">+{remainingCount}</span>
              </div>
              <h3 className="font-medium text-lexora-text">Lainnya</h3>
            </Link>
          )}
        </div>
      </nav>
    );
  }

  if (variant === 'list') {
    return (
      <nav aria-label="Kategori berita">
        <ul className="space-y-1" role="list">
          <li>
            <Link
              href="/berita"
              className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-lexora-text hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
            >
              <span className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 text-xs font-bold">
                <span className="sr-only">Semua</span>
              </span>
              Semua Berita
            </Link>
          </li>
          {displayCategories.map((category) => (
            <li key={category.id}>
              <Link
                href={`/kategori/${category.slug}`}
                className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-lexora-text-muted hover:text-lexora-text hover:bg-lexora-surface-hover rounded-lg transition-colors"
              >
                {category.icon ? (
                  <span className="w-8 h-8 rounded-lg bg-lexora-border flex items-center justify-center text-lexora-text-muted">
                    {category.icon}
                  </span>
                ) : (
                  <span className="w-8 h-8 rounded-lg bg-lexora-border flex items-center justify-center text-lexora-text-muted text-xs font-bold">
                    {category.name.charAt(0)}
                  </span>
                )}
                {category.name}
                {showCount && category._count && (
                  <span className="ml-auto px-2 py-0.5 text-xs bg-lexora-border rounded-full">
                    {category._count}
                  </span>
                )}
              </Link>
            </li>
          ))}
          {remainingCount > 0 && (
            <li>
              <Link
                href="/kategori"
                className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-lexora-text-muted hover:text-lexora-text hover:bg-lexora-surface-hover rounded-lg transition-colors"
              >
                <span className="w-8 h-8 rounded-lg bg-lexora-border flex items-center justify-center text-lexora-text-muted text-xs font-bold">
                  +{remainingCount}
                </span>
                {remainingCount} kategori lainnya
              </Link>
            </li>
          )}
        </ul>
      </nav>
    );
  }

  return (
    <div className="relative" role="combobox" aria-label="Pilih kategori">
      <button
        className="w-full px-4 py-2.5 bg-white dark:bg-lexora-surface border border-lexora-border rounded-lg text-lexora-text text-sm font-medium flex items-center justify-between hover:border-primary-500 transition-colors"
        aria-expanded="false"
        aria-haspopup="listbox"
      >
        <span>Pilih Kategori</span>
        <svg className="w-4 h-4 text-lexora-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </div>
  );
}