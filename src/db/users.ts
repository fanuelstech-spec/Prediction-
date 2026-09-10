import { db } from './index.ts';
import { users, profiles } from './schema.ts';
import { eq } from 'drizzle-orm';

export async function getOrCreateUser(uid: string, email: string, displayName?: string) {
  // Check if user exists
  const existing = await db.select().from(users).where(eq(users.uid, uid)).limit(1);
  
  if (existing.length > 0) {
    // If email or name changed, update
    const updated = await db
      .update(users)
      .set({
        email,
        ...(displayName ? { displayName } : {}),
      })
      .where(eq(users.uid, uid))
      .returning();
    return updated[0];
  }

  // Create new user (automatically assign admin to creator email or if email starts with admin)
  const isAdmin = email === 'fanueldx25@gmail.com' || email.includes('admin');
  const inserted = await db
    .insert(users)
    .values({
      uid,
      email,
      displayName: displayName || email.split('@')[0],
      role: isAdmin ? 'admin' : 'user',
      status: 'active',
    })
    .returning();

  const newUser = inserted[0];

  // Also create initial profile record
  try {
    await db.insert(profiles).values({
      userId: newUser.id,
      notificationPref: 'email',
    }).onConflictDoNothing();
  } catch (err) {
    console.error('Error creating user profile:', err);
  }

  return newUser;
}
