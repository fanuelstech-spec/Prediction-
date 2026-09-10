export type AccessLevel = 'standard' | 'vip' | 'pay_per_view';
export type PackageStatus = 'upcoming' | 'in_progress' | 'won' | 'lost' | 'void';
export type MatchStatus = 'pending' | 'won' | 'lost' | 'void';
export type SubscriptionTier = 'standard' | 'vip';
export type PaymentStatus = 'pending' | 'successful' | 'failed' | 'cancelled' | 'expired';

export interface Product {
  id: number;
  slug: string;
  name: string;
  type: 'subscription' | 'pay_per_prediction';
  planTier: 'standard' | 'vip' | 'single';
  price: number;
  currency: string;
  billingPeriod: string;
  description: string;
  features: string; // JSON array string
  isActive: boolean;
}

export interface PredictionPackage {
  id: number;
  title: string;
  slug: string;
  date: string;
  matchCount: number;
  combinedOdds: string;
  category: string;
  accessLevel: AccessLevel;
  price: number;
  confidence: 'High' | 'Very High' | 'Maximum';
  kickoffWindow: string;
  shortDescription: string;
  isPublished: boolean;
  status: PackageStatus;
  resultSummary?: string | null;
  createdAt?: string;
  hasAccess?: boolean;
}

export interface PredictionMatch {
  id: number;
  packageId: number;
  homeTeam: string;
  awayTeam: string;
  league: string;
  kickoffTime: string;
  market: string;
  selection: string;
  odds: string;
  confidence: string;
  analysis?: string | null;
  matchStatus: MatchStatus;
  score?: string | null;
  orderIndex: number;
}

export interface PredictionDetailResponse {
  package: PredictionPackage;
  hasAccess: boolean;
  reason?: string;
  matches: PredictionMatch[];
  lockDetails?: {
    reason: string;
    matchCount: number;
    requiredTier: string;
    price: number;
  };
}

export interface UserProfile {
  id: number;
  uid: string;
  email: string;
  displayName: string | null;
  role: 'user' | 'admin';
  status: 'active' | 'suspended';
}

export interface AccessSummary {
  isAdmin: boolean;
  isVip: boolean;
  isStandard: boolean;
  activeSubscription: {
    id?: number;
    tier: string;
    status: string;
    startDate?: string;
    endDate: string | null;
  } | null;
  unlockedPackageIds: number[];
  allUnlocked: boolean;
}

export interface PaymentRecord {
  id: number;
  reference: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  provider: string;
  providerTransId?: string | null;
  paymentType: string;
  createdAt: string;
  userEmail?: string;
  userName?: string;
}

export interface SubscriptionRecord {
  id: number;
  productId: number;
  tier: string;
  status: string;
  startDate: string;
  endDate: string;
  autoRenew: boolean;
}
