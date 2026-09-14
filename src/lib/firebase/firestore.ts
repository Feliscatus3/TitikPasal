import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  type QueryConstraint,
  type DocumentSnapshot,
  type QueryDocumentSnapshot,
  serverTimestamp,
  Timestamp,
  writeBatch,
  type WhereFilterOp,
} from 'firebase/firestore';
import { db } from './config';
import type {
  Article,
  Category,
  User,
  BreakingNews,
  LatestNews,
  SiteSettings,
  HomepageSection,
  NavigationItem,
  FooterConfig,
  SEOConfig,
  NewsletterSubscriber,
  MediaFile,
  Comment,
  Bookmark,
  DashboardStats,
  ArticleQueryParams,
  SearchResult,
} from '@/types';

const COLLECTIONS = {
  ARTICLES: 'articles',
  CATEGORIES: 'categories',
  USERS: 'users',
  BREAKING_NEWS: 'breakingNews',
  LATEST_NEWS: 'latestNews',
  SITE_SETTINGS: 'siteSettings',
  HOMEPAGE_SECTIONS: 'homepageSections',
  NAVIGATION: 'navigation',
  FOOTER: 'footer',
  SEO: 'seo',
  NEWSLETTER_SUBSCRIBERS: 'newsletterSubscribers',
  MEDIA: 'media',
  COMMENTS: 'comments',
  BOOKMARKS: 'bookmarks',
} as const;

const convertTimestamp = (data: Record<string, unknown>): Record<string, unknown> => {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data)) {
    if (value instanceof Timestamp) {
      result[key] = value.toDate();
    } else if (value && typeof value === 'object' && 'seconds' in value && 'nanoseconds' in value) {
      result[key] = new Date((value as { seconds: number; nanoseconds: number }).seconds * 1000);
    } else {
      result[key] = value;
    }
  }
  return result;
};

const fromDoc = <T>(docSnap: DocumentSnapshot | QueryDocumentSnapshot): T | null => {
  if (!docSnap.exists()) return null;
  return { id: docSnap.id, ...convertTimestamp(docSnap.data()) } as T;
};

const fromDocs = <T>(docs: QueryDocumentSnapshot[]): T[] => {
  return docs.map((doc) => ({ id: doc.id, ...convertTimestamp(doc.data()) } as T));
};

export const articleService = {
  async create(data: Omit<Article, 'id' | 'createdAt' | 'updatedAt' | 'views'>): Promise<Article> {
    const now = new Date();
    const articleData = {
      ...data,
      views: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      publishedAt: data.publishedAt ? Timestamp.fromDate(data.publishedAt) : null,
      scheduledAt: data.scheduledAt ? Timestamp.fromDate(data.scheduledAt) : null,
    };

    const ref = doc(collection(db, COLLECTIONS.ARTICLES));
    await setDoc(ref, articleData);

    return { id: ref.id, ...data, views: 0, createdAt: now, updatedAt: now };
  },

  async getById(id: string): Promise<Article | null> {
    const snap = await getDoc(doc(db, COLLECTIONS.ARTICLES, id));
    return fromDoc<Article>(snap);
  },

  async getBySlug(slug: string): Promise<Article | null> {
    const q = query(collection(db, COLLECTIONS.ARTICLES), where('slug', '==', slug), limit(1));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    return fromDoc<Article>(snap.docs[0]);
  },

  async getPublished(params?: ArticleQueryParams): Promise<SearchResult> {
    const {
      page = 1,
      limit: limitCount = 10,
      categoryId,
      authorId,
      tag,
      search,
      sortBy = 'publishedAt',
      sortOrder = 'desc',
    } = params || {};

    const constraints: QueryConstraint[] = [
      where('status', '==', 'published'),
      orderBy(sortBy, sortOrder),
      limit(limitCount + 1),
    ];

    if (categoryId) constraints.splice(1, 0, where('categoryId', '==', categoryId));
    if (authorId) constraints.splice(1, 0, where('authorId', '==', authorId));
    if (tag) constraints.splice(1, 0, where('tags', 'array-contains', tag));

    const q = query(collection(db, COLLECTIONS.ARTICLES), ...constraints);
    const snap = await getDocs(q);
    const articles = fromDocs<Article>(snap.docs);

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

  async getAll(params?: ArticleQueryParams): Promise<SearchResult> {
    const {
      page = 1,
      limit: limitCount = 10,
      status,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = params || {};

    const constraints: QueryConstraint[] = [
      orderBy(sortBy, sortOrder),
      limit(limitCount + 1),
    ];

    if (status) constraints.unshift(where('status', '==', status));

    const q = query(collection(db, COLLECTIONS.ARTICLES), ...constraints);
    const snap = await getDocs(q);
    const articles = fromDocs<Article>(snap.docs);

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

  async getByIds(ids: string[]): Promise<Article[]> {
    if (ids.length === 0) return [];
    const chunks: string[][] = [];
    for (let i = 0; i < ids.length; i += 10) {
      chunks.push(ids.slice(i, i + 10));
    }

    const results: Article[] = [];
    for (const chunk of chunks) {
      const q = query(collection(db, COLLECTIONS.ARTICLES), where('__name__', 'in', chunk));
      const snap = await getDocs(q);
      results.push(...fromDocs<Article>(snap.docs));
    }

    return ids.map((id) => results.find((a) => a.id === id)).filter((a): a is Article => a !== undefined);
  },

  async update(id: string, data: Partial<Article>): Promise<{ error: string | null }> {
    try {
      const updateData = {
        ...data,
        updatedAt: serverTimestamp(),
        publishedAt: data.publishedAt ? Timestamp.fromDate(data.publishedAt) : undefined,
        scheduledAt: data.scheduledAt ? Timestamp.fromDate(data.scheduledAt) : undefined,
      };
      await updateDoc(doc(db, COLLECTIONS.ARTICLES, id), updateData);
      return { error: null };
    } catch (error) {
      return { error: (error as Error).message };
    }
  },

  async delete(id: string): Promise<{ error: string | null }> {
    try {
      await deleteDoc(doc(db, COLLECTIONS.ARTICLES, id));
      return { error: null };
    } catch (error) {
      return { error: (error as Error).message };
    }
  },

  async incrementViews(id: string): Promise<void> {
    const ref = doc(db, COLLECTIONS.ARTICLES, id);
    await updateDoc(ref, { views: (await getDoc(ref)).data()?.views + 1 || 1 });
  },

  async getMostRead(count: number = 5): Promise<Article[]> {
    const q = query(
      collection(db, COLLECTIONS.ARTICLES),
      where('status', '==', 'published'),
      orderBy('views', 'desc'),
      limit(count)
    );
    const snap = await getDocs(q);
    return fromDocs<Article>(snap.docs);
  },

  async getRecent(count: number = 5): Promise<Article[]> {
    const q = query(
      collection(db, COLLECTIONS.ARTICLES),
      where('status', '==', 'published'),
      orderBy('publishedAt', 'desc'),
      limit(count)
    );
    const snap = await getDocs(q);
    return fromDocs<Article>(snap.docs);
  },

  async getByCategory(categoryId: string, count: number = 10): Promise<Article[]> {
    const q = query(
      collection(db, COLLECTIONS.ARTICLES),
      where('status', '==', 'published'),
      where('categoryId', '==', categoryId),
      orderBy('publishedAt', 'desc'),
      limit(count)
    );
    const snap = await getDocs(q);
    return fromDocs<Article>(snap.docs);
  },
};

export const categoryService = {
  async create(data: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Promise<Category> {
    const now = new Date();
    const ref = doc(collection(db, COLLECTIONS.CATEGORIES));
    await setDoc(ref, { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
    return { id: ref.id, ...data, createdAt: now, updatedAt: now };
  },

  async getById(id: string): Promise<Category | null> {
    const snap = await getDoc(doc(db, COLLECTIONS.CATEGORIES, id));
    return fromDoc<Category>(snap);
  },

  async getBySlug(slug: string): Promise<Category | null> {
    const q = query(collection(db, COLLECTIONS.CATEGORIES), where('slug', '==', slug), limit(1));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    return fromDoc<Category>(snap.docs[0]);
  },

  async getAll(activeOnly = true): Promise<Category[]> {
    const constraints: QueryConstraint[] = [orderBy('order', 'asc')];
    if (activeOnly) constraints.unshift(where('isActive', '==', true));
    const q = query(collection(db, COLLECTIONS.CATEGORIES), ...constraints);
    const snap = await getDocs(q);
    return fromDocs<Category>(snap.docs);
  },

  async update(id: string, data: Partial<Category>): Promise<{ error: string | null }> {
    try {
      await updateDoc(doc(db, COLLECTIONS.CATEGORIES, id), { ...data, updatedAt: serverTimestamp() });
      return { error: null };
    } catch (error) {
      return { error: (error as Error).message };
    }
  },

  async delete(id: string): Promise<{ error: string | null }> {
    try {
      await deleteDoc(doc(db, COLLECTIONS.CATEGORIES, id));
      return { error: null };
    } catch (error) {
      return { error: (error as Error).message };
    }
  },

  async reorder(ids: string[]): Promise<{ error: string | null }> {
    try {
      const batch = writeBatch(db);
      ids.forEach((id, index) => {
        batch.update(doc(db, COLLECTIONS.CATEGORIES, id), { order: index, updatedAt: serverTimestamp() });
      });
      await batch.commit();
      return { error: null };
    } catch (error) {
      return { error: (error as Error).message };
    }
  },
};

export const userService = {
  async getById(uid: string): Promise<User | null> {
    const snap = await getDoc(doc(db, COLLECTIONS.USERS, uid));
    return fromDoc<User>(snap);
  },

  async getAll(): Promise<User[]> {
    const q = query(collection(db, COLLECTIONS.USERS), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return fromDocs<User>(snap.docs);
  },

  async update(uid: string, data: Partial<User>): Promise<{ error: string | null }> {
    try {
      await updateDoc(doc(db, COLLECTIONS.USERS, uid), { ...data, updatedAt: serverTimestamp() });
      return { error: null };
    } catch (error) {
      return { error: (error as Error).message };
    }
  },

  async delete(uid: string): Promise<{ error: string | null }> {
    try {
      await deleteDoc(doc(db, COLLECTIONS.USERS, uid));
      return { error: null };
    } catch (error) {
      return { error: (error as Error).message };
    }
  },
};

export const breakingNewsService = {
  async create(data: Omit<BreakingNews, 'id' | 'createdAt' | 'updatedAt'>): Promise<BreakingNews> {
    const now = new Date();
    const ref = doc(collection(db, COLLECTIONS.BREAKING_NEWS));
    await setDoc(ref, { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
    return { id: ref.id, ...data, createdAt: now, updatedAt: now };
  },

  async getActive(): Promise<BreakingNews[]> {
    const q = query(
      collection(db, COLLECTIONS.BREAKING_NEWS),
      where('status', '==', 'active'),
      orderBy('priority', 'desc'),
      orderBy('createdAt', 'desc')
    );
    const snap = await getDocs(q);
    return fromDocs<BreakingNews>(snap.docs);
  },

  async getAll(): Promise<BreakingNews[]> {
    const q = query(collection(db, COLLECTIONS.BREAKING_NEWS), orderBy('priority', 'desc'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return fromDocs<BreakingNews>(snap.docs);
  },

  async update(id: string, data: Partial<BreakingNews>): Promise<{ error: string | null }> {
    try {
      await updateDoc(doc(db, COLLECTIONS.BREAKING_NEWS, id), { ...data, updatedAt: serverTimestamp() });
      return { error: null };
    } catch (error) {
      return { error: (error as Error).message };
    }
  },

  async delete(id: string): Promise<{ error: string | null }> {
    try {
      await deleteDoc(doc(db, COLLECTIONS.BREAKING_NEWS, id));
      return { error: null };
    } catch (error) {
      return { error: (error as Error).message };
    }
  },
};

export const latestNewsService = {
  async create(data: Omit<LatestNews, 'id' | 'createdAt' | 'updatedAt'>): Promise<LatestNews> {
    const now = new Date();
    const ref = doc(collection(db, COLLECTIONS.LATEST_NEWS));
    await setDoc(ref, { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
    return { id: ref.id, ...data, createdAt: now, updatedAt: now };
  },

  async getActive(count: number = 10): Promise<LatestNews[]> {
    const q = query(
      collection(db, COLLECTIONS.LATEST_NEWS),
      where('status', '==', 'active'),
      orderBy('order', 'asc'),
      limit(count)
    );
    const snap = await getDocs(q);
    return fromDocs<LatestNews>(snap.docs);
  },

  async getAll(): Promise<LatestNews[]> {
    const q = query(collection(db, COLLECTIONS.LATEST_NEWS), orderBy('order', 'asc'));
    const snap = await getDocs(q);
    return fromDocs<LatestNews>(snap.docs);
  },

  async update(id: string, data: Partial<LatestNews>): Promise<{ error: string | null }> {
    try {
      await updateDoc(doc(db, COLLECTIONS.LATEST_NEWS, id), { ...data, updatedAt: serverTimestamp() });
      return { error: null };
    } catch (error) {
      return { error: (error as Error).message };
    }
  },

  async delete(id: string): Promise<{ error: string | null }> {
    try {
      await deleteDoc(doc(db, COLLECTIONS.LATEST_NEWS, id));
      return { error: null };
    } catch (error) {
      return { error: (error as Error).message };
    }
  },

  async reorder(ids: string[]): Promise<{ error: string | null }> {
    try {
      const batch = writeBatch(db);
      ids.forEach((id, index) => {
        batch.update(doc(db, COLLECTIONS.LATEST_NEWS, id), { order: index, updatedAt: serverTimestamp() });
      });
      await batch.commit();
      return { error: null };
    } catch (error) {
      return { error: (error as Error).message };
    }
  },
};

export const siteSettingsService = {
  async get(): Promise<SiteSettings | null> {
    const snap = await getDoc(doc(db, COLLECTIONS.SITE_SETTINGS, 'general'));
    return fromDoc<SiteSettings>(snap);
  },

  async update(data: Partial<SiteSettings>): Promise<{ error: string | null }> {
    try {
      await setDoc(doc(db, COLLECTIONS.SITE_SETTINGS, 'general'), { ...data, updatedAt: serverTimestamp() }, { merge: true });
      return { error: null };
    } catch (error) {
      return { error: (error as Error).message };
    }
  },
};

export const homepageSectionService = {
  async getAll(): Promise<HomepageSection[]> {
    const q = query(collection(db, COLLECTIONS.HOMEPAGE_SECTIONS), orderBy('order', 'asc'));
    const snap = await getDocs(q);
    return fromDocs<HomepageSection>(snap.docs);
  },

  async getById(id: string): Promise<HomepageSection | null> {
    const snap = await getDoc(doc(db, COLLECTIONS.HOMEPAGE_SECTIONS, id));
    return fromDoc<HomepageSection>(snap);
  },

  async update(id: string, data: Partial<HomepageSection>): Promise<{ error: string | null }> {
    try {
      await updateDoc(doc(db, COLLECTIONS.HOMEPAGE_SECTIONS, id), { ...data, updatedAt: serverTimestamp() });
      return { error: null };
    } catch (error) {
      return { error: (error as Error).message };
    }
  },

  async reorder(ids: string[]): Promise<{ error: string | null }> {
    try {
      const batch = writeBatch(db);
      ids.forEach((id, index) => {
        batch.update(doc(db, COLLECTIONS.HOMEPAGE_SECTIONS, id), { order: index, updatedAt: serverTimestamp() });
      });
      await batch.commit();
      return { error: null };
    } catch (error) {
      return { error: (error as Error).message };
    }
  },
};

export const navigationService = {
  async getAll(): Promise<NavigationItem[]> {
    const q = query(collection(db, COLLECTIONS.NAVIGATION), orderBy('order', 'asc'));
    const snap = await getDocs(q);
    return fromDocs<NavigationItem>(snap.docs);
  },

  async create(data: Omit<NavigationItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<NavigationItem> {
    const now = new Date();
    const ref = doc(collection(db, COLLECTIONS.NAVIGATION));
    await setDoc(ref, { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
    return { id: ref.id, ...data, createdAt: now, updatedAt: now };
  },

  async update(id: string, data: Partial<NavigationItem>): Promise<{ error: string | null }> {
    try {
      await updateDoc(doc(db, COLLECTIONS.NAVIGATION, id), { ...data, updatedAt: serverTimestamp() });
      return { error: null };
    } catch (error) {
      return { error: (error as Error).message };
    }
  },

  async delete(id: string): Promise<{ error: string | null }> {
    try {
      await deleteDoc(doc(db, COLLECTIONS.NAVIGATION, id));
      return { error: null };
    } catch (error) {
      return { error: (error as Error).message };
    }
  },
};

export const footerService = {
  async get(): Promise<FooterConfig | null> {
    const snap = await getDoc(doc(db, COLLECTIONS.FOOTER, 'general'));
    return fromDoc<FooterConfig>(snap);
  },

  async update(data: Partial<FooterConfig>): Promise<{ error: string | null }> {
    try {
      await setDoc(doc(db, COLLECTIONS.FOOTER, 'general'), { ...data, updatedAt: serverTimestamp() }, { merge: true });
      return { error: null };
    } catch (error) {
      return { error: (error as Error).message };
    }
  },
};

export const seoService = {
  async get(): Promise<SEOConfig | null> {
    const snap = await getDoc(doc(db, COLLECTIONS.SEO, 'general'));
    return fromDoc<SEOConfig>(snap);
  },

  async update(data: Partial<SEOConfig>): Promise<{ error: string | null }> {
    try {
      await setDoc(doc(db, COLLECTIONS.SEO, 'general'), { ...data, updatedAt: serverTimestamp() }, { merge: true });
      return { error: null };
    } catch (error) {
      return { error: (error as Error).message };
    }
  },
};

export const newsletterService = {
  async subscribe(email: string): Promise<{ error: string | null }> {
    try {
      const q = query(collection(db, COLLECTIONS.NEWSLETTER_SUBSCRIBERS), where('email', '==', email), limit(1));
      const snap = await getDocs(q);
      if (!snap.empty) {
        return { error: 'Email sudah terdaftar' };
      }

      const ref = doc(collection(db, COLLECTIONS.NEWSLETTER_SUBSCRIBERS));
      await setDoc(ref, { email, status: 'active', createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
      return { error: null };
    } catch (error) {
      return { error: (error as Error).message };
    }
  },

  async getAll(): Promise<NewsletterSubscriber[]> {
    const q = query(collection(db, COLLECTIONS.NEWSLETTER_SUBSCRIBERS), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return fromDocs<NewsletterSubscriber>(snap.docs);
  },

  async delete(id: string): Promise<{ error: string | null }> {
    try {
      await deleteDoc(doc(db, COLLECTIONS.NEWSLETTER_SUBSCRIBERS, id));
      return { error: null };
    } catch (error) {
      return { error: (error as Error).message };
    }
  },
};

export const mediaService = {
  async create(data: Omit<MediaFile, 'id' | 'createdAt'>): Promise<MediaFile> {
    const now = new Date();
    const ref = doc(collection(db, COLLECTIONS.MEDIA));
    await setDoc(ref, { ...data, createdAt: serverTimestamp() });
    return { id: ref.id, ...data, createdAt: now };
  },

  async getAll(): Promise<MediaFile[]> {
    const q = query(collection(db, COLLECTIONS.MEDIA), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return fromDocs<MediaFile>(snap.docs);
  },

  async delete(id: string): Promise<{ error: string | null }> {
    try {
      await deleteDoc(doc(db, COLLECTIONS.MEDIA, id));
      return { error: null };
    } catch (error) {
      return { error: (error as Error).message };
    }
  },
};

export const commentService = {
  async create(data: Omit<Comment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Comment> {
    const now = new Date();
    const ref = doc(collection(db, COLLECTIONS.COMMENTS));
    await setDoc(ref, { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
    return { id: ref.id, ...data, createdAt: now, updatedAt: now };
  },

  async getByArticle(articleId: string): Promise<Comment[]> {
    const q = query(
      collection(db, COLLECTIONS.COMMENTS),
      where('articleId', '==', articleId),
      where('status', '==', 'approved'),
      orderBy('createdAt', 'desc')
    );
    const snap = await getDocs(q);
    return fromDocs<Comment>(snap.docs);
  },

  async getAll(): Promise<Comment[]> {
    const q = query(collection(db, COLLECTIONS.COMMENTS), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return fromDocs<Comment>(snap.docs);
  },

  async updateStatus(id: string, status: Comment['status']): Promise<{ error: string | null }> {
    try {
      await updateDoc(doc(db, COLLECTIONS.COMMENTS, id), { status, updatedAt: serverTimestamp() });
      return { error: null };
    } catch (error) {
      return { error: (error as Error).message };
    }
  },
};

export const bookmarkService = {
  async add(userId: string, articleId: string): Promise<{ error: string | null }> {
    try {
      const ref = doc(collection(db, COLLECTIONS.BOOKMARKS));
      await setDoc(ref, { userId, articleId, createdAt: serverTimestamp() });
      return { error: null };
    } catch (error) {
      return { error: (error as Error).message };
    }
  },

  async remove(userId: string, articleId: string): Promise<{ error: string | null }> {
    try {
      const q = query(
        collection(db, COLLECTIONS.BOOKMARKS),
        where('userId', '==', userId),
        where('articleId', '==', articleId),
        limit(1)
      );
      const snap = await getDocs(q);
      if (!snap.empty) {
        await deleteDoc(snap.docs[0].ref);
      }
      return { error: null };
    } catch (error) {
      return { error: (error as Error).message };
    }
  },

  async getByUser(userId: string): Promise<Bookmark[]> {
    const q = query(collection(db, COLLECTIONS.BOOKMARKS), where('userId', '==', userId), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return fromDocs<Bookmark>(snap.docs);
  },

  async isBookmarked(userId: string, articleId: string): Promise<boolean> {
    const q = query(
      collection(db, COLLECTIONS.BOOKMARKS),
      where('userId', '==', userId),
      where('articleId', '==', articleId),
      limit(1)
    );
    const snap = await getDocs(q);
    return !snap.empty;
  },
};

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    const [articlesSnap, usersSnap] = await Promise.all([
      getDocs(collection(db, COLLECTIONS.ARTICLES)),
      getDocs(collection(db, COLLECTIONS.USERS)),
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

// Individual function exports for backward compatibility
export const getPublishedArticles = articleService.getPublished.bind(articleService);
export const getPublishedArticleBySlug = articleService.getBySlug.bind(articleService);
export const incrementArticleViews = articleService.incrementViews.bind(articleService);
export const getCategories = categoryService.getAll.bind(categoryService);
export const getCategoryBySlug = categoryService.getBySlug.bind(categoryService);
export const getBreakingNews = breakingNewsService.getActive.bind(breakingNewsService);
export const getLatestNews = latestNewsService.getActive.bind(latestNewsService);
export const getSiteSettings = siteSettingsService.get.bind(siteSettingsService);
export const getDashboardStats = dashboardService.getStats.bind(dashboardService);