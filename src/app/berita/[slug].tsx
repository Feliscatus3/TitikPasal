import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Search, Share2, Bookmark, Menu, X, Clock, User } from "lucide-react";

import { MOCK_ARTICLES } from "@/data/newsData";

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  imageUrl: string;
  author: string;
  date: string;
  readTime: string;
  isBreaking: boolean;
  isLive: boolean;
}

interface RelatedArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  imageUrl: string;
  category: string;
}

export default function ArticleDetail() {
  const router = useRouter();
  const params = useSearchParams();
  const slug = params.get("slug") || "mk-putuskan-uu-cipta-kerja-phk-pengadilan";

  // Find article by slug from mock data
  const article = MOCK_ARTICLES.find((a) => a.slug === slug);

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-[var(--bbc-red)]">Artikel tidak ditemukan</h2>
      </div>
    );
  }

  const [textSize, setTextSize] = useState("1rem");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const increaseSize = () => {
    const size = parseFloat(textSize);
    setTextSize(`${(size + 0.1).toString(10)}rem`);
  };

  const decreaseSize = () => {
    const size = parseFloat(textSize);
    if (size > 0.8) setTextSize(`${(size - 0.1).toString(10)}rem`);
  };

  const relatedArticles: RelatedArticle[] = [
    {
      id: "1",
      title: "Related Article 1",
      slug: "related-1",
      excerpt: "This is a related article",
      imageUrl: article.imageUrl,
    },
    {
      id: "2",
      title: "Related Article 2",
      slug: "related-2",
      excerpt: "Another related piece",
      imageUrl: article.imageUrl,
    },
  ];

  const popularArticles = MOCK_ARTICLES
    .filter((a) => a.slug !== article.slug)
    .slice(0, 3);

  const categories = [
    "Politics",
    "Business",
    "Technology",
    "Entertainment",
    "Sport",
    "Environment",
    "Opinion",
  ];

  return (
    <div className="min-h-screen">
      {/* Top Bar */}
      <div className="bg-[var(--bbc-slate)] text-[var(--foreground)] border-b [border-border]">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[var(--bbc-red)] flex items-center justify-center rounded">
              <Image
                src="/next.svg"
                alt="BBC News"
                width={20}
                height={20}
                className="flex-shrink-0"
              />
            </div>
            <h1 className="text-lg font-bold tracking-tighter">BBC News</h1>
          </div>
          <button
            onClick={() => setIsMenuOpen(true)}
            className="md:hidden p-2 rounded hover:bg-[var(--card)] transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
{isMenuOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-center justify-center">
          <button
            onClick={() => setIsMenuOpen(false)}
            className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <nav className="flex flex-col gap-8 w-full max-w-lg">
            <ul className="flex flex-col gap-4 text-lg">
              <li>
                <a href="/" className="hover:text-[var(--bbc-red)] transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="/berita/mk-putuskan-uu-cipta-kerja-phk-pengadilan" className="hover:text-[var(--bbc-red)] transition-colors">
                  MK Putuskan UU Cipta Kerja
                </a>
              </li>
            </ul>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="mt-6 w-full py-3 rounded-full bg-[var(--bbc-red)] text-white font-medium hover:bg-[var(--accent-red-hover)] transition-colors"
            >
              Masuk
            </button>
          </nav>
        </div>
      </div>
    )}

    {/* Text Size Controls */}
    <div className="mt-8 text-center">
      <button
        onClick={decreaseSize}
        className="rounded bg-[var(--bbc-red)]/10 px-3 py-1.5 text-[var(--bbc-red)] hover:bg-[var(--bbc-red)]/20 transition-colors"
        aria-label="Kurangi ukuran teks"
      >
        A-
      </button>
      <span className="mx-2 text-[var(--muted)]">|</span>
      <button
        onClick={increaseSize}
        className="rounded bg-[var(--bbc-red)]/10 px-3 py-1.5 text-[var(--bbc-red)] hover:bg-[var(--bbc-red)]/20 transition-colors"
        aria-label="Perbesar ukuran teks"
      >
        A+
      </button>
    </div>

      {/* Article Header */}
      <header className="bg-[var(--card)] border-b [border-border]">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">
                {article.title}
              </h1>
              <p className="text-[var(--muted)] text-lg mb-6">
                {article.excerpt}
              </p>
              <div className="flex items-center gap-4 text-sm text-[var(--muted)]">
                <span>
                  <Clock className="w-4 h-4 mr-2" /> {article.date}
                </span>
                <span>
                  <User className="w-4 h-4 mr-2" /> {article.author}
                </span>
                <span>
                  <BookOpen className="w-4 h-4 mr-2" /> {article.readTime}
                </span>
              </div>
            </div>

            {/* Share & Bookmark */}
            <div className="flex flex-col md:flex-row gap-3 md:gap-2">
              <button
                className="flex items-center gap-2 rounded-lg px-4 py-2 bg-[var(--card)] border border-[var(--border)] hover:bg-[var(--bbc-slate)] transition-colors"
                aria-label="Share"
              >
                <Share2 className="w-4 h-4 text-[var(--bbc-red)]" />
                Share
              </button>
              <button
                className="flex items-center gap-2 rounded-lg px-4 py-2 bg-[var(--card)] border border-[var(--border)] hover:bg-[var(--bbc-slate)] transition-colors"
                aria-label="Bookmark"
              >
                <Bookmark className="w-4 h-4 text-[var(--bbc-red)]" />
                Bookmark
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Article Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="prose lg:prose-2xl max-w-none" style={{ fontSize: textSize }}>
          <p style={{ fontSize: textSize }}>
            {article.content}
          </p>

          {/* Drop Cap */}
          <p>
            <span className="first:uppercase first:text-4xl first:float-left first:mr-4 first:py-0 first:pr-2">
              T
            </span>
            his is the beginning of the article content. The drop cap should be stylized
            with a larger initial letter at the start of the first paragraph.
          </p>

          {/* Pull Quote */}
          <blockquote className="mt-8 p-6 bg-[var(--bbc-slate)] rounded-xl border border-[var(--border)]">
            <p className="font-semibold text-[var(--bbc-red)]">
              "Pull quote text - a compelling excerpt from the article that draws
              the reader's attention and emphasizes key points."
            </p>
          </blockquote>
        </div>
      </main>

      {/* Sidebar: Related & Popular */}
      <aside className="lg:w-64 bg-[var(--card)] border-l [border-border] sticky top-6">
        <div className="p-6 border-b [border-border] bg-[var(--bbc-slate)]">
          <h2 className="text-xl font-bold tracking-tight mb-4">Baca Lainnya</h2>
        </div>

        {/* Related Articles */}
        <div className="p-6">
          <h3 className="font-medium mb-4">Artikel Terkait</h3>
          <div className="space-y-3">
            {relatedArticles.map((rel) => (
              <article
                key={rel.id}
                className="flex rounded-xl overflow-hidden bg-[var(--bbc-slate)] border border-[var(--border)] hover:shadow-lg hover:shadow-[var(--bbc-red)/20] transition-all duration-300"
              >
                <Image
                  src={rel.imageUrl}
                  alt={rel.title}
                  className="w-full h-24 object-cover"
                />
                <div className="p-3">
                  <h4 className="font-medium line-clamp-1">
                    {rel.title}
                  </h4>
                  <p className="text-[var(--muted)] text-sm line-clamp-1">
                    {rel.excerpt}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Popular Articles */}
        <div className="p-6">
          <h3 className="font-medium mb-4">Paling Populer</h3>
          <ol className="list-decimal list-inside space-y-3">
            {[1, 2, 3].map((rank) => (
              <li key={rank} className="flex items-start gap-3">
                <span className="text-2xl font-bold text-[var(--bbc-red)]">{rank}</span>
                <div className="flex-1">
                  <h4 className="font-medium">Artikel Populer</h4>
                  <p className="text-[var(--muted)] text-sm line-clamp-1">
                    Artikel populer lainnya
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </aside>
    </div>
  );
}