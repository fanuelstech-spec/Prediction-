import { Request, Response, NextFunction } from 'express';
import { adminAuth } from '../../lib/firebase-admin.ts';
import { getOrCreateUser } from '../../db/users.ts';
import { db } from '../../db/index.ts';
import { users } from '../../db/schema.ts';
import { eq } from 'drizzle-orm';

export interface AuthRequest extends Request {
  user?: {
    id: number;
    uid: string;
    email: string;
    displayName: string | null;
    role: string;
    status: string;
  } | null;
  firebaseUser?: any;
}

export async function optionalAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const demoRole = req.headers['x-demo-role'] as string | undefined;

  // 1. Handle Demo Role header for testing/reviewing
  if (demoRole) {
    try {
      const demoEmail = demoRole === 'admin' ? 'admin@apexfootball.com' :
                        demoRole === 'vip' ? 'vip_member@apexfootball.com' :
                        demoRole === 'standard' ? 'standard_user@apexfootball.com' :
                        'visitor@apexfootball.com';
      const demoUid = `demo_uid_${demoRole}`;
      const demoName = `${demoRole.toUpperCase()} Analyst`;
      
      const dbUser = await getOrCreateUser(demoUid, demoEmail, demoName);
      if (demoRole === 'admin' && dbUser.role !== 'admin') {
        await db.update(users).set({ role: 'admin' }).where(eq(users.id, dbUser.id));
        dbUser.role = 'admin';
      } else if (demoRole === 'vip') {
        const { entitlements } = await import('../../db/schema.ts');
        const { and, eq } = await import('drizzle-orm');
        const activeEnt = await db
          .select()
          .from(entitlements)
          .where(and(eq(entitlements.userId, dbUser.id), eq(entitlements.type, 'vip_subscription'), eq(entitlements.status, 'active')));
        if (activeEnt.length === 0) {
          await db.insert(entitlements).values({
            userId: dbUser.id,
            type: 'vip_subscription',
            status: 'active',
            grantedBy: 'demo',
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          });
        }
      } else if (demoRole === 'standard') {
        const { entitlements } = await import('../../db/schema.ts');
        const { and, eq } = await import('drizzle-orm');
        const activeEnt = await db
          .select()
          .from(entitlements)
          .where(and(eq(entitlements.userId, dbUser.id), eq(entitlements.type, 'standard_subscription'), eq(entitlements.status, 'active')));
        if (activeEnt.length === 0) {
          await db.insert(entitlements).values({
            userId: dbUser.id,
            type: 'standard_subscription',
            status: 'active',
            grantedBy: 'demo',
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          });
        }
      }
      req.user = dbUser;
      return next();
    } catch (err) {
      console.error('Error with demo user:', err);
    }
  }

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.user = null;
    return next();
  }

  const token = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    req.firebaseUser = decodedToken;
    const dbUser = await getOrCreateUser(
      decodedToken.uid,
      decodedToken.email || `${decodedToken.uid}@apexpicks.com`,
      decodedToken.name || decodedToken.email?.split('@')[0]
    );
    req.user = dbUser;
  } catch (error) {
    // If token verification fails (e.g. invalid or expired), continue as unauthenticated
    req.user = null;
  }

  next();
}

export async function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  await optionalAuth(req, res, () => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized: Authentication required.' });
    }
    if (req.user.status === 'suspended') {
      return res.status(403).json({ error: 'Account suspended. Please contact support.' });
    }
    next();
  });
}

export async function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  await requireAuth(req, res, () => {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: Admin privileges required.' });
    }
    next();
  });
}
