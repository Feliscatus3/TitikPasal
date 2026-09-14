'use client';

import Link from 'next/link';
import { FileText, Users, Eye, TrendingUp, Plus, Clock, AlertCircle, CheckCircle, BarChart3 } from 'lucide-react';
import { cn, formatNumber, formatRelativeTime } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import type { DashboardStats } from '@/types';

interface DashboardContentProps {
  stats: DashboardStats;
}

export function DashboardContent({ stats }: DashboardContentProps) {
  const statCards = [
    {
      title: 'Total Artikel',
      value: stats.totalArticles.toString(),
      icon: FileText,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      href: '/admin/artikel',
    },
    {
      title: 'Dipublikasikan',
      value: stats.publishedArticles.toString(),
      icon: CheckCircle,
      color: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      href: '/admin/artikel?status=published',
    },
    {
      title: 'Draft',
      value: stats.draftArticles.toString(),
      icon: Clock,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      href: '/admin/artikel?status=draft',
    },
    {
      title: 'Total Pengguna',
      value: stats.totalUsers.toString(),
      icon: Users,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      href: '/admin/pengguna',
    },
    {
      title: 'Total Views',
      value: formatNumber(stats.totalViews),
      icon: Eye,
      color: 'text-red-500',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      href: '/admin/artikel?sort=views',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-lexora-text">Dashboard</h1>
          <p className="text-lexora-text-muted">Ringkasan performa website</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/artikel/tambah" className="btn-primary">
            <Plus className="w-4 h-4 mr-2" />
            Tambah Artikel
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5" role="list" aria-label="Statistik dashboard">
        {statCards.map((stat) => (
          <Link
            key={stat.title}
            href={stat.href}
            className={cn(
              'p-6 bg-white dark:bg-lexora-surface rounded-xl border border-lexora-border hover:border-primary-500/50 transition-colors',
              'hover:shadow-lg hover:-translate-y-0.5'
            )}
            role="listitem"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-lexora-text-muted mb-1">{stat.title}</p>
                <p className="text-3xl font-bold text-lexora-text">{stat.value}</p>
              </div>
              <div className={cn('p-3 rounded-xl', stat.bgColor)}>
                <stat.icon className={cn('w-6 h-6', stat.color)} aria-hidden="true" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="bg-white dark:bg-lexora-surface rounded-xl border border-lexora-border p-6" aria-labelledby="recent-articles-heading">
          <header className="flex items-center justify-between mb-4">
            <h2 id="recent-articles-heading" className="text-lg font-semibold text-lexora-text flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary-500" />
              Artikel Terbaru
            </h2>
            <Link href="/admin/artikel" className="text-sm text-primary-500 hover:underline">Lihat Semua</Link>
          </header>
          {stats.recentArticles.length > 0 ? (
            <div className="space-y-3">
              {stats.recentArticles.map((article) => (
                <Link
                  key={article.id}
                  href={`/admin/artikel/${article.id}`}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-lexora-surface-hover transition-colors"
                >
                  {article.featuredImage && (
                    <img
                      src={article.featuredImage}
                      alt=""
                      className="w-16 h-12 rounded-lg object-cover flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-lexora-text line-clamp-1">{article.title}</h3>
                    <div className="flex items-center gap-3 mt-1 text-xs text-lexora-text-muted">
                      <span className={cn(
                        'px-2 py-0.5 rounded-full text-xs',
                        article.status === 'published' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                        article.status === 'draft' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' :
                        'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300'
                      )}>
                        {article.status}
                      </span>
                      <time dateTime={article.createdAt.toISOString()}>{formatRelativeTime(article.createdAt)}</time>
                    </div>
                  </div>
                  <span className="text-lexora-text-muted">{article.views} views</span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-lexora-text-muted text-center py-8">Belum ada artikel</p>
          )}
        </section>

        <section className="bg-white dark:bg-lexora-surface rounded-xl border border-lexora-border p-6" aria-labelledby="most-read-heading">
          <header className="flex items-center justify-between mb-4">
            <h2 id="most-read-heading" className="text-lg font-semibold text-lexora-text flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-yellow-500" />
              Paling Dibaca
            </h2>
            <Link href="/admin/artikel?sort=views" className="text-sm text-primary-500 hover:underline">Lihat Semua</Link>
          </header>
          {stats.mostReadArticles.length > 0 ? (
            <div className="space-y-3">
              {stats.mostReadArticles.map((article, index) => (
                <Link
                  key={article.id}
                  href={`/admin/artikel/${article.id}`}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-lexora-surface-hover transition-colors"
                >
                  <span className={cn(
                    'flex-shrink-0 w-8 h-8 flex items-center justify-center text-sm font-bold rounded-lg',
                    index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-500 text-white' :
                    index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-white' :
                    index === 2 ? 'bg-gradient-to-br from-amber-600 to-amber-700 text-white' :
                    'bg-lexora-border text-lexora-text-muted'
                  )}>
                    {index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-lexora-text line-clamp-1">{article.title}</h3>
                    <div className="flex items-center gap-3 mt-1 text-xs text-lexora-text-muted">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {formatNumber(article.views)}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-lexora-text-muted text-center py-8">Belum ada data views</p>
          )}
        </section>
      </div>

      <section className="bg-white dark:bg-lexora-surface rounded-xl border border-lexora-border p-6" aria-labelledby="quick-actions-heading">
        <h2 id="quick-actions-heading" className="text-lg font-semibold text-lexora-text mb-4">Aksi Cepat</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link href="/admin/artikel/tambah" className="btn-secondary h-24 flex flex-col items-center justify-center gap-2 text-center p-4 hover:bg-primary-50 dark:hover:bg-primary-900/20">
            <Plus className="w-8 h-8 text-primary-500" />
            <span className="font-medium text-lexora-text">Tambah Artikel</span>
          </Link>
          <Link href="/admin/kategori" className="btn-secondary h-24 flex flex-col items-center justify-center gap-2 text-center p-4">
            <Folder className="w-8 h-8 text-primary-500" />
            <span className="font-medium text-lexora-text">Kelola Kategori</span>
          </Link>
          <Link href="/admin/breaking-news" className="btn-secondary h-24 flex flex-col items-center justify-center gap-2 text-center p-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
            <span className="font-medium text-lexora-text">Breaking News</span>
          </Link>
          <Link href="/admin/media" className="btn-secondary h-24 flex flex-col items-center justify-center gap-2 text-center p-4">
            <Image className="w-8 h-8 text-primary-500" />
            <span className="font-medium text-lexora-text">Kelola Media</span>
          </Link>
        </div>
      </section>
    </div>
  );
}