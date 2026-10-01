export type BookCategory = 
  | 'ROMAN'
  | 'SF'
  | 'THRILLER'
  | 'DÉVELOPPEMENT'
  | 'BUSINESS'
  | 'ESSAI'
  | 'HISTOIRE'
  | 'BD_MANGA';

export interface ComicPage {
  pageNumber: number;
  imageUrl: string;
  caption?: string;
}

export interface BookChapter {
  id: string;
  title: string;
  subtitle?: string;
  paragraphs: string[];
}

export interface Book {
  id: string;
  title: string;
  author: string;
  category: BookCategory;
  price: number; // Base price in EUR
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  coverUrl: string;
  description: string;
  pages: number;
  publishedYear: number;
  fileSize: string;
  r2FileKey: string;
  formats: ('EPUB' | 'PDF' | 'CBZ' | 'CBR')[];
  excerpt: string[];
  chapters?: BookChapter[];
  isFeatured?: boolean;
  isNewRelease?: boolean;
  isComic?: boolean;
  comicType?: 'bd' | 'manga' | 'comics';
  comicPages?: ComicPage[];
}

export interface Bundle {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  bookIds: string[];
  price: number; // Base price in EUR
  originalPrice: number;
  discountPercentage: number;
  coverImage: string;
  viewsCount?: number;
  salesCount?: number;
  isBestSeller?: boolean;
}

export interface CartItem {
  type: 'book' | 'bundle';
  id: string;
  title: string;
  authorOrSubtitle: string;
  price: number; // Base price in EUR
  coverUrl: string;
  bookIds: string[]; // for bundles, all book IDs
}

export interface Order {
  id: string;
  customerEmail: string;
  totalAmount: number;
  currency?: string;
  items: CartItem[];
  createdAt: string;
  status: 'paid' | 'pending' | 'failed';
  stripePaymentId: string;
  affiliateRef?: string;
  commissionAmount?: number;
}

export type AdminRole = 'super_admin' | 'editor';

export interface AffiliateUser {
  refCode: string;
  email: string;
  commissionRate: number; // e.g. 0.15 (15%) or 0.25 (25%)
  totalEarnings: number;
  pendingPayout: number;
  clicksCount: number;
  salesCount: number;
}

export interface SignedDownloadToken {
  bookId: string;
  bookTitle: string;
  format: 'EPUB' | 'PDF';
  token: string;
  url: string;
  expiresAt: number; // timestamp
}

export interface BookOrderRequest {
  id: string;
  bookTitle: string;
  authorName?: string;
  notes?: string;
  whatsappNumber: string;
  createdAt: string;
  status: 'pending' | 'notified';
}

export interface AffiliatePayoutRequest {
  id: string;
  affiliateEmail: string;
  refCode: string;
  amount: number;
  paymentMethod: 'WAVE' | 'ORANGE_MONEY' | 'MTN_MOMO' | 'PAYPAL' | 'BANK_TRANSFER';
  paymentDetails: string;
  accountHolderName: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: string;
  processedAt?: string;
  transactionReference?: string;
}

export interface SecurityAuditLog {
  id: string;
  action: string;
  performedBy: string;
  timestamp: string;
  details: string;
  status: 'success' | 'warning' | 'blocked';
}

