import { Metadata } from "next";
import { notFound } from "next/navigation";
import { incrementArticleViews, getPublishedArticles, getCategories, getPublishedArticleBySlug } from "@/lib/firebase/firestore";
import { getPublishedArticleBySlugAdmin, getPublishedArticlesAdmin, getCategoriesAdmin } from "@/lib/firebase/firestore-admin";
import { ArticleDetail } from "./ArticleDetail";
import { ArticleSkeleton } from "./ArticleSkeleton";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getPublishedArticleBySlugAdmin(slug);
  
  if (!article) {
    return {
      title: "Artikel Tidak Ditemukan",
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const articleUrl = `${siteUrl}/artikel/${article.slug}`;
  const imageUrl = article.featuredImage || `${siteUrl}/og-image.png`;

  return {
    title: article.seoTitle || article.title,
    description: article.seoDescription || article.excerpt,
    alternates: {
      canonical: articleUrl,
    },
    openGraph: {
      type: "article",
      url: articleUrl,
      title: article.seoTitle || article.title,
      description: article.seoDescription || article.excerpt,
      siteName: "LEXORA",
      publishedTime: article.publishedAt?.toISOString(),
      modifiedTime: article.updatedAt.toISOString(),
      authors: [article.authorName],
      section: article.categoryName,
      tags: article.tags,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: article.featuredImageAlt || article.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: article.seoTitle || article.title,
      description: article.seoDescription || article.excerpt,
      images: [imageUrl],
      creator: "@lexora",
    },
    other: {
      "article:published_time": article.publishedAt?.toISOString() || "",
      "article:modified_time": article.updatedAt.toISOString(),
      "article:author": article.authorName,
      "article:section": article.categoryName,
      "article:tag": article.tags.join(","),
    },
  };
}

export async function generateStaticParams() {
  const result = await getPublishedArticlesAdmin({ limit: 100 });
  if (!result) return [];
  return result.articles.map((article) => ({
    slug: article.slug,
  }));
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getPublishedArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  await incrementArticleViews(article.id);

  const [relatedResult, mostReadResult, categoriesResult] = await Promise.all([
    getPublishedArticles({
      limit: 4,
      categoryId: article.categoryId,
      sortBy: "publishedAt",
      sortOrder: "desc",
    }),
    getPublishedArticles({ limit: 5, sortBy: "views", sortOrder: "desc" }),
    getCategories(true),
  ]);

  const relatedArticles = relatedResult.articles.filter((a) => a.id !== article.id);
  const mostReadArticles = mostReadResult.articles;
  const categories = categoriesResult;

  return (
    <ArticleDetail
      article={article}
      relatedArticles={relatedArticles}
      mostReadArticles={mostReadArticles}
      categories={categories}
    />
  );
}