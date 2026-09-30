"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { TrendingUp, X, Menu, Sun, Moon } from "lucide-react";

interface MainHeaderProps {
  setDarkMode?: (dark: boolean) => void;
}

export function MainHeader({ setDarkMode }: MainHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") || "home";

  const tabs = [
    { key: "home", label: "Home" },
    { key: "national", label: "Nasional" },
    { key: "international", label: "Internasional" },
    { key: "business", label: "Bisnis" },
    { key: "technology", label: "Teknologi" },
    { key: "entertainment", label: "Hiburan" },
    { key: "sport", label: "Olahraga" },
    { key: "opinion", label: "Opini" },
  ];

  return (
    <header className="bg-[var(--bbc-slate)] text-[var(--foreground)] border-b [border-border]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Brand Left */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[var(--bbc-red)] flex items-center justify-center rounded">
              <Image
                src="/next.svg"
                alt="BBC News"
                width={25}
                height={25}
                className="flex-shrink-0"
              />
            </div>
            <h1 className="text-xl font-bold tracking-tighter">BBC News</h1>
          </div>

          {/* Main Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {tabs.map((tab) => (
              <button
                key{tab.key}
                onClick={() => router.push(`?tab=${tab.key}`)}
                className={`px-3 py-2 rounded text-sm font-medium ${
                  currentTab === tab.key
                    ? "bg-[var(--bbc-red)] text-white"
                    : "text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"}
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(true)}
            className="md:hidden p-2 rounded-lg hover:bg-[var(--card)] transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-center justify-center">
            <nav className="flex flex-col gap-8 w-full max-w-lg">
              <ul className="flex flex-col gap-4 text-lg">
                {tabs.map((tab) => (
                  <li key={tab.key}>
                    <a
                      href={`?tab=${tab.key}`}
                      className="hover:text-[var(--accent-red)] transition-colors"
                    >
                      {tab.label}
                    </a>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="mt-6 w-full py-3 rounded-full bg-[var(--bbc-red)] text-white font-medium hover:bg-[var(--accent-red-hover)] transition-colors"
              >
                Masuk/Aktifkan Akun
              </button>
            </nav>
          </div>
        )}

        {/* Ticker Bar / Breaking News */}
        <div className="bg-[var(--bbc-red)] text-[var(--foreground)]">
          <div className="overflow-hidden">
            <div
              className="flex items-center gap-3 px-3 animate-bounce opacity-80"
              style={{ animationDuration: "5s" }}
            >
              <span className="text-sm font-medium">
                BERITA UTAMA / BREAKING NEWS
              </span>
              <span className="w-64 flex-grow h-6 bg-[var(--bbc-red)] text-[var(--foreground)] flex items-center justify-center text-sm opacity-100">
                {currentTab === "home" ? "Update terbaru dari berbagai kategori" : `Berita ${currentTab}`}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}