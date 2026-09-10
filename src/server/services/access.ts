import { db } from '../../db/index.ts';
import { entitlements, subscriptions, predictionPackages, users } from '../../db/schema.ts';
import { eq, and, or, gt, isNull } from 'drizzle-orm';

export interface UserAccessCheck {
  hasAccess: boolean;
  reason?: 'admin' | 'vip_subscription' | 'standard_subscription' | 'package_access';
  expiresAt?: Date | null;
}

export async function checkPackageAccess(
  userId: number,
  packageId: number,
  accessLevel: string,
  userRole?: string
): Promise<UserAccessCheck> {
  // 1. Admin gets universal access
  if (userRole === 'admin') {
    return { hasAccess: true, reason: 'admin' };
  }

  const now = new Date();

  // 2. Check for active VIP subscription entitlement (grants access to EVERYTHING)
  const vipEntitlements = await db
    .select()
    .from(entitlements)
    .where(
      and(
        eq(entitlements.userId, userId),
        eq(entitlements.type, 'vip_subscription'),
        eq(entitlements.status, 'active'),
        or(isNull(entitlements.expiresAt), gt(entitlements.expiresAt, now))
      )
    )
    .limit(1);

  if (vipEntitlements.length > 0) {
    return {
      hasAccess: true,
      reason: 'vip_subscription',
      expiresAt: vipEntitlements[0].expiresAt,
    };
  }

  // 3. Check for active Standard subscription if package is standard
  if (accessLevel === 'standard') {
    const standardEntitlements = await db
      .select()
      .from(entitlements)
      .where(
        and(
          eq(entitlements.userId, userId),
          eq(entitlements.type, 'standard_subscription'),
          eq(entitlements.status, 'active'),
          or(isNull(entitlements.expiresAt), gt(entitlements.expiresAt, now))
        )
      )
      .limit(1);

    if (standardEntitlements.length > 0) {
      return {
        hasAccess: true,
        reason: 'standard_subscription',
        expiresAt: standardEntitlements[0].expiresAt,
      };
    }
  }

  // 4. Check for direct package entitlement (pay-per-view unlock)
  const directEntitlements = await db
    .select()
    .from(entitlements)
    .where(
      and(
        eq(entitlements.userId, userId),
        eq(entitlements.packageId, packageId),
        eq(entitlements.status, 'active'),
        or(isNull(entitlements.expiresAt), gt(entitlements.expiresAt, now))
      )
    )
    .limit(1);

  if (directEntitlements.length > 0) {
    return {
      hasAccess: true,
      reason: 'package_access',
      expiresAt: directEntitlements[0].expiresAt,
    };
  }

  return { hasAccess: false };
}

export async function getUserAccessSummary(userId: number, userRole?: string) {
  if (userRole === 'admin') {
    return {
      isAdmin: true,
      isVip: true,
      isStandard: true,
      activeSubscription: {
        tier: 'VIP (Admin Bypass)',
        status: 'active',
        endDate: null,
      },
      unlockedPackageIds: [] as number[],
      allUnlocked: true,
    };
  }

  const now = new Date();

  // Active subscriptions
  const activeSubs = await db
    .select()
    .from(subscriptions)
    .where(and(eq(subscriptions.userId, userId), eq(subscriptions.status, 'active'), gt(subscriptions.endDate, now)))
    .limit(1);

  // Active entitlements
  const activeEntitlements = await db
    .select()
    .from(entitlements)
    .where(
      and(
        eq(entitlements.userId, userId),
        eq(entitlements.status, 'active'),
        or(isNull(entitlements.expiresAt), gt(entitlements.expiresAt, now))
      )
    );

  const isVip = activeEntitlements.some((e) => e.type === 'vip_subscription');
  const isStandard = activeEntitlements.some((e) => e.type === 'standard_subscription');
  const unlockedPackageIds = activeEntitlements
    .filter((e) => e.packageId !== null)
    .map((e) => e.packageId as number);

  return {
    isAdmin: false,
    isVip,
    isStandard,
    activeSubscription: activeSubs.length > 0 ? activeSubs[0] : null,
    unlockedPackageIds,
    allUnlocked: isVip,
  };
}
