export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  imageUrl: string;
  author: string;
  date: string;
  readTime: string;
  isBreaking: boolean;
  isLive: boolean;
}

export const MOCK_ARTICLES: Article[] = [
  {
    id: "1",
    title: "Breaking: Major Development in UK Politics",
    slug: "breaking-major-development-uk-politics",
    excerpt: "Latest updates from Westminster as Parliament sits for emergency debate",
    content: "<p>...full article content here...</p>",
    category: "Politics",
    imageUrl: "https://images.unsplash.com/photo-1486406146926-c624f9c6d5b3?w=800&h=400&fit=crop",
    author: "Frankfurt Oder",
    date: "2024-12-15",
    readTime: "8 min",
    isBreaking: true,
    isLive: false,
  },
  {
    id: "2",
    title: "Climate Summit 2024: World Leaders Make New Pledges",
    slug: "climate-summit-2024-world-leaders-pledges",
    excerpt: "Global leaders converge for accelerated climate action at COP30",
    content: "<p>...full article content here...</p>",
    category: "Environment",
    imageUrl: "https://images.unsplash.com/photo-1469474965020-28902c82c346?w=800&h=400&fit=crop",
    author: "Environment Correspondent",
    date: "2024-12-14",
    readTime: "12 min",
    isBreaking: false,
    isLive: false,
  },
  {
    id: "3",
    title: "Financial Markets React to Unexpected Election Results",
    slug: "financial-markets-react-election-results",
    excerpt: "Stocks fluctuate as investors digest surprise political shift in key economy",
    content: "<p>...full article content here...</p>",
    category: "Business",
    imageUrl: "https://images.unsplash.com/photo-1558655146-9dfd6bc3b0e4?w=800&h=400&fit=crop",
    author: "Business Correspondent",
    date: "2024-12-13",
    readTime: "10 min",
    isBreaking: true,
    isLive: false,
  },
  {
    id: "4",
    title: "Tech Giants Face New Regulation Overseas",
    slug: "tech-giants-face-new-regulation-overseas",
    excerpt: "New rules proposed to limit market power of major technology companies",
    content: "<p>...full article content here...</p>",
    category: "Technology",
    imageUrl: "https://images.unsplash.com/photo-1514243318-c2e984f18f2d?w=800&h=400&fit=crop",
    author: "Technology Correspondent",
    date: "2024-12-12",
    readTime: "9 min",
    isBreaking: false,
    isLive: false,
  },
  {
    id: "5",
    title: "Entertainment Awards: Who Won Big at This Year's Ceremony",
    slug: "entertainment-awards-who-won-big",
    excerpt: "Stars walk the red carpet as ceremony celebrates best in film and music",
    content: "<p>...full article content here...</p>",
    category: "Entertainment",
    imageUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&h=400&fit=crop",
    author: "Entertainment Correspondent",
    date: "2024-12-11",
    readTime: "7 min",
    isBreaking: false,
    isLive: false,
  },
  {
    id: "6",
    title: "Women's Football Gains Major Sponsorship Deals",
    slug: "womens-football-gains-sponsorship-deals",
    excerpt: "Record investment announced as sport continues growth trajectory",
    content: "<p>...full article content here...</p>",
    category: "Sport",
    imageUrl: "https://images.unsplash.com/photo-1531503622312-3a06c6f0b76b?w=800&h=400&fit=crop",
    author: "Sport Correspondent",
    date: "2024-12-10",
    readTime: "8 min",
    isBreaking: false,
    isLive: false,
  },
  {
    id: "7",
    title: "Opinion: Why Universal Basic Income Is Gaining Traction",
    slug: "opinion-universal-basic-income-gaining-traction",
    excerpt: "Experts argue the time has come for comprehensive social safety nets",
    content: "<p>...full article content here...</p>",
    category: "Opinion",
    imageUrl: "https://images.unsplash.com/photo-1522071820081-009f012e1650?w=800&h=400&fit=crop",
    author: "Opinion Writer",
    date: "2024-12-09",
    readTime: "6 min",
    isBreaking: false,
    isLive: false,
  },
  {
    id: "8",
    title: "Live: Major Breaking News Update",
    slug: "live-major-breaking-news-update",
    excerpt: "Following developments as they happen",
    content: "<p>...full article content here...</p>",
    category: "News",
    imageUrl: "https://images.unsplash.com/photo-1486406146926-c624f9c6d5b3?w=800&h=400&fit=crop",
    author: "Breaking News Team",
    date: "2024-12-15",
    readTime: "Live",
    isBreaking: true,
    isLive: true,
  },
];

export const MOCK_CATEGORIES = [
  { id: "politics", name: "Politics", count: 25 },
  { id: "business", name: "Business", count: 15 },
  { id: "technology", name: "Technology", count: 20 },
  { id: "entertainment", name: "Entertainment", count: 18 },
  { id: "sport", name: "Sport", count: 12 },
  { id: "environment", name: "Environment", count: 10 },
  { id: "opinion", name: "Opinion", count: 8 },
];