'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Search, Sun, Moon, User, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/ui/Button';

const navigation = [
  { name: 'Beranda', href: '/' },
  { name: 'Berita', href: '/berita' },
  { name: 'Hukum', href: '/kategori/hukum' },
  { name: 'Kriminal', href: '/kategori/kriminal' },
  { name: 'Politik', href: '/kategori/politik' },
  { name: 'Peradilan', href: '/kategori/peradilan' },
  { name: 'Regulasi', href: '/kategori/regulasi' },
  { name: 'Edukasi', href: '/kategori/edukasi' },
  { name: 'Opini', href: '/kategori/opini' },
  { name: 'Analisis', href: '/kategori/analisis' },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-white/95 dark:bg-lexora-bg/95 backdrop-blur-md shadow-sm border-b border-lexora-border'
          : 'bg-transparent'
      )}
    >
      <nav className="container-main" aria-label="Main navigation">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2" aria-label="LEXORA Home">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-600 to-secondary-500 flex items-center justify-center">
                <span className="text-white font-bold text-lg">L</span>
              </div>
              <span className="font-bold text-xl text-lexora-text dark:text-lexora-text hidden sm:block">
                LEXORA
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                    pathname === item.href || pathname.startsWith(item.href + '/')
                      ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                      : 'text-lexora-text-muted hover:text-lexora-text dark:text-lexora-text-muted dark:hover:text-lexora-text'
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 rounded-lg text-lexora-text-muted hover:text-lexora-text hover:bg-lexora-surface transition-colors md:hidden"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-lexora-text-muted hover:text-lexora-text hover:bg-lexora-surface transition-colors"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {loading ? (
              <div className="w-8 h-8 rounded-full bg-lexora-surface animate-pulse" />
            ) : user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-lexora-surface transition-colors"
                  aria-expanded={userMenuOpen}
                  aria-haspopup="true"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-medium">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <ChevronDown className="w-4 h-4 text-lexora-text-muted hidden sm:block" />
                </button>

                {userMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setUserMenuOpen(false)}
                      aria-hidden="true"
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-lexora-surface rounded-lg shadow-lg border border-lexora-border py-2 z-50 animate-scale-in">
                      <div className="px-4 py-2 border-b border-lexora-border">
                        <p className="font-medium text-lexora-text">{user.name}</p>
                        <p className="text-sm text-lexora-text-muted">{user.email}</p>
                        <span className={cn(
                          'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-1',
                          user.role === 'admin' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                          user.role === 'editor' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                          'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
                        )}>
                          {user.role}
                        </span>
                      </div>
                      
                      {user.role === 'admin' || user.role === 'editor' ? (
                        <Link
                          href="/admin"
                          className="flex items-center gap-2 px-4 py-2 text-lexora-text hover:bg-lexora-surface transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          Dashboard Admin
                        </Link>
                      ) : null}
                      
                      <Link
                        href="/profile"
                        className="flex items-center gap-2 px-4 py-2 text-lexora-text hover:bg-lexora-surface transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <User className="w-4 h-4" />
                        Profil Saya
                      </Link>
                      
                      <hr className="border-lexora-border my-2" />
                      
                      <button
                        onClick={async () => {
                          const { logout } = await import('@/lib/firebase/auth');
                          await logout();
                          setUserMenuOpen(false);
                        }}
                        className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors w-full"
                      >
                        <LogOut className="w-4 h-4" />
                        Keluar
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link href="/auth/login" className="btn-ghost text-sm">
                  Masuk
                </Link>
                <Link href="/auth/register" className="btn-primary text-sm">
                  Daftar
                </Link>
              </div>
            )}

            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 rounded-lg text-lexora-text hover:bg-lexora-surface transition-colors md:hidden"
              aria-label="Open menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-lexora-bg border-t border-lexora-border animate-slide-down">
          <div className="container-main py-4 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'block px-3 py-2 text-base font-medium rounded-lg transition-colors',
                  pathname === item.href || pathname.startsWith(item.href + '/')
                    ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                    : 'text-lexora-text hover:bg-lexora-surface'
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <hr className="border-lexora-border my-2" />
            {!user && !loading && (
              <div className="flex flex-col gap-2 pt-2">
                <Link href="/auth/login" className="btn-secondary w-full text-center" onClick={() => setMobileMenuOpen(false)}>
                  Masuk
                </Link>
                <Link href="/auth/register" className="btn-primary w-full text-center" onClick={() => setMobileMenuOpen(false)}>
                  Daftar
                </Link>
              </div>
            )}
            {user && (
              <div className="pt-2 space-y-2">
                {user.role === 'admin' || user.role === 'editor' ? (
                  <Link href="/admin" className="btn-secondary w-full text-center" onClick={() => setMobileMenuOpen(false)}>
                    Dashboard Admin
                  </Link>
                ) : null}
                <Link href="/profile" className="btn-secondary w-full text-center" onClick={() => setMobileMenuOpen(false)}>
                  Profil Saya
                </Link>
                <button
                  onClick={async () => {
                    const { logout } = await import('@/lib/firebase/auth');
                    await logout();
                    setMobileMenuOpen(false);
                  }}
                  className="btn-danger w-full text-center"
                >
                  Keluar
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm md:hidden animate-fade-in">
          <div className="container-main pt-20 pb-8">
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-lexora-text-muted" />
              <input
                type="search"
                placeholder="Cari berita, hukum, regulasi..."
                className="w-full pl-12 pr-4 py-3 bg-white dark:bg-lexora-surface border border-lexora-border rounded-lg text-lexora-text placeholder-lexora-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500"
                autoFocus
                onKeyDown={(e) => e.key === 'Escape' && setSearchOpen(false)}
              />
              <button
                onClick={() => setSearchOpen(false)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-lexora-text-muted hover:text-lexora-text"
                aria-label="Close search"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-center text-sm text-lexora-text-muted mt-4">
              Tekan <kbd className="px-2 py-0.5 bg-lexora-surface rounded text-lexora-text">Esc</kbd> untuk menutup
            </p>
          </div>
        </div>
      )}
    </header>
  );
}