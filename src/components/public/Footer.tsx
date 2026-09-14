'use client';

import Link from 'next/link';
import { Facebook, Twitter, Instagram, Youtube, Linkedin, Mail, Phone, MapPin, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const footerNavigation = {
  'Tentang Kami': [
    { name: 'Profil', href: '/tentang/profil' },
    { name: 'Visi & Misi', href: '/tentang/visi-misi' },
    { name: 'Tim Editorial', href: '/tentang/tim' },
    { name: 'Karir', href: '/karir' },
  ],
  'Layanan': [
    { name: 'Berita Hukum', href: '/berita' },
    { name: 'Analisis Hukum', href: '/kategori/analisis' },
    { name: 'Edukasi Hukum', href: '/kategori/edukasi' },
    { name: 'Opini', href: '/kategori/opini' },
  ],
  'Hukum': [
    { name: 'Hukum Pidana', href: '/kategori/hukum-pidana' },
    { name: 'Hukum Perdata', href: '/kategori/hukum-perdata' },
    { name: 'Hukum Tata Negara', href: '/kategori/hukum-tata-negara' },
    { name: 'Hukum Internasional', href: '/kategori/hukum-internasional' },
  ],
  'Dukungan': [
    { name: 'Bantuan', href: '/bantuan' },
    { name: 'Kebijakan Privasi', href: '/privasi' },
    { name: 'Syarat & Ketentuan', href: '/syarat' },
    { name: 'Kontak', href: '/kontak' },
  ],
};

const socialLinks = [
  { name: 'Facebook', href: 'https://facebook.com/lexora', icon: Facebook },
  { name: 'Twitter', href: 'https://twitter.com/lexora', icon: Twitter },
  { name: 'Instagram', href: 'https://instagram.com/lexora', icon: Instagram },
  { name: 'YouTube', href: 'https://youtube.com/lexora', icon: Youtube },
  { name: 'LinkedIn', href: 'https://linkedin.com/company/lexora', icon: Linkedin },
];

export function Footer() {
  return (
    <footer className="bg-lexora-surface border-t border-lexora-border" role="contentinfo">
      <div className="container-main py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-12">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4" aria-label="LEXORA Home">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-600 to-secondary-500 flex items-center justify-center">
                <span className="text-white font-bold text-xl">L</span>
              </div>
              <span className="font-bold text-2xl text-lexora-text">LEXORA</span>
            </Link>
            <p className="text-lexora-text-muted text-base leading-relaxed mb-6 max-w-xs">
              Portal berita dan edukasi hukum terpercaya. Menyajikan berita, analisis, opini, dan edukasi hukum terkini dari Indonesia dan dunia.
            </p>
            <div className="flex items-center gap-6">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-lexora-border flex items-center justify-center text-lexora-text-muted hover:text-lexora-text hover:bg-lexora-surface-hover transition-colors"
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lexora-text mb-4">Tentang Kami</h3>
            <ul className="space-y-2" role="list">
              {footerNavigation['Tentang Kami'].map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-lexora-text-muted hover:text-lexora-text transition-colors flex items-center gap-2"
                  >
                    <ChevronRight className="w-4 h-4 flex-shrink-0" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lexora-text mb-4">Layanan</h3>
            <ul className="space-y-2" role="list">
              {footerNavigation['Layanan'].map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-lexora-text-muted hover:text-lexora-text transition-colors flex items-center gap-2"
                  >
                    <ChevronRight className="w-4 h-4 flex-shrink-0" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lexora-text mb-4">Kategori Hukum</h3>
            <ul className="space-y-2" role="list">
              {footerNavigation['Hukum'].map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-lexora-text-muted hover:text-lexora-text transition-colors flex items-center gap-2"
                  >
                    <ChevronRight className="w-4 h-4 flex-shrink-0" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lexora-text mb-4">Kontak</h3>
            <address className="not-italic space-y-3 text-lexora-text-muted">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5 text-primary-500" />
                <span>Jl. Sudirman No. 123, Jakarta Pusat 10220</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 flex-shrink-0 text-primary-500" />
                <a href="tel:+62211234567" className="hover:text-lexora-text transition-colors">+62 21 1234 567</a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 flex-shrink-0 text-primary-500" />
                <a href="mailto:redaksi@lexora.id" className="hover:text-lexora-text transition-colors">redaksi@lexora.id</a>
              </div>
            </address>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-lexora-border">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-lexora-text-muted text-sm">
              © {new Date().getFullYear()} LEXORA. Hak cipta dilindungi undang-undang.
            </p>
            <div className="flex items-center gap-6 text-sm text-lexora-text-muted">
              <Link href="/privasi" className="hover:text-lexora-text transition-colors">Kebijakan Privasi</Link>
              <Link href="/syarat" className="hover:text-lexora-text transition-colors">Syarat & Ketentuan</Link>
              <Link href="/disclaimer" className="hover:text-lexora-text transition-colors">Disclaimer</Link>
              <Link href="/pedoman-media" className="hover:text-lexora-text transition-colors">Pedoman Media Siber</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}