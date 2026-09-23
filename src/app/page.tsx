"use client";

import Image from "next/image";
import { MOCK_ARTICLES, MOCK_CATEGORIES } from "@/lib/mockData";
import { Search, Flame, Clock, BookOpen, TrendingUp, Scale, Menu, X, ChevronRight } from "lucide-react";

export default function Home() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const now = new Date();

  const filteredArticles = MOCK_ARTICLES.filter(
    (article) =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const featuredArticle = MOCK_ARTICLES.find((a) => a.isFeatured);
  const breakingArticles = MOCK_ARTICLES.filter((a) => a.isBreaking);
  const secondaryArticles = MOCK_ARTICLES.filter(
    (a) => !a.isFeatured && !a.isBreaking
  );

  const categories = [
    "Putusan MK",
    "Bedah Pasal",
    "Edukasi Hukum",
    "KUHP & Pidana",
    "Hak Asasi",
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-[var(--border)] bg-[var(--sidebar)] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Branding */}
          <div className="flex items-center gap-3">
            <Image
              src="/next.svg"
              alt="Titik Pasal"
              width={40}
              height={40}
              className="flex-shrink-0"
            />
            <h1 className="text-xl font-bold tracking-tighter text-[var(--foreground)]">
              Titik Pasal
            </h1>
          </div>

          {/* Menu Button for mobile */}
          <button
            onClick={() => setIsMenuOpen(true)}
            className="md:hidden p-2 rounded-lg hover:bg-[var(--card)] transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-zxl z-40 flex items-center justify-center">
            <button
              onClick={() => setIsMenuOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <nav className="flex flex-col gap-6 w-full max-w-lg">
              <ul className="flex flex-col gap-4 text-lg">
                <li>
                  <a
                    href="#berita-terbaru"
                    className="hover:text-[var(--accent-cyan)] transition-colors"
                  >
                    Berita Terbaru
                  </a>
                </li>
                <li>
                  <a
                    href="#bedah-pasal"
                    className="hover:text-[var(--accent-cyan)] transition-colors"
                  >
                    Bedah Pasal
                  </a>
                </li>
                <li>
                  <a
                    href="#kategori"
                    className="hover:text-[var(--accent-cyan)] transition-colors"
                  >
                    Kategori
                  </a>
                </li>
                <li>
                  <a
                    href="#cari"
                    className="hover:text-[var(--accent-cyan)] transition-colors"
                  >
                    Cari
                  </a>
                </li>
              </ul>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="mt-6 w-full py-3 rounded-full bg-[var(--accent-purple)] text-white font-medium text-sm hover:bg-[var(--accent-purple-hover)] transition-colors"
              >
                Masuk/Aktifkan Akun
              </button>
            </nav>
          </div>
        )}
      </header>

      {/* Breaking News Ticker */}
      <section className="border-b border-[var(--border)] bg-[var(--sidebar)]">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center gap-3 overflow-x-auto scrolling">
          <div className="flex items-center gap-8 px-3">
            {breakingArticles.map((article) => (
              <div
                key={article.id}
                className={`flex items-center gap-3 px-3 border-r border-[var(--border)] last:border-0 last:pr-0`}
              >
                <Flame
                  className="w-4 h-4 text-[var(--accent-cyan)] animate-pulse"
                />
                <span className="text-sm text-[var(--muted)] font-medium">
                  {article.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <section id="berita-terbaru" className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight mb-6">
            Berita Terbaru
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 gap-8">
            {/* Left: Featured Article */}
            {featuredArticle && (
              <article
                key={featuredArticle.id}
                className="group rounded-2xl overflow-hidden bg-[var(--card)] border border-[var(--border)] hover:shadow-lg hover:shadow-[var(--accent-purple)/20] transition-all duration-300"
              >
                <Image
                  src={featuredArticle.imageUrl}
                  alt={featuredArticle.title}
                  className="h-64 w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  width={800}
                  height={400}
                  priority
                />
                <div className="p-5">
                  <span
                    className={`inline-block px-2 py-1 text-xs font-medium rounded mr-2 mb-3 ${
                      featuredArticle.isBreaking
                        ? "bg-[var(--accent-cyan)] text-white"
                        : "bg-[var(--accent-purple)] text-white"
                    }`}
                  >
                    {featuredArticle.isBreaking
                      ? "Breaking"
                      : featuredArticle.category}
                  </span>
                  <h3
                    className="text-xl group-hover:text-[var(--accent-purple)] transition-colors mb-4"
                  >
                    {featuredArticle.title}
                  </h3>
                  <p className="text-[var(--muted)] leading-relaxed mb-6">
                    {featuredArticle.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Image
                        src="https://images.unsplash.com/photo-1594864661045-16e2f7f0d7dc?w=100&h=100&fit=crop&crop=face"
                        alt={featuredArticle.author}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      <span className="text-sm text-[var(--muted)]">
                        {featuredArticle.author}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[var(--muted)]">
                      <Clock className="w-4 h-4" />
                      {featuredArticle.readTime}
                    </div>
                  </div>
                  <a
                    href={`/artikel/${featuredArticle.slug}`}
                    className="mt-4 inline-block text-[var(--accent-cyan)] font-medium hover:underline"
                  >
                    Baca Selengkapnya
                    <ChevronRight className="ml-1 w-4 h-4" />
                  </a>
                </div>
              </article>
            )}

            {/* Right: 3 Secondary Stories */}
            <div className="space-y-4">
              {secondaryArticles
                .sort(() => Math.random() - 0.5)
                .slice(0, 3)
                .map((article) => (
                  <article
                    key={article.id}
                    className="flex flex-col h-100 rounded-xl overflow-hidden bg-[var(--card)] border border-[var(--border)] hover:shadow-lg hover:shadow-[var(--accent-purple)/20] transition-all duration-300"
                  >
                    <Image
                      src={article.imageUrl}
                      alt={article.title}
                      className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="p-4 flex-1">
                      <span
                        className={`inline-block px-2 py-1 text-xs font-medium rounded mb-3 ${
                          article.isBreaking
                            ? "bg-[var(--accent-cyan)] text-white"
                            : "bg-[var(--accent-purple)] text-white"`
                        }`}
                      >
                        {article.isBreaking ? "Breaking" : article.category}
                      </span>
                      <h4 className="text-lg font-medium group-hover:text-[var(--accent-purple)] transition-colors mb-3">
                        {article.title}
                      </h4>
                      <p className="text-[var(--muted)] line-clamp-2">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2 text-xs text-[var(--muted)]">
                          <Clock className="w-3 h-3" /> {article.readTime}
                        </div>
                        <a
                          href={`/artikel/${article.slug}`}
                          className="text-[var(--accent-cyan)] font-medium hover:underline"
                        >
                          Baca
                        </a>
                      </div>
                    </div>
                  </article>
                ))}
            </div>
          </div>
        </section>

        {/* Bedah Pasal & Edukasi Hukum Section */}
        <section id="bedah-pasal" className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight mb-8">
            Bedah Pasal & Edukasi Hukum
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Pasal 27A UU ITE */}
            <article
              className="group rounded-xl overflow-hidden bg-[var(--card)] border border-[var(--border)] hover:shadow-lg hover:shadow-[var(--accent-purple)/20] transition-all duration-300"
            >
              <div className="p-5">
                <span
                  className="text-xs font-medium uppercase tracking-wider mb-4 block"
                >
                  Pasal 27A UU ITE
                </span>
                <h3 className="text-xl font-bold mb-4 group-hover:text-[var(--accent-purple)] transition-colors">
                  Apa itu Pasal 27A UU ITE?
                </h3>
                <p className="text-[var(--muted)] leading-relaxed">
                  Pasal 27A UU ITE (Undang-Undang Informasi dan Telekomunikasi Elektronik) merupakan salah satu
                  kontroversi hukum terpanas di Indonesia. Pasal ini mengatur tentang larangan penyebaran
                  informasi yang memuat ujaran Kebencian, Penghinaan terhadap Tumpal, atau kelompok
                  tertentu. Namun, pasal ini sering dikritik karena tipsinya ambigu dan bisa digunakan
                  untuk menindas kebebasan berpendapat.
                </p>
                <a
                  href="/artikel/bedah-pasal-27a-uu-ite"
                  className="mt-4 inline-block text-[var(--accent-cyan)] font-medium hover:underline flex items-center gap-2"
                >
                  Baca Selengkapnya
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </article>

            {/* UU PDP */}
            <article
              className="group rounded-xl overflow-hidden bg-[var(--card)] border border-[var(--border)] hover:shadow-lg hover:shadow-[var(--accent-purple)/20] transition-all duration-300"
            >
              <div className="p-5">
                <span
                  className="text-xs font-medium uppercase tracking-wider mb-4 block"
                >
                  UU PDP
                </span>
                <h3 className="text-xl font-bold mb-4 group-hover:text-[var(--accent-purple)] transition-colors">
                  Panduan UU Perlindungan Data Pribadi
                </h3>
                <p className="text-[var(--muted)] leading-relaxed">
                  UU Perlindungan Data Pribadi (PDP) No. 27 Tahun 2022 telah berlaku penuh mulai 2024.
                  Undang-undang ini melindungi hak subjek data dalam mengontrol informasi pribadi mereka.
                  Pengendali data wajib mendapatkan persetujuan eksplisit sebelum memproses data pribadi,
                  serta harus memberikan akses bagi subjek data untuk melihat, memperbaiki, atau menghapus
                  data pribadi mereka.
                </p>
                <a
                  href="/artikel/panduan-uu-pdp"
                  className="mt-4 inline-block text-[var(--accent-cyan)] font-medium hover:underline flex items-center gap-2"
                >
                  Baca Selengkapnya
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </article>

            {/* Hak Asasi */}
            <article
              className="group rounded-xl overflow-hidden bg-[var(--card)] border border-[var(--border)] hover:shadow-lg hover:shadow-[var(--accent-purple)/20] transition-all duration-300"
            >
              <div className="p-5">
                <span
                  className="text-xs font-medium uppercase tracking-wider mb-4 block"
                >
                  Hak Asasi
                </span>
                <h3 className="text-xl font-bold mb-4 group-hover:text-[var(--accent-purple)] transition-colors">
                  Memahami Hak Asasi dalam Konteks Hukum
                </h3>
                <p className="text-[var(--muted)] leading-relaxed">
                  Hak Asasi Manusia (HAM) adalah fondasi dari setiap sistem hukum modern. Di Indonesia, HAM
                  diatur dalam Undang-Undang No. 39 Tahun 1999. Penting untuk memahami batas-batas hak
                  kita serta kewajiban kita sebagai warga negara untuk menjaga kebersamaan dalam komunitas.
                </p>
                <a
                  href="/artikel/hak-asasi-manusia"
                  className="mt-4 inline-block text-[var(--accent-cyan)] font-medium hover:underline flex items-center gap-2"
                >
                  Baca Selengkapnya
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </article>
          </div>
        </section>

        {/* Sidebar: Most Read / Putusan Landmark */}
        <section id="kategori" className="mb-12">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left: Most Read Articles */}
            <div className="flex-1">
              <h2 className="text-2xl font-bold tracking-tight mb-6">
                Most Read
              </h2>
              <div className="space-y-4">
                {/* Ranked List */}
                <ol className="list-decimal list-inside space-y-3">
                  {MOCK_ARTICLES
                    .filter((a) => !a.isFeatured && !a.isBreaking)
                    .sort((a, b) => parseInt(b.readTime) - parseInt(a.readTime))
                    .slice(0, 5)
                    .map((article, index) => (
                      <li
                        key={article.id}
                        className="flex items-start gap-3 rounded-xl p-4 bg-[var(--card)] border border-[var(--border)]"
                      >
                        <span className="text-2xl font-bold text-[var(--accent-purple)]">
                          {index + 1}
                        </span>
                        <div className="flex-1">
                          <h4 className="font-medium mb-1">
                            {article.title}
                          </h4>
                          <p className="text-[var(--muted)] text-sm line-clamp-1">
                            {article.excerpt}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-[var(--muted)]">
                          <Clock className="w-3 h-3" /> {article.readTime}
                        </div>
                      </li>
                    ))}
                </ol>
              </div>
            </div>

            {/* Right: Category Navigation */}
            <div className="lg:w-64">
              <h2 className="text-xl font-bold tracking-tight mb-6">
                Kategori
              </h2>
              <div className="space-y-2">
                {MOCK_CATEGORIES.map((category) => (
                  <button
                    key={category.id}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors hover:text-white hover:bg-[var(--accent-purple)] ${
                      /* Active state would be determined by current route */
                      ""
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-[var(--accent-cyan)]" />
                    {category.name}
                    <span className="ml-auto text-[var(--muted)]">({category.count})</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Search Section */}
        <section id="cari" className="mb-12">
          <div className="max-w-md mx-auto rounded-2xl bg-[var(--card)] border border-[var(--border)] p-6">
            <h2 className="text-xl font-bold mb-4">Cari Artikel</h2>
            <form
              className="flex gap-3"
              onSubmit={(e) => {
                e.preventDefault();
                // Handle search
              }}
            >
              <div className="relative flex-1">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted)]"
                />
                <input
                  type="text"
                  placeholder="Cari judul, penulis, atau kategori..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-3 rounded-lg bg-[var(--background)] text-[var(--foreground)] outline-none placeholder-[var(--muted)]"
                />
              </div>
              <button
                type="submit"
                className="py-3 rounded-lg bg-[var(--accent-purple)] text-white font-medium hover:bg-[var(--accent-purple-hover)] transition-colors"
              >
                Cari
              </button>
            </form>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] bg-[var(--sidebar)] py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="text-xl font-bold mb-4">Titik Pasal</h3>
              <p className="text-[var(--muted)]">
                Sumber referensi hukum edukasi terpercaya. Kami memberikan analisis dan pemahaman
                tentang perkembangan hukum di Indonesia untuk kepentingan publik.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-4">Artikel Terbaru</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="/"
                    className="hover:text-[var(--accent-cyan)] transition-colors text-[var(--muted)]"
                  >
                    MK Putuskan UU Cipta Kerja
                  </a>
                </li>
                <li>
                  <a
                    href="/"
                    className="hover:text-[var(--accent-cyan)] transition-colors text-[var(--muted)]"
                  >
                    Bedah Pasal 27 UU ITE
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">Kategori</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="/kategori/putusan-mk"
                    className="hover:text-[var(--accent-cyan)] transition-colors text-[var(--muted)]"
                  >
                    Putusan MK
                  </a>
                </li>
                <li>
                  <a
                    href="/kategori/bedah-pasal"
                    className="hover:text-[var(--accent-cyan)] transition-colors text-[var(--muted)]"
                  >
                    Bedah Pasal
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">Hubungi Kami</h4>
              <p className="text-[var(--muted)] text-sm space-y-3">
                <span>Email: contact@tikipasal.id</span>
                <span>Instagram: @tikipasal</span>
              </p>
            </div>
          </div>
          <div className="pt-8 border-t border-[var(--border)] flex flex-col md:flex-row justify-between items-center gap-4 px-4">
            <p className="text-[var(--muted)] text-sm">
              &copy; {new Date().getFullYear()} Titik Pasal. Hak cipta dilindungi.
            </p>
            <div className="flex gap-6">
              <a
                href="#"
                className="hover:text-[var(--accent-cyan)] transition-colors text-[var(--muted)]"
              >
                Kebijakan Privasi
              </a>
              <a
                href="#"
                className="hover:text-[var(--accent-cyan)] transition-colors text-[var(--muted)]"
              >
                Syarat & Ketentuan
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}