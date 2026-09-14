'use client';

import { Header } from '@/components/public/Header';
import { Footer } from '@/components/public/Footer';
import { CategoryNav } from '@/components/public/CategoryNav';
import { ArticleGridSkeleton, CategoryGridSkeleton, Skeleton } from '@/components/ui/Skeleton';

export function CategorySkeleton() {
  return (
    <>
      <Header />
      <main id="main-content" className="flex-1 pt-16">
        <header className="container-main py-12" role="status" aria-label="Memuat header kategori">
          <Skeleton variant="text" width="150" className="mb-4" />
          <Skeleton variant="text" width="80%" className="mb-2" />
          <Skeleton variant="text" width="60%" />
        </header>

        <section className="py-8 bg-lexora-surface/50" aria-label="Navigasi kategori skeleton">
          <div className="container-main">
            <CategoryGridSkeleton count={12} />
          </div>
        </section>

        <section className="py-8" aria-label="Daftar artikel skeleton">
          <div className="container-main">
            <Skeleton variant="text" width="300" className="mb-6" />
            <ArticleGridSkeleton count={6} />
            <div className="mt-10 flex items-center justify-center gap-2">
              <Skeleton variant="rectangular" width={100} height={40} className="rounded-lg" />
              <Skeleton variant="rectangular" width={40} height={40} className="rounded-lg" />
              <Skeleton variant="rectangular" width={40} height={40} className="rounded-lg" />
              <Skeleton variant="rectangular" width={40} height={40} className="rounded-lg" />
              <Skeleton variant="rectangular" width={40} height={40} className="rounded-lg" />
              <Skeleton variant="rectangular" width={100} height={40} className="rounded-lg" />
            </div>
          </div>
        </section>

        <section className="py-8" aria-label="Paling dibaca skeleton">
          <div className="container-main">
            <Skeleton variant="text" width="300" className="mb-6" />
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} variant="article" />
              ))}
            </div>
          </div>
        </section>

        <section className="py-8" aria-label="Pilihan editor skeleton">
          <div className="container-main">
            <Skeleton variant="text" width="300" className="mb-6" />
            <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} variant="card" />
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-gradient-to-br from-primary-900/20 via-lexora-surface to-secondary-900/20" aria-label="Newsletter skeleton">
          <div className="container-main">
            <div className="max-w-2xl mx-auto text-center">
              <Skeleton variant="text" width="100" className="mx-auto mb-3" />
              <Skeleton variant="text" width="80%" className="mx-auto mb-2" />
              <Skeleton variant="text" width="60%" className="mx-auto mb-6" />
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <Skeleton variant="rectangular" className="flex-1 h-12 rounded-lg" />
                <Skeleton variant="rectangular" width={140} height={48} className="rounded-lg" />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}