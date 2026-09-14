'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, Plus, Folder, Users, Image, Settings, Bell, ChevronLeft, ChevronRight, Menu, X, LogOut, User, Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/ui/Button';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Artikel', href: '/admin/artikel', icon: FileText },
  { name: 'Tambah Artikel', href: '/admin/artikel/tambah', icon: Plus },
  { name: 'Kategori', href: '/admin/kategori', icon: Folder },
  { name: 'Pengguna', href: '/admin/pengguna', icon: Users },
  { name: 'Media', href: '/admin/media', icon: Image },
  { name: 'Breaking News', href: '/admin/breaking-news', icon: Bell },
  { name: 'Berita Terbaru', href: '/admin/berita-terbaru', icon: FileText },
  { name: 'Homepage', href: '/admin/homepage', icon: LayoutDashboard },
  { name: 'Pengaturan', href: '/admin/pengaturan', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-lexora-bg flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || (user.role !== 'admin' && user.role !== 'editor')) {
    return (
      <div className="min-h-screen bg-lexora-bg flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-lexora-text mb-4">Akses Ditolak</h1>
          <p className="text-lexora-text-muted mb-6">Anda tidak memiliki izin untuk mengakses halaman ini.</p>
          <Link href="/" className="btn-primary">Kembali ke Beranda</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-lexora-bg flex">
      <aside
        className={cn(
          'fixed lg:static inset-y-0 left-0 z-40 bg-lexora-surface border-r border-lexora-border transition-all duration-300 flex flex-col',
          sidebarCollapsed ? 'w-16' : 'w-64',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
        aria-label="Admin sidebar"
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-lexora-border">
          <Link href="/admin" className="flex items-center gap-2" aria-label="Admin Dashboard">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-600 to-secondary-500 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-lg">L</span>
            </div>
            {!sidebarCollapsed && <span className="font-bold text-xl text-lexora-text">LEXORA Admin</span>}
          </Link>
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 rounded-lg text-lexora-text-muted hover:text-lexora-text hover:bg-lexora-surface-hover transition-colors lg:hidden"
            aria-label={sidebarCollapsed ? 'Perluas sidebar' : 'Collapse sidebar'}
          >
            {sidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto" aria-label="Admin navigation">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                    : 'text-lexora-text-muted hover:text-lexora-text hover:bg-lexora-surface-hover'
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
                {!sidebarCollapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-lexora-border">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm font-medium">{user.name.charAt(0).toUpperCase()}</span>
            </div>
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-lexora-text truncate">{user.name}</p>
                <p className="text-xs text-lexora-text-muted truncate">{user.email}</p>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 mt-3 px-3">
            <button
              onClick={toggleTheme}
              className="flex-1 p-2 rounded-lg text-lexora-text-muted hover:text-lexora-text hover:bg-lexora-surface-hover transition-colors"
              aria-label={theme === 'dark' ? 'Mode terang' : 'Mode gelap'}
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 mx-auto" /> : <Moon className="w-5 h-5 mx-auto" />}
            </button>
            <Link
              href="/"
              className="flex-1 p-2 rounded-lg text-lexora-text-muted hover:text-lexora-text hover:bg-lexora-surface-hover transition-colors"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Lihat website"
            >
              <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
            </Link>
            <button
              onClick={async () => {
                const { logout } = await import('@/lib/firebase/auth');
                await logout();
              }}
              className="flex-1 p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              aria-label="Keluar"
            >
              <LogOut className="w-5 h-5 mx-auto" />
            </button>
          </div>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <div className="flex-1 flex flex-col min-w-0 lg:ml-0">
        <header className="sticky top-0 z-30 bg-white/95 dark:bg-lexora-surface/95 backdrop-blur-md border-b border-lexora-border lg:ml-0">
          <div className="flex items-center justify-between h-16 px-4 lg:px-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg text-lexora-text-muted hover:text-lexora-text hover:bg-lexora-surface transition-colors lg:hidden"
              aria-label="Buka menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="flex-1 lg:hidden" />

            <div className="flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-lexora-text-muted hover:text-lexora-text hover:bg-lexora-surface transition-colors hidden sm:flex"
                aria-label={theme === 'dark' ? 'Mode terang' : 'Mode gelap'}
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5" />}
              </button>

              <div className="relative hidden sm:block">
                <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-lexora-surface transition-colors" aria-label="Menu pengguna">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-medium">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6 lg:ml-0" id="admin-main-content">
          {children}
        </main>
      </div>
    </div>
  );
}