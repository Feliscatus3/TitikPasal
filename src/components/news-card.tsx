import Image from "next/image";
import { Bookmark, Share2 } from "lucide-react";

interface NewsCardProps {
  article: any;
  onClick?: () => void;
  showMeta?: boolean;
}

export function NewsCard({
  article,
  onClick,
  showMeta = true,
}: NewsCardProps) {
  const badgeClassName =
    article.isBreaking
      ? "bg-[var(--bbc-red)] text-[var(--foreground)]"
      : article.isLive
      ? "bg-[var(--bbc-red)]/90 text-[var(--foreground)]"
      : "bg-[var(--bbc-slate)] text-[var(--muted)]";

  return (
    <article
      className="group rounded-2xl overflow-hidden bg-[var(--card)] border border-[var(--border)] hover:shadow-2xl hover:shadow-[var(--bbc-red)/20] transition-all duration-300"
      onClick={onClick}
    >
      {/* Image */}
      <div className="relative">
        <Image
          src={article.imageUrl}
          alt={article.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {/* Badge */}
        <span
          className={`absolute top-2 left-2 px-2 py-1 text-xs font-medium rounded ${
            badgeClassName
          }`}
        >
          {article.isBreaking
            ? "BREAKING"
            : article.isLive
            ? "LIVE"
            : article.category}
        </span>
      </div>

      {/* Content */}
      <div className="p-5 flex-1">
        <h3 className="text-lg font-medium group-hover:text-[var(--bbc-red)] transition-colors mb-3">
          {article.title}
        </h3>
        <p className="text-[var(--muted)] line-clamp-2 mb-4">
          {article.excerpt}
        </p>

        {showMeta && (
          <div className="flex items-center justify-between text-sm text-[var(--muted)]">
            <div className="flex items-center gap-2">
              <span>{article.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Share2 className="w-3 h-3 text-[var(--bbc-red)]" />
              <Bookmark
                className="w-3 h-3 text-[var(--bbc-red)] hover:text-[var(--foreground)]"
              />
            </div>
          </div>
        )}
      </div>
    </article>
  );
}