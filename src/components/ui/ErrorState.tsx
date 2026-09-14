'use client';

import { cn } from '@/lib/utils';
import { Button } from './Button';

interface ErrorStateProps {
  title?: string;
  message?: string;
  error?: Error | string | null;
  onRetry?: () => void;
  retryLabel?: string;
  variant?: 'page' | 'card' | 'inline';
  className?: string;
  showDetails?: boolean;
}

export function ErrorState({
  title = 'Terjadi Kesalahan',
  message = 'Maaf, terjadi kesalahan yang tidak terduga. Silakan coba lagi nanti.',
  error,
  onRetry,
  retryLabel = 'Coba Lagi',
  variant = 'page',
  className,
  showDetails = false,
}: ErrorStateProps) {
  const variants = {
    page: 'flex flex-col items-center justify-center text-center py-16 px-4 min-h-[400px]',
    card: 'p-6 text-center',
    inline: 'p-4 text-center',
  };

  const icons = {
    page: (
      <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    card: (
      <svg className="w-12 h-12 text-red-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    inline: (
      <svg className="w-8 h-8 text-red-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
  };

  return (
    <div className={cn(variants[variant], className)} role="alert">
      {icons[variant]}
      <h3 className={cn(
        'font-semibold mb-2',
        variant === 'page' && 'text-xl',
        variant === 'card' && 'text-lg',
        variant === 'inline' && 'text-base'
      )}>
        {title}
      </h3>
      <p className={cn(
        'text-lexora-text-muted mb-4',
        variant === 'page' && 'text-base max-w-md',
        variant === 'card' && 'text-sm max-w-xs',
        variant === 'inline' && 'text-sm'
      )}>
        {message}
      </p>

      {showDetails && error && (
        <details className="w-full max-w-md mb-4 text-left">
          <summary className="text-sm text-lexora-text-muted cursor-pointer hover:text-lexora-text">
            Detail Error
          </summary>
          <pre className="mt-2 p-3 bg-lexora-surface border border-lexora-border rounded text-xs text-lexora-text-muted overflow-auto">
            {error instanceof Error ? error.message : String(error)}
            {error instanceof Error && error.stack && `\n\nStack:\n${error.stack}`}
          </pre>
        </details>
      )}

      {onRetry && (
        <Button
          variant="primary"
          onClick={onRetry}
          className={variant === 'inline' ? 'w-auto' : 'w-full sm:w-auto'}
        >
          {retryLabel}
        </Button>
      )}
    </div>
  );
}

export function NetworkErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <ErrorState
      title="Koneksi Bermasalah"
      message="Tidak dapat terhubung ke server. Periksa koneksi internet Anda dan coba lagi."
      onRetry={onRetry}
      retryLabel="Muat Ulang"
    />
  );
}

export function NotFoundState({ resource = 'Halaman' }: { resource?: string }) {
  return (
    <ErrorState
      title={`${resource} Tidak Ditemukan`}
      message={`${resource} yang Anda cari tidak ada atau telah dipindahkan.`}
      onRetry={() => window.history.back()}
      retryLabel="Kembali"
      variant="page"
    />
  );
}

export function ForbiddenState({ onLogin }: { onLogin?: () => void }) {
  return (
    <ErrorState
      title="Akses Ditolak"
      message="Anda tidak memiliki izin untuk mengakses halaman ini."
      onRetry={onLogin}
      retryLabel={onLogin ? 'Masuk' : 'Kembali ke Beranda'}
      variant="page"
    />
  );
}

export function ServerErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <ErrorState
      title="Kesalahan Server"
      message="Terjadi kesalahan di server kami. Tim kami telah diberitahu dan sedang memperbaikinya."
      onRetry={onRetry}
      retryLabel="Coba Lagi"
      variant="page"
    />
  );
}