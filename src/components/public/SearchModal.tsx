'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2, FileText, Tag, User, Calendar, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { cn, formatRelativeTime } from '@/lib/utils';
import type { Article } from '@/types';

interface SearchResult {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage?: string;
  categoryName: string;
  authorName: string;
  publishedAt: Date;
  type: 'article';
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (query: string) => Promise<SearchResult[]>;
}

export function SearchModal({ isOpen, onClose, onSearch }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery('');
      setResults([]);
      setError(null);
      setSelectedIndex(-1);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, -1));
      }
      if (e.key === 'Enter' && selectedIndex >= 0 && results[selectedIndex]) {
        e.preventDefault();
        window.location.href = `/artikel/${results[selectedIndex].slug}`;
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, onClose]);

  const handleSearch = async (value: string) => {
    setQuery(value);
    setSelectedIndex(-1);

    if (value.length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await onSearch(value);
      setResults(data);
    } catch {
      setError('Gagal mencari. Silakan coba lagi.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-fade-in" role="dialog" aria-modal="true" aria-labelledby="search-modal-title">
      <div className="container-main pt-20 pb-8">
        <div className="max-w-3xl mx-auto">
          <div className="relative bg-white dark:bg-lexora-surface rounded-2xl border border-lexora-border shadow-xl overflow-hidden animate-scale-in">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-lexora-text-muted" aria-hidden="true" />
              <input
                ref={inputRef}
                type="search"
                id="search-modal-input"
                placeholder="Cari berita, hukum, regulasi, analisis..."
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-12 pr-16 py-4 bg-transparent border-none focus:outline-none text-lg text-lexora-text placeholder-lexora-text-muted"
                autoComplete="off"
                aria-label="Cari artikel"
                aria-autocomplete="list"
                aria-controls="search-results"
                aria-expanded={results.length > 0}
              />
              <button
                onClick={onClose}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-lg text-lexora-text-muted hover:text-lexora-text hover:bg-lexora-surface transition-colors"
                aria-label="Tutup pencarian"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div id="search-results" className="max-h-[60vh] overflow-y-auto" role="listbox">
              {loading && (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
                  <span className="sr-only">Mencari...</span>
                </div>
              )}

              {error && (
                <div className="p-6 text-center text-red-600 dark:text-red-400" role="alert">
                  <AlertCircle className="w-6 h-6 mx-auto mb-2" />
                  {error}
                </div>
              )}

              {!loading && !error && results.length === 0 && query.length >= 2 && (
                <div className="p-6 text-center text-lexora-text-muted">
                  <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Tidak ditemukan hasil untuk "{query}"</p>
                  <p className="text-sm mt-1">Coba kata kunci lain</p>
                </div>
              )}

              {!loading && results.length > 0 && (
                <ul className="divide-y divide-lexora-border" role="listbox">
                  {results.map((result, index) => (
                    <li
                      key={result.id}
                      role="option"
                      aria-selected={index === selectedIndex}
                      className={cn(
                        'p-4 hover:bg-lexora-surface-hover transition-colors cursor-pointer flex items-start gap-4',
                        index === selectedIndex && 'bg-primary-50 dark:bg-primary-900/20'
                      )}
                      onClick={() => {
                        window.location.href = `/artikel/${result.slug}`;
                        onClose();
                      }}
                      onMouseEnter={() => setSelectedIndex(index)}
                    >
                      {result.featuredImage && (
                        <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                          <img
                            src={result.featuredImage}
                            alt=""
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-0.5 text-xs bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 rounded-full">
                            {result.categoryName}
                          </span>
                          <time className="text-xs text-lexora-text-muted" dateTime={new Date(result.publishedAt).toISOString()}>
                            {formatRelativeTime(result.publishedAt)}
                          </time>
                        </div>
                        <h3 className="font-semibold text-lexora-text line-clamp-2 mb-1">
                          {result.title}
                        </h3>
                        <p className="text-sm text-lexora-text-muted line-clamp-2">
                          {result.excerpt}
                        </p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-lexora-text-muted">
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {result.authorName}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              {!loading && results.length === 0 && query.length < 2 && (
                <div className="p-6 text-center text-lexora-text-muted">
                  <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Ketik minimal 2 karakter untuk mencari</p>
                  <p className="text-sm mt-1">Contoh: "Mahkamah Konstitusi", "Hukum Pidana", "Restorative Justice"</p>
                </div>
              )}
            </div>

            <div className="px-4 py-3 border-t border-lexora-border bg-lexora-surface/50">
              <p className="text-xs text-lexora-text-muted text-center">
                Tekan <kbd className="px-1.5 py-0.5 bg-lexora-border rounded">Enter</kbd> untuk buka, <kbd className="px-1.5 py-0.5 bg-lexora-border rounded">Esc</kbd> untuk tutup
              </p>
            </div>
          </div>

          <p className="text-center text-sm text-lexora-text-muted mt-4">
            Atau buka halaman <Link href="/search" className="text-primary-500 hover:underline">Pencarian Lengkap</Link>
          </p>
        </div>
      </div>
    </div>
  );
}