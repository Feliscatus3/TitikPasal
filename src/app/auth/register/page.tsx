'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Loader2, Mail, Lock, User, AlertCircle, CheckCircle } from 'lucide-react';
import { Header } from '@/components/public/Header';
import { Footer } from '@/components/public/Footer';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { register } from '@/lib/firebase/auth';

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Nama lengkap diperlukan';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Nama minimal 2 karakter';
    }

    if (!email.trim()) {
      newErrors.email = 'Email diperlukan';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Format email tidak valid';
    }

    if (!password) {
      newErrors.password = 'Password diperlukan';
    } else if (password.length < 6) {
      newErrors.password = 'Password minimal 6 karakter';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Password tidak cocok';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    setErrors({});

    const result = await register({ name: name.trim(), email: email.trim().toLowerCase(), password });

    if (result.error) {
      setErrors({ form: result.error });
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
      setTimeout(() => {
        router.push('/auth/login?registered=true');
        router.refresh();
      }, 2000);
    }
  };

  const passwordStrength = password.length === 0 ? 0 :
    password.length < 6 ? 1 :
    password.length < 10 ? 2 : 3;

  const strengthColors = [
    'bg-lexora-border',
    'bg-red-500',
    'bg-yellow-500',
    'bg-green-500',
  ];

  const strengthLabels = ['', 'Lemah', 'Sedang', 'Kuat'];

  if (success) {
    return (
      <>
        <Header />
        <main id="main-content" className="flex-1 pt-16 flex items-center justify-center py-12 px-4">
          <div className="w-full max-w-md text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h1 className="text-2xl font-bold text-lexora-text mb-2">Pendaftaran Berhasil!</h1>
            <p className="text-lexora-text-muted">Mengarahkan ke halaman masuk...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

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
              <h1 className="text-2xl font-bold text-lexora-text mb-2">Buat Akun Baru</h1>
              <p className="text-lexora-text-muted">Sudah punya akun? <Link href="/auth/login" className="text-primary-500 hover:underline">Masuk</Link></p>
            </div>

            {errors.form && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3" role="alert">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-red-600 dark:text-red-400 text-sm">{errors.form}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <Input
                label="Nama Lengkap"
                type="text"
                placeholder="Nama lengkap Anda"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
                disabled={loading}
                error={errors.name}
                leftIcon={<User className="w-5 h-5 text-lexora-text-muted" />}
              />

              <Input
                label="Email"
                type="email"
                placeholder="anda@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                disabled={loading}
                error={errors.email}
                leftIcon={<Mail className="w-5 h-5 text-lexora-text-muted" />}
              />

              <div className="space-y-2">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Minimal 6 karakter"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  disabled={loading}
                  error={errors.password}
                  leftIcon={<Lock className="w-5 h-5 text-lexora-text-muted" />}
                />
                <div className="h-1.5 bg-lexora-border rounded-full overflow-hidden">
                  <div
                    className="h-full transition-all duration-300"
                    style={{
                      width: `${(passwordStrength / 3) * 100}%`,
                      backgroundColor: strengthColors[passwordStrength],
                    }}
                  />
                </div>
                <p className="text-xs text-lexora-text-muted">Kekuatan password: {strengthLabels[passwordStrength]}</p>
              </div>

              <Input
                label="Konfirmasi Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Ulangi password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
                disabled={loading}
                error={errors.confirmPassword}
                leftIcon={<Lock className="w-5 h-5 text-lexora-text-muted" />}
              />

              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  required
                  id="terms"
                  className="mt-1 w-4 h-4 rounded border-lexora-border text-primary-600 focus:ring-primary-500"
                />
                <label htmlFor="terms" className="text-sm text-lexora-text-muted">
                  Saya menyetujui {' '}
                  <Link href="/syarat" className="text-primary-500 hover:underline">Syarat & Ketentuan</Link>
                  {' '}dan {' '}
                  <Link href="/privasi" className="text-primary-500 hover:underline">Kebijakan Privasi</Link>
                </label>
              </div>

              {errors.terms && (
                <p className="text-sm text-red-600 dark:text-red-400" role="alert">{errors.terms}</p>
              )}

              <Button
                type="submit"
                className="w-full"
                size="lg"
                loading={loading}
              >
                Daftar
              </Button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}