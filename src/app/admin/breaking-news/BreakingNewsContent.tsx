'use client';

import { useState } from 'react';
import { Plus, Search, MoreVertical, Edit, Trash2, Eye, AlertTriangle, GripVertical } from 'lucide-react';
import { formatDate, formatRelativeTime } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { cn } from '@/lib/utils';
import type { BreakingNews } from '@/types';

interface BreakingNewsContentProps {
  userRole: string;
}

export function BreakingNewsContent({ userRole }: BreakingNewsContentProps) {
  const [items, setItems] = useState<BreakingNews[]>([
    {
      id: '1',
      text: 'Mahkamah Konstitusi mengeluarkan putusan terbaru mengenai UU Cipta Kerja',
      url: '/artikel/uu-cipta-kerja-putusan-mk',
      status: 'active',
      priority: 1,
      createdAt: new Date(),
    },
    {
      id: '2',
      text: 'Polisi menetapkan tersangka kasus korupsi proyek toll Trans-Jawa',
      url: '/artikel/tersangka-korupsi-toll-trans-jawa',
      status: 'active',
      priority: 2,
      createdAt: new Date(Date.now() - 3600000),
    },
    {
      id: '3',
      text: 'Pemerintah menerbitkan PP baru tentang perlindungan data pribadi',
      url: '/artikel/pp-perlindungan-data-pribadi',
      status: 'inactive',
      priority: 3,
      createdAt: new Date(Date.now() - 7200000),
    },
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const filteredItems = items.filter(item => {
    const matchesSearch = item.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.url.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAdd = () => {
    const newItem: BreakingNews = {
      id: Date.now().toString(),
      text: '',
      url: '',
      status: 'active',
      priority: items.length + 1,
      createdAt: new Date(),
    };
    setItems(prev => [newItem, ...prev]);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Yakin ingin menghapus breaking news ini?')) return;
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const handleToggleStatus = (id: string) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, status: item.status === 'active' ? 'inactive' : 'active' } : item
    ));
  };

  const handleUpdate = (id: string, field: keyof BreakingNews, value: string) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleReorder = (fromIndex: number, toIndex: number) => {
    setItems(prev => {
      const newItems = [...prev];
      const [removed] = newItems.splice(fromIndex, 1);
      newItems.splice(toIndex, 0, removed);
      // Update priorities
      return newItems.map((item, index) => ({ ...item, priority: index + 1 }));
    });
  };

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 bg-white dark:bg-lexora-surface rounded-xl border border-lexora-border">
        <div>
          <h2 className="text-2xl font-bold text-lexora-text">Breaking News</h2>
          <p className="text-lexora-text-muted">Kelola berita mendesak yang muncul di ticker homepage</p>
        </div>
        <Button onClick={handleAdd} className="whitespace-nowrap">
          <Plus className="w-4 h-4 mr-2" />
          Tambah Breaking News
        </Button>
      </div>

      {/* Filters */}
      <div className="p-6 bg-white dark:bg-lexora-surface rounded-xl border border-lexora-border">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-lexora-text-muted" />
            <input
              type="search"
              placeholder="Cari breaking news..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 px-4 py-2 bg-white dark:bg-lexora-surface border border-lexora-border rounded-lg text-lexora-text placeholder-lexora-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
            className="w-full sm:w-40"
            options={[
              { value: 'all', label: 'Semua Status' },
              { value: 'active', label: 'Aktif' },
              { value: 'inactive', label: 'Nonaktif' },
            ]}
          />
        </div>
      </div>

      {/* Breaking News List */}
      <div className="bg-white dark:bg-lexora-surface rounded-xl border border-lexora-border overflow-hidden">
        {filteredItems.length === 0 ? (
          <div className="p-12 text-center">
            <AlertTriangle className="w-16 h-16 text-lexora-border mx-auto mb-4" />
            <h3 className="text-lg font-medium text-lexora-text mb-2">Belum ada breaking news</h3>
            <p className="text-lexora-text-muted mb-6">Tambah breaking news pertama Anda</p>
            <button onClick={handleAdd} className="btn-primary inline-flex">
              <Plus className="w-4 h-4 mr-2" />
              Tambah Breaking News
            </button>
          </div>
        ) : (
          <div className="divide-y divide-lexora-border">
            {filteredItems.map((item, index) => (
              <div key={item.id} className="p-4 hover:bg-lexora-surface/50 transition-colors">
                <div className="flex items-start gap-4">
                  {/* Drag Handle */}
                  <button
                    className="p-1 rounded text-lexora-text-muted hover:text-lexora-text hover:bg-lexora-surface transition-colors"
                    title="Seret untuk mengubah urutan"
                  >
                    <GripVertical className="w-5 h-5" />
                  </button>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={cn(
                        'inline-flex px-2 py-0.5 text-xs font-medium rounded-full',
                        item.status === 'active' 
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' 
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300'
                      )}>
                        {item.status === 'active' ? 'Aktif' : 'Nonaktif'}
                      </span>
                      <span className="text-xs text-lexora-text-muted">Prioritas: #{item.priority}</span>
                      <span className="text-xs text-lexora-text-muted">{formatRelativeTime(item.createdAt)}</span>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2 gap-y-2">
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-medium text-lexora-text-muted mb-1">Teks Breaking News</label>
                        <input
                          type="text"
                          value={item.text}
                          onChange={(e) => handleUpdate(item.id, 'text', e.target.value)}
                          className="w-full px-3 py-2 bg-white dark:bg-lexora-surface border border-lexora-border rounded-lg text-lexora-text placeholder-lexora-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="Masukkan teks breaking news..."
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-lexora-text-muted mb-1">URL (opsional)</label>
                        <input
                          type="url"
                          value={item.url}
                          onChange={(e) => handleUpdate(item.id, 'url', e.target.value)}
                          className="w-full px-3 py-2 bg-white dark:bg-lexora-surface border border-lexora-border rounded-lg text-lexora-text placeholder-lexora-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="https://example.com/artikel"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-lexora-text-muted mb-1">Status</label>
                        <Select
                          value={item.status}
                          onChange={(e) => handleUpdate(item.id, 'status', e.target.value)}
                          options={[
                            { value: 'active', label: 'Aktif' },
                            { value: 'inactive', label: 'Nonaktif' },
                          ]}
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleStatus(item.id)}
                      className="p-2 rounded-lg text-lexora-text-muted hover:text-lexora-text hover:bg-lexora-surface transition-colors"
                      title={item.status === 'active' ? 'Nonaktifkan' : 'Aktifkan'}
                    >
                      {item.status === 'active' ? (
                        <span className="w-5 h-5 text-red-500">●</span>
                      ) : (
                        <span className="w-5 h-5 text-green-500">●</span>
                      )}
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      title="Hapus"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}