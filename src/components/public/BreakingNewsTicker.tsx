'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, AlertTriangle, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { BreakingNews } from '@/types';

interface BreakingNewsTickerProps {
  items: BreakingNews[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

export function BreakingNewsTicker({ items, autoPlay = true, autoPlayInterval = 5000 }: BreakingNewsTickerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const activeItems = items.filter((item) => item.status === 'active');

  if (activeItems.length === 0) return null;

  useEffect(() => {
    if (!autoPlay || activeItems.length <= 1) return;

    intervalRef.current = setInterval(() => {
      if (!isPaused) {
        setCurrentIndex((prev) => (prev + 1) % activeItems.length);
      }
    }, autoPlayInterval);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [autoPlay, autoPlayInterval, activeItems.length, isPaused]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + activeItems.length) % activeItems.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % activeItems.length);
  };

  const currentItem = activeItems[currentIndex];

  return (
    <div className="bg-primary-600 text-white overflow-hidden" role="region" aria-label="Breaking news">
      <div className="container-main">
        <div className="flex items-center h-10">
          <div className="flex items-center gap-2 px-3 py-1 bg-primary-700 rounded-r-lg font-semibold text-sm whitespace-nowrap flex-shrink-0">
            <AlertTriangle className="w-4 h-4" aria-hidden="true" />
            BREAKING NEWS
          </div>
          <div className="flex-1 overflow-hidden ml-3 relative" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {activeItems.map((item, index) => (
                <div key={item.id} className="w-full flex-shrink-0 px-3">
                  {item.url ? (
                    <Link
                      href={item.url}
                      className="text-sm font-medium hover:text-primary-200 transition-colors"
                    >
                      {item.text}
                    </Link>
                  ) : (
                    <span className="text-sm font-medium">{item.text}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
          {activeItems.length > 1 && (
            <div className="flex items-center gap-1 ml-3 flex-shrink-0">
              <button
                onClick={goToPrevious}
                className="p-1.5 rounded hover:bg-white/10 transition-colors"
                aria-label="Breaking news sebelumnya"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={goToNext}
                className="p-1.5 rounded hover:bg-white/10 transition-colors"
                aria-label="Breaking news selanjutnya"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="p-1.5 rounded hover:bg-white/10 transition-colors"
                aria-label={isPaused ? 'Lanjutkan auto-play' : 'Jeda auto-play'}
              >
                {isPaused ? <span className="text-[10px]">▶</span> : <span className="text-[10px]">⏸</span>}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}