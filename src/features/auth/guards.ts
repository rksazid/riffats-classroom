import { redirect } from 'next/navigation';
import { getCurrentUser, UserSession } from '@/lib/auth';
import { Role } from '@prisma/client';

export class AuthorizationError extends Error {
  constructor(message: string = 'Forbidden: Insufficient privileges') {
    super(message);
    this.name = 'AuthorizationError';
  }
}

/**
 * Ensures user is authenticated. If not, redirects to /sign-in
 */
export async function requireUser(): Promise<UserSession> {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/sign-in');
  }
  return user;
}

/**
 * Ensures user has at least one of the specified roles.
 */
export async function requireRole(allowedRoles: Role[]): Promise<UserSession> {
  const user = await requireUser();
  const hasRole = user.roles.some((r) => allowedRoles.includes(r));
  if (!hasRole) {
    throw new AuthorizationError(
      `Access denied. Requires one of: ${allowedRoles.join(', ')}`
    );
  }
  return user;
}

/**
 * Convenience guard for Teachers and Administrators
 */
export async function requireTeacher(): Promise<UserSession> {
  return requireRole([Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER]);
}

/**
 * Convenience guard for Administrators
 */
export async function requireAdmin(): Promise<UserSession> {
  return requireRole([Role.SUPER_ADMIN, Role.ADMIN]);
}

/**
 * Convenience guard for Platform Super Admin
 */
export async function requireSuperAdmin(): Promise<UserSession> {
  return requireRole([Role.SUPER_ADMIN]);
}

