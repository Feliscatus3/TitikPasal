'use client';

import { useState } from 'react';
import { Plus, Search, MoreVertical, Edit, Trash2, Eye, FileText } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { formatDate, formatRelativeTime } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { cn } from '@/lib/utils';
import type { Article, Category } from '@/types';

interface ArticlesContentProps {
  articles: any[];
  categories: Category[];
  hasMore: boolean;
  currentPage: number;
  userRole: string;
}

export function ArticlesContent({ articles, categories, hasMore, currentPage, userRole }: ArticlesContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'all');
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get('category') || 'all');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(searchParams.get('sortOrder') === 'asc' ? 'asc' : 'desc');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (statusFilter !== 'all') params.set('status', statusFilter);
    if (categoryFilter !== 'all') params.set('category', categoryFilter);
    if (sortBy !== 'createdAt') params.set('sortBy', sortBy);
    if (sortOrder !== 'desc') params.set('sortOrder', sortOrder);
    router.push(`/admin/artikel?${params.toString()}`);
  };

  const handleStatusChange = async (articleId: string, newStatus: string) => {
    try {
      // TODO: Implement status update via API
      console.log('Update status:', articleId, newStatus);
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handleDelete = async (articleId: string) => {
    if (!confirm('Yakin ingin menghapus artikel ini?')) return;
    try {
      // TODO: Implement delete via API
      console.log('Delete article:', articleId);
    } catch (error) {
      console.error('Failed to delete:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Search and Filters */}
      <form onSubmit={handleSearch} className="space-y-4 p-6 bg-white dark:bg-lexora-surface rounded-xl border border-lexora-border">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-lexora-text-muted" />
            <Input
              type="search"
              placeholder="Cari artikel..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-40"
            options={[
              { value: 'all', label: 'Semua Status' },
              { value: 'published', label: 'Terbit' },
              { value: 'draft', label: 'Draft' },
              { value: 'scheduled', label: 'Terjadwal' },
            ]}
          />
          <Select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full sm:w-48"
            options={[
              { value: 'all', label: 'Semua Kategori' },
              ...categories.map((c) => ({ value: c.slug, label: c.name })),
            ]}
          />
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full sm:w-40"
            options={[
              { value: 'createdAt', label: 'Terbaru' },
              { value: 'publishedAt', label: 'Terbit' },
              { value: 'views', label: 'Dilihat' },
              { value: 'title', label: 'Judul' },
            ]}
          />
          <Select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
            className="w-full sm:w-32"
            options={[
              { value: 'desc', label: 'Desc' },
              { value: 'asc', label: 'Asc' },
            ]}
          />
          <Button type="submit" className="whitespace-nowrap">
            <Search className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
      </form>

      {/* Articles Table */}
      <div className="bg-white dark:bg-lexora-surface rounded-xl border border-lexora-border overflow-hidden">
        {articles.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="w-16 h-16 text-lexora-border mx-auto mb-4" />
            <h3 className="text-lg font-medium text-lexora-text mb-2">Belum ada artikel</h3>
            <p className="text-lexora-text-muted mb-6">Mulai buat artikel pertama Anda</p>
            <Link href="/admin/artikel/tambah" className="btn-primary inline-flex">
              <Plus className="w-4 h-4 mr-2" />
              Tambah Artikel
            </Link>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-lexora-border bg-lexora-surface/50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-lexora-text-muted uppercase tracking-wider">Artikel</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-lexora-text-muted uppercase tracking-wider hidden md:table-cell">Kategori</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-lexora-text-muted uppercase tracking-wider hidden lg:table-cell">Penulis</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-lexora-text-muted uppercase tracking-wider hidden md:table-cell">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-lexora-text-muted uppercase tracking-wider hidden lg:table-cell">Views</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-lexora-text-muted uppercase tracking-wider">Tanggal</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-lexora-text-muted uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-lexora-border">
                  {articles.map((article) => (
                    <tr key={article.id} className="hover:bg-lexora-surface/50 transition-colors">
                      <td className="px-6 py-4">
                        <Link href={`/artikel/${article.slug}`} target="_blank" rel="noopener noreferrer" className="font-medium text-lexora-text hover:text-primary-600 dark:hover:text-primary-400 truncate block max-w-xs">
                          {article.title}
                        </Link>
                        {article.subtitle && <p className="text-sm text-lexora-text-muted truncate max-w-xs mt-1">{article.subtitle}</p>}
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        {article.categoryName && (
                          <span className="inline-flex px-2 py-1 text-xs font-medium bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 rounded-full">
                            {article.categoryName}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 hidden lg:table-cell">
                        <div className="flex items-center gap-2">
                          {article.authorPhoto ? (
                            <img src={article.authorPhoto} alt="" className="w-6 h-6 rounded-full" />
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white text-xs font-medium">
                              {article.authorName?.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <span className="text-sm text-lexora-text">{article.authorName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <span className={cn(
                          'inline-flex px-2 py-1 text-xs font-medium rounded-full',
                          article.status === 'published' && 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
                          article.status === 'draft' && 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
                          article.status === 'scheduled' && 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
                          article.status === 'archived' && 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300'
                        )}>
                          {article.status === 'published' && 'Terbit'}
                          {article.status === 'draft' && 'Draft'}
                          {article.status === 'scheduled' && 'Terjadwal'}
                          {article.status === 'archived' && 'Arsip'}
                        </span>
                      </td>
                      <td className="px-6 py-4 hidden lg:table-cell text-lexora-text-muted">
                        {article.views?.toLocaleString() || '0'}
                      </td>
                      <td className="px-6 py-4 text-lexora-text-muted">
                        {article.publishedAt 
                          ? formatDate(article.publishedAt) 
                          : formatRelativeTime(article.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/artikel/${article.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg text-lexora-text-muted hover:text-lexora-text hover:bg-lexora-surface transition-colors"
                            title="Lihat"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          {(userRole === 'admin' || userRole === 'editor') && (
                            <>
                              <Link
                                href={`/admin/artikel/${article.id}/edit`}
                                className="p-2 rounded-lg text-lexora-text-muted hover:text-lexora-text hover:bg-lexora-surface transition-colors"
                                title="Edit"
                              >
                                <Edit className="w-4 h-4" />
                              </Link>
                              <button
                                onClick={() => handleStatusChange(article.id, article.status === 'published' ? 'draft' : 'published')}
                                className="p-2 rounded-lg text-lexora-text-muted hover:text-lexora-text hover:bg-lexora-surface transition-colors"
                                title={article.status === 'published' ? 'Set ke Draft' : 'Terbitkan'}
                              >
                                {article.status === 'published' ? (
                                  <FileText className="w-4 h-4" />
                                ) : (
                                  <FileText className="w-4 h-4" />
                                )}
                              </button>
                              <button
                                onClick={() => handleDelete(article.id)}
                                className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                title="Hapus"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {hasMore && (
              <div className="p-4 border-t border-lexora-border">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-lexora-text-muted">
                    Menampilkan {articles.length} artikel
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const params = new URLSearchParams(searchParams.toString());
                      params.set('page', String(currentPage + 1));
                      router.push(`/admin/artikel?${params.toString()}`);
                    }}
                  >
                    Halaman Selanjutnya
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}