'use server';

import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function enrollInCourseAction(courseId: string, courseSlug: string) {
  const user = await getCurrentUser();
  if (!user) {
    redirect(`/sign-in?returnTo=/courses/${courseSlug}`);
  }

  await db.courseEnrollment.upsert({
    where: {
      courseId_userId: {
        courseId,
        userId: user.id,
      },
    },
    update: {},
    create: {
      courseId,
      userId: user.id,
      status: 'ACTIVE',
    },
  });

  revalidatePath(`/courses/${courseSlug}`);
  revalidatePath('/student/dashboard');
  redirect(`/courses/${courseSlug}`);
}

