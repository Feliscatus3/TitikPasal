"use client";

import { Sun, Moon } from "lucide-react";

interface SidebarProps {
  setDarkMode?: (dark: boolean) => void;
  selectedTab?: string;
  onTabChange?: (tab: string) => void;
}

export function Sidebar({
  setDarkMode,
  selectedTab,
  onTabChange,
}: SidebarProps) {
  const categories = [
    { id: "politics", name: "Politics", count: 25 },
    { id: "business", name: "Business", count: 15 },
    { id: "technology", name: "Technology", count: 20 },
    { id: "entertainment", name: "Entertainment", count: 18 },
    { id: "sport", name: "Sport", count: 12 },
    { id: "environment", name: "Environment", count: 10 },
    { id: "opinion", name: "Opinion", count: 8 },
  ];

  return (
    <aside className="lg:w-64 bg-[var(--card)] border-l [border-border] sticky top-0 pt-6">
      <div className="p-6 border-b [border-border] bg-[var(--bbc-slate)]">
        <h2 className="text-xl font-bold tracking-tight mb-4">BBC News</h2>
        {/* Dark Mode Toggle */}
        <div className="flex items-center gap-3 text-sm">
          <span className="text-[var(--muted)]">Mode:</span>
          <button
            onClick={() => setDarkMode && setDarkMode(true)}
            className="rounded bg-[var(--bbc-red)]/10 px-3 py-1.5 text-[var(--bbc-red)] hover:bg-[var(--bbc-red)]/20 transition-colors"
          >
            {selectedTab === "dark" ? (
              <Moon className="w-3 h-3" />
            ) : (
              <Sun className="w-3 h-3" />
            )}
          </button>
          <button
            onClick={() => setDarkMode && setDarkMode(false)}
            className="rounded bg-[var(--bbc-red)]/10 px-3 py-1.5 text-[var(--bbc-red)] hover:bg-[var(--bbc-red)]/20 transition-colors hidden"
          >
            {selectedTab === "light" ? (
              <Sun className="w-3 h-3" />
            ) : (
              <Moon className="w-3 h-3" />
            )}
          </button>
        </div>
      </div>

      {/* Most Read Section */}
      <div className="p-6">
        <h2 className="text font-bold tracking-tight mb-4">Paling Banyak Dibaca</h2>
        <ol className="list-decimal list-inside space-y-3">
          {[1, 2, 3, 4, 5].map((rank) => (
            <li key={rank} className="flex items-start gap-3 rounded-xl p-4 bg-[var(--bbc-slate)] border border-[var(--border)]">
              <span className="text-2xl font-bold text-[var(--bbc-red)]">{rank}</span>
              <div className="flex-1">
                <h4 className="font-medium mb-1">Artikel Terpopuler</h4>
                <p className="text-[var(--muted)] text-sm line-clamp-1">
                  Judul artikel terpopuler hari ini
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs text-[var(--muted)]">
                <span>1 jam lalu</span>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* Category Navigation */}
      <div className="p-6">
        <h2 className="text font-bold tracking-tight mb-6">Kategori</h2>
        <div className="space-y-2">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors hover:text-white hover:bg-[var(--bbc-red)] ${
                selectedTab === category.id
                  ? "bg-[var(--bbc-red)] text-white"
                  : ""
              }`}
              onClick={() => onTabChange && onTabChange(category.id)}
            >
              <span className="w-2 h-2 rounded-full bg-[var(--bbc-red)]" />
              {category.name}
              <span className="ml-auto text-[var(--muted)]">({category.count})</span>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}