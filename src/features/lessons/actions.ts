'use server';

import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function markLessonCompleteAction(lessonId: string) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('You must be signed in to mark a lesson as completed.');
  }

  await db.lessonProgress.upsert({
    where: {
      userId_lessonId: {
        userId: user.id,
        lessonId,
      },
    },
    update: {
      isCompleted: true,
      completedAt: new Date(),
    },
    create: {
      userId: user.id,
      lessonId,
      isCompleted: true,
      completedAt: new Date(),
    },
  });

  revalidatePath(`/lessons`);
}

export async function createLessonAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/sign-in');
  }

  const title = (formData.get('title') as string)?.trim();
  const summary = (formData.get('summary') as string)?.trim();
  const topicId = formData.get('topicId') as string;
  const gradeLevel = (formData.get('gradeLevel') as string) || 'Class 6 - 8';
  const difficulty = (formData.get('difficulty') as any) || 'BEGINNER';
  const durationMinutes = parseInt(formData.get('durationMinutes') as string) || 15;
  const videoProvider = (formData.get('videoProvider') as any) || 'YOUTUBE';
  const videoUrl = (formData.get('videoUrl') as string)?.trim();
  const content = (formData.get('content') as string)?.trim();

  if (!title || !topicId || !content) {
    throw new Error('Title, Topic, and Content are required.');
  }

  const topic = await db.topic.findUnique({
    where: { id: topicId },
  });

  if (!topic) {
    throw new Error('Topic not found.');
  }

  const slug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 50)}-${Date.now()}`;

  const lesson = await db.lesson.create({
    data: {
      title,
      slug,
      summary,
      content,
      subjectId: topic.subjectId,
      topicId,
      gradeLevel,
      difficulty,
      durationMinutes,
      videoProvider,
      videoUrl: videoUrl || null,
      teacherId: user.id,
      isPublished: true,
      publishedAt: new Date(),
    },
  });

  revalidatePath('/lessons');
  revalidatePath('/teacher/lessons');
  redirect(`/lessons/${lesson.slug}`);
}
