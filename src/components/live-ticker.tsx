"use client";

import { useState, useEffect } from "react";
import { TrendingUp, X } from "lucide-react";

interface LiveTickerProps {
  articles: any[];
  onArticleClick?: (article: any) => void;
}

export function LiveTicker({ articles, onArticleClick }: LiveTickerProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating((prev) => !prev);
    }, 300);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[var(--bbc-red)] text-[var(--foreground)]">
      <div className="overflow-hidden">
        <div className="flex items-center gap-2 px-3 py-2 border-b [border-border]">
          <TrendingUp
            className="w-4 h-4 text-[var(--bbc-charcoal)]"
          />{" "}
          <span className="font-medium animate-blink">LIVE</span>
        </div>
        <div
          className={`flex items-center gap-2 px-3 h-14 ${
            isAnimating ? "animate-bounce" : "opacity-50"
          }`}
        >
          {articles.map((article, index) => (
            <div
              key={article.id}
              className={`flex items-center gap-2 px-3 border-r ${
                index === articles.length - 1 ? "border-0 pr-0" : ""
              }`}
            >
              <span className="text-xs font-medium">
                {article.isBreaking ? "BREAKING " : ""}
                {article.title}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}