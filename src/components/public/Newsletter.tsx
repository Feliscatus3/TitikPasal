'use client';

import { useState } from 'react';
import { Mail, Check, Loader2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface NewsletterProps {
  title?: string;
  description?: string;
  placeholder?: string;
  buttonText?: string;
  variant?: 'default' | 'inline' | 'card';
}

export function Newsletter({
  title = 'Berlangganan Newsletter',
  description = 'Dapatkan berita hukum terbaru, analisis mendalam, dan edukasi hukum langsung di kotak masuk Anda.',
  placeholder = 'Masukkan email Anda',
  buttonText = 'Berlangganan',
  variant = 'default',
}: NewsletterProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || status === 'loading') return;

    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage('Terima kasih telah berlangganan!');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Gagal berlangganan. Silakan coba lagi.');
      }
    } catch {
      setStatus('error');
      setMessage('Terjadi kesalahan. Silakan coba lagi.');
    }
  };

  const variants = {
    default: 'py-16 bg-gradient-to-br from-primary-900/20 via-lexora-surface to-secondary-900/20',
    inline: 'py-8',
    card: 'p-8 bg-white dark:bg-lexora-surface rounded-2xl border border-lexora-border',
  };

  const Icon = status === 'success' ? Check : status === 'error' ? AlertCircle : Mail;

  return (
    <section className={variants[variant]} aria-labelledby="newsletter-heading">
      <div className="container-main">
        <div className="max-w-2xl mx-auto text-center">
          <header className="mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 rounded-full text-sm font-medium mb-3">
              <Mail className="w-4 h-4" aria-hidden="true" />
              Newsletter
            </div>
            <h2 id="newsletter-heading" className="text-2xl sm:text-3xl font-bold text-lexora-text mb-2">
              {title}
            </h2>
            <p className="text-lexora-text-muted">{description}</p>
          </header>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" noValidate>
            <div className="flex-1">
              <label htmlFor="newsletter-email" className="sr-only">
                Email
              </label>
              <Input
                id="newsletter-email"
                type="email"
                placeholder={placeholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === 'loading' || status === 'success'}
                required
                autoComplete="email"
                aria-describedby={status !== 'idle' ? 'newsletter-message' : undefined}
              />
            </div>
            <Button
              type="submit"
              size="lg"
              disabled={status === 'loading' || status === 'success'}
              className="whitespace-nowrap"
            >
              {status === 'loading' && <Loader2 className="w-5 h-5 animate-spin" />}
              {status === 'success' ? (
                <>
                  <Check className="w-5 h-5 mr-2" />
                  Berlangganan
                </>
              ) : (
                buttonText
              )}
            </Button>
          </form>

          {(status === 'success' || status === 'error') && (
            <p
              id="newsletter-message"
              className={cn(
                'mt-4 flex items-center justify-center gap-2 text-sm',
                status === 'success' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              )}
              role="status"
              aria-live="polite"
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {message}
            </p>
          )}

          <p className="mt-4 text-xs text-lexora-text-muted">
            Dengan berlangganan, Anda menyetujui {' '}
            <a href="/privasi" className="underline hover:text-lexora-text transition-colors">
              Kebijakan Privasi
            </a>
            {' '}kami. Tidak ada spam, hanya berita hukum berkualitas.
          </p>
        </div>
      </div>
    </section>
  );
}