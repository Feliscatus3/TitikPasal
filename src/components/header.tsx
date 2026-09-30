"use client";

import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Search, Sun, Moon, User, LogOut, Menu, X, TrendingUp } from "lucide-react";

interface TopBarProps {
  setDarkMode?: (dark: boolean) => void;
}

export function TopBar({ setDarkMode }: TopBarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  return (
    <div className="bg-[var(--bbc-slate)] text-[var(--foreground)] border-b [border-border]">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Left: Logo + Brand */}
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

        {/* Center: Search */}
        <div className="hidden md:block flex items-center gap-2">
          <Search className="w-4 h-4 text-[var(--muted)]" />
          <input
            type="text"
            placeholder="Cari berita..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-3 py-1 rounded text-sm bg-[var(--card)] text-[var(--foreground)] outline-none"
          />
        </div>

        {/* Right: Mode & Login */}
        <div className="flex items-center gap-4">
          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode && setDarkMode(true)}
            className="relative p-2 rounded hover:bg-[var(--card)] transition-colors"
            aria-label="Mode gelap"
          >
            <Moon
              className="w-4 h-4 text-[var(--muted)]"
            />
          </button>
          {/* Light Mode Toggle */}
          <button
            onClick={() => setDarkMode && setDarkMode(false)}
            className="relative p-2 rounded hover:bg-[var(--card)] transition-colors hidden md:block"
            aria-label="Terang"
          >
            <Sun
              className="w-4 h-4 text-[var(--muted)]"
            />
          </button>
          {/* Login Button */}
          <button
            className="rounded px-4 py-2 bg-[var(--bbc-red)] text-white font-medium hover:bg-[var(--accent-red-hover)] transition-colors"
          >
            Masuk
          </button>
        </div>
      </div>
    </div>
  }