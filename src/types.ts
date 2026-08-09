export type ArticleCategory = 'asd' | 'adhd' | 'ld' | 'tics' | 'tms';

export interface Citation {
  title: string;
  sourceName: string;
  url: string;
  doi?: string;
  publicationYear: number;
}

export interface Article {
  id: string;
  title: string;
  category: ArticleCategory;
  summary: string;
  content: string; // Detailed content (~ 250-400 words, practical)
  actionableTakeaways: string[]; // 3-5 immediate practical steps
  citations: Citation[];
  status: 'published' | 'draft_pending' | 'rejected';
  createdAt: string;
  updatedAt: string;
  batchWeek: string; // e.g., "2026-W31"
  author: string;
  approvedBy?: string;
  readTime: string; // e.g. "3 นาที"
  viewsCount: number;
  bookmarked?: boolean;
}

export type UserRole = 'guest' | 'user' | 'admin';
export type AdminRequestStatus = 'none' | 'pending' | 'approved' | 'rejected';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  adminRequestStatus: AdminRequestStatus;
  adminRequestReason?: string;
  adminRequestedAt?: string;
}

export interface WeeklyBatchLog {
  id: string;
  weekLabel: string; // e.g. "สัปดาห์ที่ 31 (3-9 ส.ค. 2026)"
  timestamp: string;
  totalGenerated: number;
  categoriesCovered: number;
  status: 'completed' | 'processing' | 'failed';
  note: string;
}

export interface CategoryInfo {
  id: ArticleCategory;
  nameTh: string;
  nameEn: string;
  shortDesc: string;
  color: string;
  iconName: string;
}
