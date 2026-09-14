'use client';

import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'card' | 'article';
  width?: string | number;
  height?: string | number;
  lines?: number;
}

export function Skeleton({ className, variant = 'text', width, height, lines = 1 }: SkeletonProps) {
  const baseStyles = 'animate-pulse bg-lexora-border rounded';

  const variants = {
    text: 'h-4 w-full',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
    card: 'rounded-xl',
    article: 'rounded-xl',
  };

  if (variant === 'article') {
    return (
      <article className={cn('space-y-4', className)}>
        <div className={cn(baseStyles, 'aspect-video w-full rounded-xl')} />
        <div className={cn(baseStyles, 'h-6 w-1/4 rounded-full')} />
        <div className={cn(baseStyles, 'h-8 w-3/4')} />
        <div className={cn(baseStyles, 'h-4 w-full')} />
        <div className={cn(baseStyles, 'h-4 w-5/6')} />
        <div className={cn(baseStyles, 'h-4 w-4/6')} />
        <div className="flex items-center gap-4 pt-4">
          <div className={cn(baseStyles, 'h-6 w-20 rounded-full')} />
          <div className={cn(baseStyles, 'h-4 w-24')} />
          <div className={cn(baseStyles, 'h-4 w-20')} />
        </div>
      </article>
    );
  }

  if (variant === 'card') {
    return (
      <div className={cn('space-y-3 p-4', className)}>
        <div className={cn(baseStyles, 'aspect-video w-full rounded-lg')} />
        <div className={cn(baseStyles, 'h-4 w-1/3 rounded-full')} />
        <div className={cn(baseStyles, 'h-6 w-3/4')} />
        <div className={cn(baseStyles, 'h-4 w-full')} />
        <div className={cn(baseStyles, 'h-4 w-5/6')} />
      </div>
    );
  }

  return (
    <div
      className={cn(baseStyles, variants[variant], className)}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
      }}
      aria-hidden="true"
    />
  );
}

export function ArticleGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" role="list" aria-label="Artikel skeleton">
      {Array.from({ length: count }, (_, i) => (
        <Skeleton key={i} variant="card" role="listitem" />
      ))}
    </div>
  );
}

export function ArticleListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-4" role="list" aria-label="Daftar artikel skeleton">
      {Array.from({ length: count }, (_, i) => (
        <Skeleton key={i} variant="article" role="listitem" />
      ))}
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-12" role="status" aria-label="Memuat berita utama">
      <div className="lg:col-span-8 space-y-4">
        <div className={cn('animate-pulse bg-lexora-border rounded-2xl aspect-[16/10] w-full')} />
        <div className={cn('animate-pulse bg-lexora-border rounded-full h-6 w-24')} />
        <div className={cn('animate-pulse bg-lexora-border h-10 w-3/4')} />
        <div className={cn('animate-pulse bg-lexora-border h-6 w-1/2')} />
        <div className="flex items-center gap-6">
          <div className={cn('animate-pulse bg-lexora-border rounded-full h-6 w-24')} />
          <div className={cn('animate-pulse bg-lexora-border h-4 w-20')} />
          <div className={cn('animate-pulse bg-lexora-border h-4 w-20')} />
        </div>
      </div>
      <div className="lg:col-span-4 space-y-4">
        <div className={cn('animate-pulse bg-lexora-border h-6 w-1/4 rounded-full')} />
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="flex gap-3">
            <div className={cn('animate-pulse bg-primary-500/20 rounded-full h-8 w-8 flex-shrink-0')} />
            <div className="flex-1 space-y-2">
              {article.featuredImage && (
                <div className={cn('animate-pulse bg-lexora-border rounded-lg h-24 w-full')} />
              )}
              <div className={cn('animate-pulse bg-lexora-border h-5 w-3/4')} />
              <div className={cn('animate-pulse bg-lexora-border h-3 w-1/2')} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CategoryGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3" role="list" aria-label="Kategori skeleton">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="p-4 animate-pulse" role="listitem">
          <div className={cn('animate-pulse bg-lexora-border rounded-lg w-12 h-12 mx-auto mb-2')} />
          <div className={cn('animate-pulse bg-lexora-border h-4 w-3/4 mx-auto')} />
        </div>
      ))}
    </div>
  );
}

export function LatestNewsSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="space-y-3" role="list" aria-label="Berita terbaru skeleton">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="flex items-center gap-4 p-3 animate-pulse" role="listitem">
          <div className={cn('animate-pulse bg-lexora-border h-5 w-16 rounded flex-shrink-0')} />
          <div className={cn('animate-pulse bg-lexora-border h-4 w-20 rounded-full flex-shrink-0')} />
          <div className={cn('animate-pulse bg-lexora-border h-4 w-full flex-1')} />
        </div>
      ))}
    </div>
  );
}