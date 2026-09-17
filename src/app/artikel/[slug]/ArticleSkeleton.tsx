"use client";

import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { Skeleton } from "@/components/ui/Skeleton";

export function ArticleSkeleton() {
  return (
    <>
      <Header />
      <main id="main-content" className="flex-1 pt-16">
        <div className="container-main pb-16">
          <nav className="py-4" aria-label="Breadcrumb skeleton">
            <Skeleton variant="text" width="200" className="mb-4" />
          </nav>

          <header className="mb-8">
            <Skeleton variant="text" width="150" className="mb-4" />
            <Skeleton variant="text" width="80%" className="mb-2" />
            <Skeleton variant="text" width="60%" className="mb-2" />
            <Skeleton variant="text" width="40%" className="mb-6" />
            <div className="flex items-center gap-4">
              <Skeleton variant="circular" width={40} height={40} />
              <div className="space-y-1">
                <Skeleton variant="text" width="150" />
                <Skeleton variant="text" width="100" />
              </div>
              <div className="flex-1" />
              <div className="flex items-center gap-6">
                <Skeleton variant="text" width="100" />
                <Skeleton variant="text" width="100" />
                <Skeleton variant="text" width="80" />
                <Skeleton variant="text" width="80" />
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4">
              <Skeleton variant="text" width="60" className="mb-2" />
              <Skeleton variant="circular" width={36} height={36} />
              <Skeleton variant="circular" width={36} height={36} />
              <Skeleton variant="circular" width={36} height={36} />
              <Skeleton variant="circular" width={36} height={36} />
              <Skeleton variant="circular" width={36} height={36} />
              <Skeleton variant="circular" width={36} height={36} />
            </div>
          </header>

          <Skeleton variant="rectangular" className="aspect-video w-full rounded-xl mb-8" />

          <div className="space-y-6 max-w-3xl">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <Skeleton key={i} variant="text" lines={i % 2 === 0 ? 3 : 4} />
            ))}
            <Skeleton variant="rectangular" className="aspect-video w-full rounded-xl my-8" />
            {[1, 2, 3].map((i) => (
              <Skeleton key={`quote-${i}`} variant="text" lines={2} />
            ))}
            <Skeleton variant="rectangular" className="h-32 w-full rounded-xl bg-lexora-border my-8" />
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={`list-${i}`} variant="text" lines={1} />
            ))}
          </div>

          <footer className="mt-12 pt-8 border-t border-lexora-border">
            <Skeleton variant="text" width="80" className="mb-4" />
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} variant="text" width={80} height={28} className="rounded-full" />
              ))}
            </div>
          </footer>

          <section className="mt-12 pt-8 border-t border-lexora-border">
            <Skeleton variant="text" width="200" className="mb-4" />
            <div className="flex gap-4 p-6">
              <Skeleton variant="circular" width={80} height={80} />
              <div className="flex-1 space-y-2">
                <Skeleton variant="text" width="200" />
                <Skeleton variant="text" width="150" />
              </div>
            </div>
          </section>

          <section className="mt-12" aria-labelledby="related-heading-skeleton">
            <Skeleton variant="text" width="200" className="mb-6" />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} variant="card" />
              ))}
            </div>
          </section>

          <div className="mt-12">
            <Skeleton variant="text" width="200" className="mb-6" />
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} variant="article" />
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}