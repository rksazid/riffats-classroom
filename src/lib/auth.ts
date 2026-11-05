import { cookies } from 'next/headers';
import { db } from './db';
import { Role } from '@prisma/client';

export interface UserSession {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  gradeLevel?: string | null;
  roles: Role[];
}

export const SESSION_COOKIE_NAME = 'rc_session_token';

/**
 * Retrieves the current session user on the server (Server Components & Server Actions)
 */
export async function getCurrentUser(): Promise<UserSession | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!token) return null;

    // Check session in database
    const session = await db.session.findUnique({
      where: { sessionToken: token },
      include: {
        user: {
          include: {
            roles: true,
          },
        },
      },
    });

    if (!session || session.expiresAt < new Date()) {
      return null;
    }

    if (!session.user || !session.user.isActive) {
      return null;
    }

    return {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      image: session.user.image,
      gradeLevel: session.user.gradeLevel,
      roles: session.user.roles.map((r) => r.role),
    };
  } catch (error: any) {
    if (error?.digest === 'DYNAMIC_SERVER_USAGE' || error?.digest?.startsWith('NEXT_')) {
      throw error;
    }
    console.error('Error fetching current user:', error);
    return null;
  }
}

/**
 * Creates a persistent database session for a user and sets the HTTP-only cookie
 */
export async function createSession(userId: string): Promise<string> {
  const cookieStore = await cookies();
  const token = `rc_${crypto.randomUUID()}_${Date.now()}`;
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

  await db.session.create({
    data: {
      userId,
      sessionToken: token,
      expiresAt,
    },
  });

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: expiresAt,
  });

  return token;
}

/**
 * Destroys the active session and clears the cookie
 */
export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (token) {
    try {
      await db.session.delete({
        where: { sessionToken: token },
      });
    } catch {
      // Ignore if already deleted
    }
    cookieStore.delete(SESSION_COOKIE_NAME);
  }
}
