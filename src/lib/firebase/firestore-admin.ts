import { adminDb, isAdminInitialized } from './admin';
import type {
  Article,
  Category,
  ArticleQueryParams,
  SearchResult,
  DashboardStats,
  User,
} from '@/types';

const COLLECTIONS = {
  ARTICLES: 'articles',
  CATEGORIES: 'categories',
  USERS: 'users',
} as const;

const convertTimestamp = (data: Record<string, unknown>): Record<string, unknown> => {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data)) {
    if (value && typeof value === 'object' && 'toDate' in value && typeof (value as { toDate: () => Date }).toDate === 'function') {
      result[key] = (value as { toDate: () => Date }).toDate();
    } else if (value && typeof value === 'object' && 'seconds' in value && 'nanoseconds' in value) {
      result[key] = new Date((value as { seconds: number; nanoseconds: number }).seconds * 1000);
    } else {
      result[key] = value;
    }
  }
  return result;
};

const fromDoc = <T>(docSnap: { exists: boolean; id: string; data: () => Record<string, unknown> | undefined }): T | null => {
  if (!docSnap.exists) return null;
  const data = docSnap.data();
  if (!data) return null;
  return { id: docSnap.id, ...convertTimestamp(data) } as T;
};

const fromDocs = <T>(docs: Array<{ exists: boolean; id: string; data: () => Record<string, unknown> | undefined }>): T[] => {
  return docs.map((doc) => {
    const data = doc.data();
    if (!data) return null as unknown as T;
    return { id: doc.id, ...convertTimestamp(data) } as T;
  }).filter((doc): doc is T => doc !== null);
};

export const articleAdminService = {
  async getBySlug(slug: string): Promise<Article | null> {
    if (!isAdminInitialized || !adminDb) return null;
    const snapshot = await adminDb.collection(COLLECTIONS.ARTICLES).where('slug', '==', slug).limit(1).get();
    if (snapshot.empty) return null;
    return fromDoc<Article>(snapshot.docs[0]);
  },

  async getPublished(params?: ArticleQueryParams): Promise<SearchResult | null> {
    if (!isAdminInitialized || !adminDb) return null;
    const {
      page = 1,
      limit: limitCount = 10,
      categoryId,
      authorId,
      tag,
      sortBy = 'publishedAt',
      sortOrder = 'desc',
    } = params || {};

    let queryRef = adminDb.collection(COLLECTIONS.ARTICLES)
      .where('status', '==', 'published')
      .orderBy(sortBy, sortOrder)
      .limit(limitCount + 1);

    if (categoryId) queryRef = queryRef.where('categoryId', '==', categoryId);
    if (authorId) queryRef = queryRef.where('authorId', '==', authorId);
    if (tag) queryRef = queryRef.where('tags', 'array-contains', tag);

    const snapshot = await queryRef.get();
    const articles = fromDocs<Article>(snapshot.docs);

    const hasMore = articles.length > limitCount;
    const result = hasMore ? articles.slice(0, limitCount) : articles;

    return {
      articles: result,
      total: result.length + (hasMore ? 1 : 0),
      page,
      limit: limitCount,
      hasMore,
    };
  },

  async getAll(params?: ArticleQueryParams): Promise<SearchResult | null> {
    if (!isAdminInitialized || !adminDb) return null;
    const {
      page = 1,
      limit: limitCount = 10,
      status,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = params || {};

    let queryRef = adminDb.collection(COLLECTIONS.ARTICLES)
      .orderBy(sortBy, sortOrder)
      .limit(limitCount + 1);

    if (status) queryRef = queryRef.where('status', '==', status);

    const snapshot = await queryRef.get();
    const articles = fromDocs<Article>(snapshot.docs);

    const hasMore = articles.length > limitCount;
    const result = hasMore ? articles.slice(0, limitCount) : articles;

    return {
      articles: result,
      total: result.length + (hasMore ? 1 : 0),
      page,
      limit: limitCount,
      hasMore,
    };
  },

  async getByIds(ids: string[]): Promise<Article[] | null> {
    if (!isAdminInitialized || !adminDb) return null;
    if (ids.length === 0) return [];
    const chunks: string[][] = [];
    for (let i = 0; i < ids.length; i += 10) {
      chunks.push(ids.slice(i, i + 10));
    }

    const results: Article[] = [];
    for (const chunk of chunks) {
      const snapshot = await adminDb.collection(COLLECTIONS.ARTICLES).where('__name__', 'in', chunk).get();
      results.push(...fromDocs<Article>(snapshot.docs));
    }

    return ids.map((id) => results.find((a) => a.id === id)).filter((a): a is Article => a !== undefined);
  },

  async getMostRead(count: number = 5): Promise<Article[] | null> {
    if (!isAdminInitialized || !adminDb) return null;
    const snapshot = await adminDb.collection(COLLECTIONS.ARTICLES)
      .where('status', '==', 'published')
      .orderBy('views', 'desc')
      .limit(count)
      .get();
    return fromDocs<Article>(snapshot.docs);
  },

  async getRecent(count: number = 5): Promise<Article[] | null> {
    if (!isAdminInitialized || !adminDb) return null;
    const snapshot = await adminDb.collection(COLLECTIONS.ARTICLES)
      .where('status', '==', 'published')
      .orderBy('publishedAt', 'desc')
      .limit(count)
      .get();
    return fromDocs<Article>(snapshot.docs);
  },

  async getByCategory(categoryId: string, count: number = 10): Promise<Article[] | null> {
    if (!isAdminInitialized || !adminDb) return null;
    const snapshot = await adminDb.collection(COLLECTIONS.ARTICLES)
      .where('status', '==', 'published')
      .where('categoryId', '==', categoryId)
      .orderBy('publishedAt', 'desc')
      .limit(count)
      .get();
    return fromDocs<Article>(snapshot.docs);
  },
};

export const categoryAdminService = {
  async getById(id: string): Promise<Category | null> {
    if (!isAdminInitialized || !adminDb) return null;
    const snapshot = await adminDb.collection(COLLECTIONS.CATEGORIES).doc(id).get();
    return fromDoc<Category>(snapshot);
  },

  async getBySlug(slug: string): Promise<Category | null> {
    if (!isAdminInitialized || !adminDb) return null;
    const snapshot = await adminDb.collection(COLLECTIONS.CATEGORIES).where('slug', '==', slug).limit(1).get();
    if (snapshot.empty) return null;
    return fromDoc<Category>(snapshot.docs[0]);
  },

  async getAll(activeOnly = true): Promise<Category[] | null> {
    if (!isAdminInitialized || !adminDb) return null;
    let queryRef = adminDb.collection(COLLECTIONS.CATEGORIES).orderBy('order', 'asc');
    if (activeOnly) queryRef = queryRef.where('isActive', '==', true);
    const snapshot = await queryRef.get();
    return fromDocs<Category>(snapshot.docs);
  },
};

export const dashboardAdminService = {
  async getStats(): Promise<DashboardStats | null> {
    if (!isAdminInitialized || !adminDb) return null;
    const [articlesSnap, usersSnap] = await Promise.all([
      adminDb.collection(COLLECTIONS.ARTICLES).get(),
      adminDb.collection(COLLECTIONS.USERS).get(),
    ]);

    const articles = fromDocs<Article>(articlesSnap.docs);
    const users = fromDocs<User>(usersSnap.docs);

    const publishedArticles = articles.filter((a) => a.status === 'published');
    const draftArticles = articles.filter((a) => a.status === 'draft');
    const totalViews = articles.reduce((sum, a) => sum + a.views, 0);
    const mostRead = [...articles].sort((a, b) => b.views - a.views).slice(0, 5);
    const recentArticles = [...articles].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 5);

    return {
      totalArticles: articles.length,
      publishedArticles: publishedArticles.length,
      draftArticles: draftArticles.length,
      totalUsers: users.length,
      totalViews,
      mostReadArticles: mostRead,
      recentArticles,
    };
  },
};

export const getPublishedArticlesAdmin = articleAdminService.getPublished.bind(articleAdminService);
export const getPublishedArticleBySlugAdmin = articleAdminService.getBySlug.bind(articleAdminService);
export const getCategoriesAdmin = categoryAdminService.getAll.bind(categoryAdminService);
export const getCategoryBySlugAdmin = categoryAdminService.getBySlug.bind(categoryAdminService);
export const getDashboardStatsAdmin = dashboardAdminService.getStats.bind(dashboardAdminService);