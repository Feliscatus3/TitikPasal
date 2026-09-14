export type UserRole = 'user' | 'admin' | 'editor' | 'author';

export interface User {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  photoURL?: string;
  createdAt: Date;
  updatedAt: Date;
  emailVerified: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  image?: string;
  seoTitle?: string;
  seoDescription?: string;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
  _count?: number;
}

export type ArticleStatus = 'draft' | 'published' | 'scheduled' | 'archived';

export interface Article {
  id: string;
  title: string;
  slug: string;
  subtitle?: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  featuredImageAlt?: string;
  featuredImageCaption?: string;
  featuredImageCredit?: string;
  categoryId: string;
  categoryName: string;
  authorId: string;
  authorName: string;
  authorPhoto?: string;
  status: ArticleStatus;
  tags: string[];
  views: number;
  readingTime: number;
  publishedAt?: Date;
  scheduledAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
  ogImage?: string;
}

export interface BreakingNews {
  id: string;
  text: string;
  url?: string;
  status: 'active' | 'inactive';
  priority: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface LatestNews {
  id: string;
  title: string;
  url: string;
  categoryId: string;
  categoryName: string;
  time: string;
  status: 'active' | 'inactive';
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface SiteSettings {
  siteName: string;
  tagline: string;
  logoUrl?: string;
  faviconUrl?: string;
  description: string;
  email: string;
  whatsapp: string;
  address: string;
  socialLinks: SocialLinks;
  defaultTheme: 'dark' | 'light';
  updatedAt: Date;
}

export interface SocialLinks {
  facebook?: string;
  twitter?: string;
  instagram?: string;
  youtube?: string;
  linkedin?: string;
  telegram?: string;
  tiktok?: string;
}

export interface HomepageSection {
  id: string;
  type: 'hero' | 'latestNews' | 'categories' | 'analysis' | 'opinion' | 'education' | 'mostRead' | 'editorsPick' | 'newsletter';
  enabled: boolean;
  title: string;
  order: number;
  config: Record<string, unknown>;
  updatedAt: Date;
}

export interface HeroSectionConfig {
  featuredArticleId?: string;
  secondaryArticleIds?: string[];
}

export interface LatestNewsSectionConfig {
  count: number;
}

export interface CategorySectionConfig {
  categoryIds: string[];
  count: number;
}

export interface MostReadSectionConfig {
  mode: 'auto' | 'manual';
  count: number;
  articleIds?: string[];
}

export interface EditorsPickSectionConfig {
  articleIds: string[];
}

export interface NewsletterSectionConfig {
  title: string;
  description: string;
  placeholder: string;
  buttonText: string;
}

export interface NavigationItem {
  id: string;
  label: string;
  url: string;
  type: 'internal' | 'external' | 'category';
  order: number;
  status: 'active' | 'inactive';
  parentId?: string;
  children?: NavigationItem[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface FooterConfig {
  description: string;
  contact: {
    email: string;
    whatsapp: string;
    address: string;
  };
  socialLinks: SocialLinks;
  navigation: NavigationItem[];
  copyright: string;
  disclaimer: string;
  updatedAt: Date;
}

export interface SEOConfig {
  siteTitle: string;
  metaDescription: string;
  ogImage?: string;
  twitterImage?: string;
  googleVerification?: string;
  robotsTxt?: string;
  sitemapSettings: {
    enabled: boolean;
    changeFreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
    priority: number;
  };
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  status: 'active' | 'unsubscribed' | 'bounced';
  createdAt: Date;
  updatedAt: Date;
}

export interface MediaFile {
  id: string;
  name: string;
  url: string;
  path: string;
  size: number;
  mimeType: string;
  width?: number;
  height?: number;
  altText?: string;
  caption?: string;
  credit?: string;
  uploadedBy: string;
  createdAt: Date;
}

export interface Comment {
  id: string;
  articleId: string;
  userId: string;
  userName: string;
  userPhoto?: string;
  content: string;
  status: 'pending' | 'approved' | 'rejected' | 'spam';
  parentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Bookmark {
  id: string;
  userId: string;
  articleId: string;
  createdAt: Date;
}

export interface SearchResult {
  articles: Article[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface ArticleQueryParams extends PaginationParams {
  categoryId?: string;
  authorId?: string;
  status?: ArticleStatus;
  tag?: string;
  search?: string;
  sortBy?: 'createdAt' | 'publishedAt' | 'views' | 'title';
  sortOrder?: 'asc' | 'desc';
}

export interface DashboardStats {
  totalArticles: number;
  publishedArticles: number;
  draftArticles: number;
  totalUsers: number;
  totalViews: number;
  mostReadArticles: Article[];
  recentArticles: Article[];
}

export interface AdminUser extends User {
  lastLoginAt?: Date;
  isActive: boolean;
}