"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Calendar, Clock, Eye, Share2, MessageSquare, ChevronLeft, ChevronRight, Facebook, Twitter, Send, Copy, Check, Bookmark, Tag, User, ArrowLeft } from "lucide-react";
import { cn, formatDate, formatRelativeTime, calculateReadingTime, slugify } from "@/lib/utils";
import type { Article, Category } from "@/types";
import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { ArticleCard } from "@/components/public/ArticleCard";
import { CategoryNav } from "@/components/public/CategoryNav";
import { MostRead } from "@/components/public/MostRead";
import { Button } from "@/components/ui/Button";

const shareUrls = {
  facebook: (url: string) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  twitter: (url: string, title: string) => `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  whatsapp: (url: string, title: string) => `https://wa.me/?text=${encodeURIComponent(`${title}\n${url}`)}`,
  telegram: (url: string, title: string) => `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
};

export function ArticleDetail({ article, relatedArticles, mostReadArticles, categories }: { article: Article; relatedArticles: Article[]; mostReadArticles: Article[]; categories: Category[] }) {
  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const articleUrl = typeof window !== "undefined" ? window.location.href : "";
  const readingTime = article.readingTime || calculateReadingTime(article.content);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(articleUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const share = (platform: keyof typeof shareUrls) => {
    const url = shareUrls[platform](articleUrl, article.title);
    window.open(url, "_blank", "width=600,height=400");
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.excerpt,
    image: article.featuredImage ? [article.featuredImage] : [],
    datePublished: article.publishedAt?.toISOString() || article.createdAt.toISOString(),
    dateModified: article.updatedAt.toISOString(),
    author: {
      "@type": "Person",
      name: article.authorName,
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/penulis/${article.authorId}`,
    },
    publisher: {
      "@type": "Organization",
      name: "LEXORA",
      logo: {
        "@type": "ImageObject",
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": articleUrl,
    },
  };

  const breadcrumbItems = [
    { name: "Beranda", href: "/" },
    { name: "Berita", href: "/berita" },
    { name: article.categoryName, href: `/kategori/${article.categoryId}` },
    { name: article.title, href: articleUrl, current: true },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />

      <main id="main-content" className="flex-1 pt-16">
        <nav className="container-main py-4" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-sm text-lexora-text-muted flex-wrap" role="list">
            {breadcrumbItems.map((item, index) => (
              <li key={item.name} className="flex items-center gap-2">
                {index > 0 && <ChevronLeft className="w-4 h-4 flex-shrink-0" />}
                {item.current ? (
                  <span className="text-lexora-text font-medium truncate max-w-[200px]" aria-current="page">
                    {item.name}
                  </span>
                ) : (
                  <Link href={item.href} className="hover:text-lexora-text transition-colors">
                    {item.name}
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </nav>

        <article className="container-main pb-16">
          <header className="mb-8">
            {article.categoryName && (
              <Link
                href={`/kategori/${article.categoryId}`}
                className="inline-flex items-center px-3 py-1 text-sm font-medium bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 rounded-full mb-4"
              >
                {article.categoryName}
              </Link>
            )}

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-lexora-text leading-tight mb-4">
              {article.title}
            </h1>

            {article.subtitle && (
              <p className="text-lg sm:text-xl text-lexora-text-muted mb-6 leading-relaxed max-w-3xl">
                {article.subtitle}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="flex items-center gap-3">
                {article.authorPhoto ? (
                  <Image
                    src={article.authorPhoto}
                    alt=""
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-medium">
                    {article.authorName.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <Link
                    href={`/penulis/${article.authorId}`}
                    className="font-medium text-lexora-text hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    {article.authorName}
                  </Link>
                  <p className="text-sm text-lexora-text-muted">{article.categoryName}</p>
                </div>
              </div>

              <div className="flex items-center gap-6 text-sm text-lexora-text-muted border-l border-lexora-border pl-4 ml-4">
                <time dateTime={article.publishedAt?.toISOString() || article.createdAt.toISOString()} className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {article.publishedAt ? formatDate(article.publishedAt) : formatDate(article.createdAt)}
                </time>
                {article.updatedAt > (article.publishedAt || article.createdAt) && (
                  <time dateTime={article.updatedAt.toISOString()} className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    Diperbarui {formatRelativeTime(article.updatedAt)}
                  </time>
                )}
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {readingTime} menit baca
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {article.views.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-4 border-t border-lexora-border" role="group" aria-label="Bagikan artikel">
              <span className="text-sm text-lexora-text-muted">Bagikan:</span>
              <button onClick={() => share("facebook")} className="p-2 rounded-lg text-lexora-text-muted hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors" aria-label="Bagikan ke Facebook">
                <Facebook className="w-5 h-5" />
              </button>
              <button onClick={() => share("twitter")} className="p-2 rounded-lg text-lexora-text-muted hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors" aria-label="Bagikan ke X">
                <Twitter className="w-5 h-5" />
              </button>
              <button onClick={() => share("whatsapp")} className="p-2 rounded-lg text-lexora-text-muted hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors" aria-label="Bagikan ke WhatsApp">
                <Send className="w-5 h-5" />
              </button>
              <button onClick={() => share("telegram")} className="p-2 rounded-lg text-lexora-text-muted hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors" aria-label="Bagikan ke Telegram">
                <MessageSquare className="w-5 h-5" />
              </button>
              <button onClick={copyLink} className="p-2 rounded-lg text-lexora-text-muted hover:text-lexora-text hover:bg-lexora-surface transition-colors" aria-label={copied ? "Tautin disalin" : "Salin tautan"}>
                {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
              </button>
              <button onClick={() => setBookmarked(!bookmarked)} className={cn("p-2 rounded-lg transition-colors", bookmarked ? "text-yellow-500" : "text-lexora-text-muted hover:text-lexora-text hover:bg-lexora-surface")} aria-label={bookmarked ? "Hapus bookmark" : "Simpan bookmark"}>
                <Bookmark className={cn("w-5 h-5", bookmarked && "fill-current")} />
              </button>
            </div>
          </header>

          {article.featuredImage && (
            <figure className="mb-8">
              <Image
                src={article.featuredImage}
                alt={article.featuredImageAlt || article.title}
                fill
                className="rounded-xl object-cover"
                sizes="(max-width: 768px) 100vw, 80vw"
                priority
              />
              {(article.featuredImageCaption || article.featuredImageCredit) && (
                <figcaption className="mt-2 text-sm text-lexora-text-muted text-center">
                  {article.featuredImageCaption}
                  {article.featuredImageCredit && ` | ${article.featuredImageCredit}`}
                </figcaption>
              )}
            </figure>
          )}

          <div className="prose prose-lg dark:prose-invert max-w-none article-content" dangerouslySetInnerHTML={{ __html: article.content }} />

          {article.tags.length > 0 && (
            <footer className="mt-12 pt-8 border-t border-lexora-border">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Tag className="w-5 h-5 text-lexora-text-muted" aria-hidden="true" />
                <span className="text-sm font-medium text-lexora-text">Tag:</span>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/cari?q=${encodeURIComponent(tag)}`}
                      className="px-3 py-1 text-sm bg-lexora-surface text-lexora-text-muted hover:text-lexora-text hover:bg-lexora-surface-hover border border-lexora-border rounded-full transition-colors"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium text-lexora-text">Bagikan:</span>
                <button onClick={() => share("facebook")} className="btn-ghost text-sm">
                  <Facebook className="w-4 h-4 mr-1" /> Facebook
                </button>
                <button onClick={() => share("twitter")} className="btn-ghost text-sm">
                  <Twitter className="w-4 h-4 mr-1" /> X
                </button>
                <button onClick={() => share("whatsapp")} className="btn-ghost text-sm">
                  <Send className="w-4 h-4 mr-1" /> WhatsApp
                </button>
                <button onClick={() => share("telegram")} className="btn-ghost text-sm">
                  <MessageSquare className="w-4 h-4 mr-1" /> Telegram
                </button>
              </div>
            </footer>
          )}

          <section className="mt-12 pt-8 border-t border-lexora-border" aria-labelledby="author-heading">
            <h2 id="author-heading" className="sr-only">Penulis</h2>
            <div className="flex gap-4 p-6 bg-lexora-surface rounded-xl">
              {article.authorPhoto ? (
                <Image
                  src={article.authorPhoto}
                  alt=""
                  width={80}
                  height={80}
                  className="rounded-full flex-shrink-0 object-cover"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                  {article.authorName.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex-1">
                <Link href={`/penulis/${article.authorId}`} className="font-semibold text-lexora-text hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  {article.authorName}
                </Link>
                <p className="text-lexora-text-muted text-sm mt-1">Penulis di LEXORA</p>
                <div className="flex items-center gap-4 mt-3 text-sm text-lexora-text-muted">
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-4 h-4" />
                    {relatedArticles.length} artikel
                  </span>
                </div>
              </div>
            </div>
          </section>

          {relatedArticles.length > 0 && (
            <section className="mt-12" aria-labelledby="related-heading">
              <h2 id="related-heading" className="section-title mb-6">Artikel Terkait</h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {relatedArticles.map((relatedArticle) => (
                  <ArticleCard
                    key={relatedArticle.id}
                    article={relatedArticle}
                    variant="default"
                    showCategory
                    showAuthor
                    showDate
                    showReadingTime
                  />
                ))}
              </div>
            </section>
          )}

          {mostReadArticles.length > 0 && (
            <MostRead
              articles={mostReadArticles.filter((a) => a.id !== article.id)}
              title="Paling Dibaca"
              limit={5}
            />
          )}
        </article>
      </main>

      <Footer />
    </>
  );
}