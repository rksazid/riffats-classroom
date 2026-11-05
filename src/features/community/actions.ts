'use server';

import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createThreadAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/sign-in');
  }

  const categoryId = formData.get('categoryId') as string;
  const title = (formData.get('title') as string)?.trim();
  const content = (formData.get('content') as string)?.trim();

  if (!categoryId || !title || !content) {
    throw new Error('Category, title, and question content are required.');
  }

  const slug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 50)}-${Date.now()}`;

  const thread = await db.forumThread.create({
    data: {
      categoryId,
      authorId: user.id,
      title,
      slug,
      content,
    },
  });

  revalidatePath('/community');
  redirect(`/community/threads/${thread.slug}`);
}

export async function createReplyAction(threadId: string, threadSlug: string, formData: FormData) {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/sign-in');
  }

  const content = (formData.get('content') as string)?.trim();
  if (!content) {
    throw new Error('Reply content cannot be empty.');
  }

  await db.forumPost.create({
    data: {
      threadId,
      authorId: user.id,
      content,
    },
  });

  revalidatePath(`/community/threads/${threadSlug}`);
}
