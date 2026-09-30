"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { Search, Flame, Clock, BookOpen, TrendingUp, Scale, Menu, X, ChevronRight } from "lucide-react";

import { MOCK_ARTICLES, MOCK_CATEGORIES } from "@/data/newsData";
import { TopBar } from "@/components/header";
import { MainHeader } from "@/components/main-header";
import { LiveTicker } from "@/components/live-ticker";
import { NewsCard } from "@/components/news-card";
import { HeroSection } from "@/components/hero-section";
import { Sidebar } from "@/components/sidebar";

export default function Home() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") || "home";
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
      <TopBar setDarkMode={() => {}} />

      {/* Main Header with Nav + Ticker */}
      <MainHeader setDarkMode={() => {}} />

      {/* Breaking News Ticker */}
      <section className="border-b [border-border] bg-[var(--bbc-slate)]">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center gap-3 overflow-x-auto scrolling">
          <div className="flex items-center gap-8 px-3">
            {breakingArticles.map((article) => (
              <div
                key={article.id}
                className={`flex items-center gap-3 px-3 border-r border-[var(--border)] last:border-0 last:pr-0`}
              >
                <Flame
                  className="w-4 h-4 text-[var(--bbc-red)] animate-pulse"
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
        <HeroSection
          featuredArticle={featuredArticle!}
          secondaryArticles={secondaryArticles}
        />

        {/* Top Stories Grid */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight mb-6">
            Top Stories
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {MOCK_ARTICLES
              .filter((a) => !a.isFeatured && !a.isBreaking)
              .slice(0, 8)
              .map((article) => (
                <NewsCard
                  key={article.id}
                  article={article}
                  showMeta
                />
              ))}
          </div>
        </section>

        {/* Popular Articles Section */}
        <section id="paling-banyak-dibaca" className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight mb-6">
            Paling Banyak Dibaca
          </h2>
          <div className="space-y-4">
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
                    <span className="text-2xl font-bold text-[var(--bbc-red)]">
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
        </section>

        {/* Live Coverage Block */}
        <section className="mb-12">
          <LiveTicker
            articles={breakingArticles.filter((a) => a.isLive)}
            onArticleClick={() => {}}
          />
        </section>

        {/* Video/Multimedia Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight mb-6">
            Video & Multimedia
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[1, 2, 3].map((index) => (
              <div
                key={index}
                className="rounded-xl overflow-hidden bg-[var(--card)] border border-[var(--border)]"
              >
                <div className="h-48 w-full bg-gradient-to-b from-black/60 to-transparent object-cover">
                  <Image
                    src="https://images.unsplash.com/photo-1509395176806 aba4a1394a4d?w=400&h=225&fit=crop"
                    alt="Video thumbnail"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <span className="text-xs font-medium rounded bg-[var(--bbc-red)]/20 text-[var(--bbc-red)] px-2 py-1 mb-2">
                    Video
                  </span>
                  <h3 className="text-lg font-medium">{`Video ${index + 1}`}</h3>
                  <p className="text-[var(--muted)] text-sm line-clamp-2">
                    {`Deskripsi video ${index + 1}.`}
                  </p>
                  <div className="flex items-center justify-between text-xs text-[var(--muted)]">
                    <span>• ${new Date().toLocaleDateString()}</span>
                    <span>1.2M views</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t [border-border] bg-[var(--bbc-slate)] py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="text-xl font-bold mb-4">BBC News</h3>
              <p className="text-[var(--muted)]">
                From breaking news to in-depth analysis, get the stories that matter
                most from around the world.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-4">Section</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="/"
                    className="hover:text-[var(--bbc-red)] transition-colors text-[var(--muted)]"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    "/news/politics"
                    className="hover:text-[var(--bbc-red)] transition-colors text-[var(--muted)]"
                  >
                    Politics
                  </a>
                </li>
                <li>
                  <a
                    "/news/business"
                    className="hover:text-[var(--bbc-red)] transition-colors text-[var(--muted)]"
                  >
                    Business
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">Follow Us</h4>
              <p className="text-[var(--muted)] text-sm space-y-3">
                <span>Twitter: @BBCWorld</span>
                <span>Facebook: BBC News</span>
              </p>
            </div>
          </div>
          <div className="pt-8 border-t [border-border] flex flex-col md:flex-row justify-between items-center gap-4 px-4">
            <p className="text-[var(--muted)] text-sm">
              &copy; {new Date().getYear() + 2000} BBC. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a
                href="#"
                className="hover:text-[var(--bbc-red)] transition-colors text-[var(--muted)]"
              >
                Kebijakan Privasi
              </a>
              <a
                href="#"
                className="hover:text-[var(--bbc-red)] transition-colors text-[var(--muted)]"
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