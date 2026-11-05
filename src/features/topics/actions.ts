'use server';

import { db } from '@/lib/db';
import { requireAdmin } from '@/features/auth/guards';
import { revalidatePath } from 'next/cache';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function createTopicAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const name = (formData.get('name') as string)?.trim();
  const subjectId = (formData.get('subjectId') as string)?.trim();
  const orderIndex = parseInt((formData.get('orderIndex') as string) || '0', 10);

  if (!name || !subjectId) {
    throw new Error('Topic name and subject are required.');
  }

  const baseSlug = slugify(name);
  let slug = baseSlug;
  let counter = 1;

  // Ensure unique slug within subject
  while (await db.topic.findUnique({ where: { subjectId_slug: { subjectId, slug } } })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  await db.topic.create({
    data: {
      name,
      slug,
      subjectId,
      orderIndex: isNaN(orderIndex) ? 0 : orderIndex,
    },
  });

  revalidatePath('/admin/topics');
  revalidatePath('/lessons');
  revalidatePath('/courses');
  revalidatePath('/teacher/lessons/new');
  revalidatePath('/teacher/question-bank/new');
}

export async function updateTopicAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = (formData.get('id') as string)?.trim();
  const name = (formData.get('name') as string)?.trim();
  const orderIndex = parseInt((formData.get('orderIndex') as string) || '0', 10);

  if (!id || !name) {
    throw new Error('Topic ID and name are required.');
  }

  await db.topic.update({
    where: { id },
    data: {
      name,
      orderIndex: isNaN(orderIndex) ? 0 : orderIndex,
    },
  });

  revalidatePath('/admin/topics');
  revalidatePath('/lessons');
  revalidatePath('/courses');
  revalidatePath('/teacher/lessons/new');
  revalidatePath('/teacher/question-bank/new');
}

export async function deleteTopicAction(topicId: string): Promise<void> {
  await requireAdmin();

  if (!topicId) return;

  // Check if topic has associated lessons or questions
  const topic = await db.topic.findUnique({
    where: { id: topicId },
    include: {
      _count: {
        select: { lessons: true, questions: true, quizzes: true },
      },
    },
  });

  if (!topic) return;

  if (topic._count.lessons > 0 || topic._count.questions > 0 || topic._count.quizzes > 0) {
    throw new Error(
      `Cannot delete topic "${topic.name}" because it contains ${topic._count.lessons} lessons, ${topic._count.questions} questions, and ${topic._count.quizzes} quizzes. Please reassign or delete them first.`
    );
  }

  await db.topic.delete({
    where: { id: topicId },
  });

  revalidatePath('/admin/topics');
  revalidatePath('/lessons');
  revalidatePath('/courses');
}

export async function createSubtopicAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const topicId = (formData.get('topicId') as string)?.trim();
  const name = (formData.get('name') as string)?.trim();

  if (!topicId || !name) {
    throw new Error('Topic and subtopic name are required.');
  }

  const baseSlug = slugify(name);
  let slug = baseSlug;
  let counter = 1;

  while (await db.subtopic.findUnique({ where: { topicId_slug: { topicId, slug } } })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  await db.subtopic.create({
    data: {
      name,
      slug,
      topicId,
    },
  });

  revalidatePath('/admin/topics');
  revalidatePath('/teacher/question-bank/new');
}

export async function deleteSubtopicAction(subtopicId: string): Promise<void> {
  await requireAdmin();

  if (!subtopicId) return;

  await db.subtopic.delete({
    where: { id: subtopicId },
  });

  revalidatePath('/admin/topics');
  revalidatePath('/teacher/question-bank/new');
}
