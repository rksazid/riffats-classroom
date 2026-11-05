'use server';

import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { createSession, destroySession } from '@/lib/auth';
import { Role } from '@prisma/client';

export async function signInDemoAction(userId: string) {
  const user = await db.user.findUnique({
    where: { id: userId },
    include: { roles: true },
  });

  if (!user || !user.isActive) {
    throw new Error('User not found or inactive');
  }

  await createSession(user.id);

  // Redirect based on primary role
  const isTeacherOrAdmin = user.roles.some((r) =>
    ([Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER] as Role[]).includes(r.role)
  );

  if (isTeacherOrAdmin) {
    redirect('/teacher/dashboard');
  } else {
    redirect('/student/dashboard');
  }
}

export async function signInWithEmailAction(formData: FormData) {
  const email = formData.get('email') as string;
  const name = formData.get('name') as string;
  const gradeLevel = formData.get('gradeLevel') as string;

  if (!email) {
    throw new Error('Email is required');
  }

  let user = await db.user.findUnique({
    where: { email: email.toLowerCase().trim() },
    include: { roles: true },
  });

  if (!user) {
    // Create new student user
    user = await db.user.create({
      data: {
        email: email.toLowerCase().trim(),
        name: name || 'Student',
        gradeLevel: gradeLevel || 'All Levels',
        roles: {
          create: [{ role: Role.STUDENT }],
        },
      },
      include: { roles: true },
    });
  }

  await createSession(user.id);
  redirect('/student/dashboard');
}

export async function signOutAction() {
  await destroySession();
  redirect('/');
}
