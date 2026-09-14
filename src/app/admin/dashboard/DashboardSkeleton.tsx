'use client';

import { Skeleton } from '@/components/ui/Skeleton';

export function DashboardSkeleton() {
  return (
    <div className="space-y-6" role="status" aria-label="Memuat dashboard">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Skeleton variant="text" width="200" className="mb-2" />
          <Skeleton variant="text" width="300" />
        </div>
        <Skeleton variant="rectangular" width={160} height={44} className="rounded-lg" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} variant="rectangular" className="p-6 rounded-xl border border-lexora-border h-32" />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Skeleton variant="rectangular" className="p-6 rounded-xl border border-lexora-border h-64" />
        <Skeleton variant="rectangular" className="p-6 rounded-xl border border-lexora-border h-64" />
      </div>

      <Skeleton variant="rectangular" className="p-6 rounded-xl border border-lexora-border h-48" />
    </div>
  );
}