import { NextRequest, NextResponse } from 'next/server';
import { getPublishedArticles } from '@/lib/firebase/firestore';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || '';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '12', 10);

    if (query.length < 2) {
      return NextResponse.json({
        articles: [],
        total: 0,
        page: 1,
        limit,
        hasMore: false,
      });
    }

    const result = await getPublishedArticles({
      page,
      limit: limit + 1,
      search: query,
      sortBy: 'publishedAt',
      sortOrder: 'desc',
    });

    const hasMore = result.articles.length > limit;
    const articles = hasMore ? result.articles.slice(0, limit) : result.articles;

    return NextResponse.json({
      articles,
      total: result.total,
      page,
      limit,
      hasMore,
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Gagal melakukan pencarian' },
      { status: 500 }
    );
  }
}