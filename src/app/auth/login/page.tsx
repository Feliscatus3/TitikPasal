'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Loader2, Mail, Lock, AlertCircle } from 'lucide-react';
import { Header } from '@/components/public/Header';
import { Footer } from '@/components/public/Footer';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { login } from '@/lib/firebase/auth';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login({ email, password, rememberMe });

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push(callbackUrl);
      router.refresh();
    }
  };

  return (
    <>
      <Header />
      <main id="main-content" className="flex-1 pt-16 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-lexora-surface rounded-2xl border border-lexora-border p-8">
            <div className="text-center mb-8">
              <Link href="/" className="inline-flex items-center gap-2 mb-6" aria-label="LEXORA Home">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary-600 to-secondary-500 flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">L</span>
                </div>
                <span className="font-bold text-2xl text-lexora-text">LEXORA</span>
              </Link>
              <h1 className="text-2xl font-bold text-lexora-text mb-2">Masuk ke Akun Anda</h1>
              <p className="text-lexora-text-muted">Atau <Link href="/auth/register" className="text-primary-500 hover:underline">daftar</Link> jika belum punya akun</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3" role="alert">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <Input
                label="Email"
                type="email"
                placeholder="anda@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                disabled={loading}
                leftIcon={<Mail className="w-5 h-5 text-lexora-text-muted" />}
              />

              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  disabled={loading}
                  leftIcon={<Lock className="w-5 h-5 text-lexora-text-muted" />}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-[38px] text-lexora-text-muted hover:text-lexora-text transition-colors"
                  aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-lexora-border text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-lexora-text-muted">Ingat saya</span>
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-primary-500 hover:underline"
                >
                  Lupa Password?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                loading={loading}
              >
                Masuk
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-lexora-text-muted">
                Dengan masuk, Anda menyetujui {' '}
                <Link href="/syarat" className="text-primary-500 hover:underline">Syarat & Ketentuan</Link>
                {' '}dan {' '}
                <Link href="/privasi" className="text-primary-500 hover:underline">Kebijakan Privasi</Link>
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}