import Image from "next/image";

interface HeroArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  imageUrl: string;
  category: string;
  date: string;
  author: string;
  readTime: string;
  isBreaking: boolean;
}

interface HeroSectionProps {
  featuredArticle: HeroArticle;
  secondaryArticles: HeroArticle[];
}

export function HeroSection({
  featuredArticle,
  secondaryArticles,
}: HeroSectionProps) {
  return (
    <section className="mb-12">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Left: Featured Article */}
        <article className="rounded-2xl overflow-hidden bg-[var(--card)] border border-[var(--border)]">
          <Image
            src={featuredArticle.imageUrl}
            alt={featuredArticle.title}
            className="h-64 w-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            width={800}
            height={400}
            priority
          />
          <div className="p-5">
            <span
              className={`inline-block px-2 py-1 text-xs font-medium rounded mr-2 mb-3 ${
                featuredArticle.isBreaking ? "bg-[var(--bbc-red)] text-white" : ""`}
            >
              {featuredArticle.isBreaking ? "BREAKING" : featuredArticle.category}
            </span>
            <h2 className="text-2xl font-bold tracking-tight mb-4">
              {featuredArticle.title}
            </h2>
            <p className="text-[var(--muted)] leading-relaxed mb-6">
              {featuredArticle.excerpt}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm text-[var(--muted)]">
                  {featuredArticle.author}
                </span>
                <span className="text-sm text-[var(--muted)]">
                  {featuredArticle.readTime} &
                  {featuredArticle.date}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[var(--muted)]">
                {/* Read Time */}
              </div>
            </div>
            <a
              href={`/berita/${featuredArticle.slug}`}
              className="mt-4 inline-block text-[var(--bbc-red)] font-medium hover:underline"
            >
              Baca Selengkapnya
            </a>
          </div>
        </article>

        {/* Right: 2 Secondary Stories */}
        <div className="space-y-4">
          {secondaryArticles.slice(0, 2).map((article) => (
            <article
              key={article.id}
              className="flex flex-col rounded-xl overflow-hidden bg-[var(--card)] border border-[var(--border)] hover:shadow-lg hover:shadow-[var(--bbc-red)/20] transition-all duration-300"
            >
              <Image
                src={article.imageUrl}
                alt={article.title}
                className="h-40 w-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="p-4 flex-1">
                <span
                  className={`inline-block px-2 py-1 text-xs font-medium rounded mb-3 ${
                    article.isBreaking ? "bg-[var(--bbc-red)] text-white" : ""`}
                >
                  {article.isBreaking ? "BREAKING" : article.category}
                </span>
                <h4 className="text-base font-medium group-hover:text-[var(--bbc-red)] transition-colors mb-2">
                  {article.title}
                </h4>
                <p className="text-[var(--muted)] line-clamp-2">
                  {article.excerpt}
                </p>
                <a
                  href={`/berita/${article.slug}`}
                  className="text-[var(--bbc-red)] font-medium hover:underline"
                >
                  Baca
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}