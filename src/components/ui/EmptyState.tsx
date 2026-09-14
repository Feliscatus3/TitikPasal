'use client';

import { cn } from '@/lib/utils';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
    variant?: 'primary' | 'secondary' | 'outline';
  };
  className?: string;
  illustration?: React.ReactNode;
}

const defaultIcons: Record<string, React.ReactNode> = {
  search: (
    <svg className="w-16 h-16 text-lexora-border mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  articles: (
    <svg className="w-16 h-16 text-lexora-border mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 12h6m4 0h4m-4 4h4" />
    </svg>
  ),
  category: (
    <svg className="w-16 h-16 text-lexora-border mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
    </svg>
  ),
  user: (
    <svg className="w-16 h-16 text-lexora-border mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  bookmark: (
    <svg className="w-16 h-16 text-lexora-border mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
    </svg>
  ),
  notification: (
    <svg className="w-16 h-16 text-lexora-border mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  ),
  generic: (
    <svg className="w-16 h-16 text-lexora-border mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907m5.906-2.097a5.956 5.956 0 00-1.025 2.007" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
};

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
  illustration,
}: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center text-center py-16 px-4', className)}>
      {illustration || icon || defaultIcons.generic}
      <h3 className="text-lg font-semibold text-lexora-text mb-2">{title}</h3>
      {description && (
        <p className="text-lexora-text-muted max-w-sm mb-6">{description}</p>
      )}
      {action && (
        <Button
          variant={action.variant || 'primary'}
          onClick={action.onClick}
          asChild={!!action.href}
        >
          {action.href ? (
            <a href={action.href}>{action.label}</a>
          ) : (
            action.label
          )}
        </Button>
      )}
    </div>
  );
}

export function EmptySearchState({ query }: { query: string }) {
  return (
    <EmptyState
      icon={defaultIcons.search}
      title={`Tidak ditemukan hasil untuk "${query}"`}
      description="Coba gunakan kata kunci lain atau periksa ejaan Anda."
      action={{
        label: 'Kembali ke Beranda',
        href: '/',
        variant: 'primary',
      }}
    />
  );
}

export function EmptyArticlesState({ categoryName }: { categoryName?: string }) {
  return (
    <EmptyState
      icon={defaultIcons.articles}
      title={categoryName ? `Belum ada artikel di kategori ${categoryName}` : 'Belum ada artikel'}
      description={categoryName
        ? 'Artikel untuk kategori ini akan segera hadir.'
        : 'Belum ada artikel yang dipublikasikan. Silakan cek kembali nanti.'}
      action={{
        label: 'Kembali ke Beranda',
        href: '/',
        variant: 'primary',
      }}
    />
  );
}

export function EmptyCategoryState() {
  return (
    <EmptyState
      icon={defaultIcons.category}
      title='Belum ada kategori'
      description='Kategori akan muncul di sini setelah ditambahkan melalui admin panel.'
      action={{
        label: 'Kelola Kategori',
        href: '/admin/kategori',
        variant: 'primary',
      }}
    />
  );
}

export function EmptyBookmarksState() {
  return (
    <EmptyState
      icon={defaultIcons.bookmark}
      title='Belum ada bookmark'
      description='Simpan artikel favorit Anda dengan menekan ikon bookmark di artikel.'
      action={{
        label: 'Jelajahi Artikel',
        href: '/berita',
        variant: 'primary',
      }}
    />
  );
}

export function EmptyNotificationsState() {
  return (
    <EmptyState
      icon={defaultIcons.notification}
      title='Tidak ada notifikasi'
      description='Notifikasi baru akan muncul di sini.'
    />
  );
}

export function EmptyAuthorsState() {
  return (
    <EmptyState
      icon={defaultIcons.user}
      title='Belum ada penulis'
      description='Penulis akan muncul di sini setelah ditambahkan melalui admin panel.'
      action={{
        label: 'Kelola Penulis',
        href: '/admin/penulis',
        variant: 'primary',
      }}
    />
  );
}