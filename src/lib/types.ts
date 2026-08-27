export type Role = 'ADMIN' | 'EDITOR' | 'AUTHOR' | 'READER';
export type UserRole = Role;

export interface UserSession {
  id: string;
  email: string;
  name?: string | null;
  displayName: string;
  avatarUrl?: string | null;
  role: Role;
  provider?: string;
  isBlocked?: boolean;
}

export type ArticleStatus = 'DRAFT' | 'IN_REVIEW' | 'PUBLISHED' | 'ARCHIVED';

export type CoverSourceType = 'SELF_SHOT' | 'FREE_STOCK' | 'AI_GENERATED';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
  isIndexable: boolean;
  sortOrder: number;
}

export interface Series {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  coverImageUrl?: string | null;
  isPublished: boolean;
  sortOrder: number;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  contentMarkdown: string;
  status: ArticleStatus;
  isSponsored: boolean;
  sponsorName?: string | null;
  sponsorUrl?: string | null;
  coverImageUrl?: string | null;
  coverImageSourceType?: CoverSourceType | null;
  readingTime: number;
  viewCount: number;
  helpfulVotes: number;
  unhelpfulVotes: number;
  isIndexable: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
  publishedAt?: Date | string | null;
  categoryId: string;
  category?: Category;
  seriesId?: string | null;
  series?: Series | null;
  seriesOrder?: number | null;
  authorId: string;
  author?: UserSession;
  reviewerId?: string | null;
  reviewer?: UserSession | null;
  reviewNote?: string | null;
  tags?: { tag: Tag }[];
  comments?: CommentItem[];
  feedbacks?: ArticleFeedbackItem[];
  _count?: {
    comments: number;
    bookmarks: number;
  };
}

export interface DocModuleItem {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  sortOrder: number;
  articles?: any[];
}

export interface GlossaryTerm {
  id: string;
  term: string;
  slug: string;
  category: string;
  shortDef: string;
  definition: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  author?: { displayName: string };
}

export interface CommentItem {
  id: string;
  content: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  articleId: string;
  userId: string;
  user: {
    id: string;
    displayName: string;
    avatarUrl?: string | null;
    role: Role;
  };
}

export interface ArticleFeedbackItem {
  id: string;
  isHelpful: boolean;
  reaction?: string | null;
  createdAt: Date | string;
  articleId: string;
}

export interface AdSlot {
  id: string;
  slotName: 'top_banner' | 'below_hero' | 'leaderboard' | 'in_feed' | 'sidebar_sticky' | string;
  title: string;
  description?: string | null;
  imageUrl?: string | null;
  targetUrl: string;
  sponsorName: string;
  ctaLabel?: string;
  isActive: boolean;
}
