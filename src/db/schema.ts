import { relations } from 'drizzle-orm';
import { boolean, integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

// Users table (maps to Firebase Auth UID)
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  displayName: text('display_name'),
  role: text('role').default('user').notNull(), // 'user' | 'admin'
  status: text('status').default('active').notNull(), // 'active' | 'suspended'
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// User profile extensions
export const profiles = pgTable('profiles', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id)
    .notNull()
    .unique(),
  phoneNumber: text('phone_number'),
  notificationPref: text('notification_pref').default('email'),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Products: standard subscription, VIP subscription, pay-per-prediction tickets
export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  type: text('type').notNull(), // 'subscription' | 'pay_per_prediction'
  planTier: text('plan_tier').notNull(), // 'standard' | 'vip' | 'single'
  price: integer('price').notNull(), // Amount in XAF
  currency: text('currency').default('XAF').notNull(),
  billingPeriod: text('billing_period').default('monthly').notNull(), // 'weekly' | 'monthly' | 'one_time'
  description: text('description').notNull(),
  features: text('features').notNull(), // JSON array string
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Prediction Packages (Metadata publicly readable, match details locked)
export const predictionPackages = pgTable('prediction_packages', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  date: text('date').notNull(), // e.g. "2026-09-12"
  matchCount: integer('match_count').notNull(),
  combinedOdds: text('combined_odds').notNull(), // e.g. "38.50"
  category: text('category').notNull(), // 'Premier Accumulator' | 'VIP Bankroll Builder' | 'Weekend Multi' | 'Single Lock'
  accessLevel: text('access_level').notNull(), // 'standard' | 'vip' | 'pay_per_view'
  price: integer('price').default(3500).notNull(), // Individual price in XAF if purchased standalone
  confidence: text('confidence').default('High').notNull(), // 'High' | 'Very High' | 'Maximum'
  kickoffWindow: text('kickoff_window').notNull(), // e.g. "17:30 - 21:00 GMT"
  shortDescription: text('short_description').notNull(),
  isPublished: boolean('is_published').default(true).notNull(),
  status: text('status').default('upcoming').notNull(), // 'upcoming' | 'in_progress' | 'won' | 'lost' | 'void'
  resultSummary: text('result_summary'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Prediction Matches (Protected: only returned to authorized users)
export const predictionMatches = pgTable('prediction_matches', {
  id: serial('id').primaryKey(),
  packageId: integer('package_id')
    .references(() => predictionPackages.id)
    .notNull(),
  homeTeam: text('home_team').notNull(),
  awayTeam: text('away_team').notNull(),
  league: text('league').notNull(), // e.g. "English Premier League", "UEFA Champions League"
  kickoffTime: text('kickoff_time').notNull(), // e.g. "19:45 GMT"
  market: text('market').notNull(), // e.g. "Over 1.5 Goals", "Both Teams to Score & Over 2.5"
  selection: text('selection').notNull(), // e.g. "Over 1.5", "Yes & Over 2.5"
  odds: text('odds').notNull(), // e.g. "1.42"
  confidence: text('confidence').default('High').notNull(), // 'High' | 'Very High' | 'Elite'
  analysis: text('analysis'), // Detailed statistical and tactical rationale
  matchStatus: text('match_status').default('pending').notNull(), // 'pending' | 'won' | 'lost' | 'void'
  score: text('score'),
  orderIndex: integer('order_index').default(0).notNull(),
});

// User Subscriptions (Standard or VIP)
export const subscriptions = pgTable('subscriptions', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id)
    .notNull(),
  productId: integer('product_id')
    .references(() => products.id)
    .notNull(),
  tier: text('tier').notNull(), // 'standard' | 'vip'
  status: text('status').default('active').notNull(), // 'active' | 'cancelled' | 'expired'
  startDate: timestamp('start_date').defaultNow().notNull(),
  endDate: timestamp('end_date').notNull(),
  autoRenew: boolean('auto_renew').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Payments (Track Fapshi transactions, idempotency and statuses)
export const payments = pgTable('payments', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id)
    .notNull(),
  productId: integer('product_id').references(() => products.id),
  packageId: integer('package_id').references(() => predictionPackages.id),
  reference: text('reference').notNull().unique(), // Internal unique reference APX-...
  provider: text('provider').default('fapshi').notNull(),
  providerTransId: text('provider_trans_id'),
  amount: integer('amount').notNull(),
  currency: text('currency').default('XAF').notNull(),
  status: text('status').default('pending').notNull(), // 'pending' | 'successful' | 'failed' | 'cancelled' | 'expired'
  paymentType: text('payment_type').notNull(), // 'subscription' | 'pay_per_prediction'
  rawResponse: text('raw_response'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Entitlements: The source of truth for authorization
export const entitlements = pgTable('entitlements', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id)
    .notNull(),
  paymentId: integer('payment_id').references(() => payments.id),
  type: text('type').notNull(), // 'package_access' | 'standard_subscription' | 'vip_subscription'
  packageId: integer('package_id').references(() => predictionPackages.id),
  status: text('status').default('active').notNull(), // 'active' | 'revoked' | 'expired'
  grantedBy: text('granted_by').default('payment').notNull(), // 'payment' | 'admin'
  expiresAt: timestamp('expires_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Audit Logs for administrative and financial transparency
export const auditLogs = pgTable('audit_logs', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  action: text('action').notNull(),
  details: text('details').notNull(),
  ipAddress: text('ip_address'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(profiles, { fields: [users.id], references: [profiles.userId] }),
  subscriptions: many(subscriptions),
  payments: many(payments),
  entitlements: many(entitlements),
  auditLogs: many(auditLogs),
}));

export const predictionPackagesRelations = relations(predictionPackages, ({ many }) => ({
  matches: many(predictionMatches),
  entitlements: many(entitlements),
}));

export const predictionMatchesRelations = relations(predictionMatches, ({ one }) => ({
  package: one(predictionPackages, {
    fields: [predictionMatches.packageId],
    references: [predictionPackages.id],
  }),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  user: one(users, { fields: [payments.userId], references: [users.id] }),
  product: one(products, { fields: [payments.productId], references: [products.id] }),
  package: one(predictionPackages, {
    fields: [payments.packageId],
    references: [predictionPackages.id],
  }),
}));

export const entitlementsRelations = relations(entitlements, ({ one }) => ({
  user: one(users, { fields: [entitlements.userId], references: [users.id] }),
  payment: one(payments, { fields: [entitlements.paymentId], references: [payments.id] }),
  package: one(predictionPackages, {
    fields: [entitlements.packageId],
    references: [predictionPackages.id],
  }),
}));
