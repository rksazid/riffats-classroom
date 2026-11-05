'use server';

import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { QuestionType, Difficulty } from '@prisma/client';

export async function createQuestionAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/sign-in');
  }

  const topicId = formData.get('topicId') as string;
  const gradeLevel = (formData.get('gradeLevel') as string) || 'All Levels';
  const difficulty = (formData.get('difficulty') as Difficulty) || Difficulty.BEGINNER;
  const type = (formData.get('type') as QuestionType) || QuestionType.SINGLE_MCQ;
  const questionText = (formData.get('questionText') as string)?.trim();
  const explanation = (formData.get('explanation') as string)?.trim();
  const points = parseFloat(formData.get('points') as string) || 1.0;
  const tagsStr = (formData.get('tags') as string)?.trim() || '';

  const optA = (formData.get('optA') as string)?.trim();
  const optB = (formData.get('optB') as string)?.trim();
  const optC = (formData.get('optC') as string)?.trim();
  const optD = (formData.get('optD') as string)?.trim();
  const correctOptionKey = formData.get('correctOptionKey') as string; // 'A', 'B', 'C', 'D'

  if (!topicId || !questionText) {
    throw new Error('Topic and Question text are required.');
  }

  const topic = await db.topic.findUnique({
    where: { id: topicId },
  });

  if (!topic) {
    throw new Error('Topic not found.');
  }

  const tags = tagsStr
    ? tagsStr.split(',').map((t) => t.trim().toLowerCase()).filter(Boolean)
    : [];

  const optionsData: { optionKey: string; optionText: string; isCorrect: boolean; orderIndex: number }[] = [];

  if (optA) {
    optionsData.push({
      optionKey: 'A',
      optionText: optA,
      isCorrect: correctOptionKey === 'A',
      orderIndex: 1,
    });
  }
  if (optB) {
    optionsData.push({
      optionKey: 'B',
      optionText: optB,
      isCorrect: correctOptionKey === 'B',
      orderIndex: 2,
    });
  }
  if (optC) {
    optionsData.push({
      optionKey: 'C',
      optionText: optC,
      isCorrect: correctOptionKey === 'C',
      orderIndex: 3,
    });
  }
  if (optD) {
    optionsData.push({
      optionKey: 'D',
      optionText: optD,
      isCorrect: correctOptionKey === 'D',
      orderIndex: 4,
    });
  }

  await db.question.create({
    data: {
      authorId: user.id,
      subjectId: topic.subjectId,
      topicId,
      gradeLevel,
      difficulty,
      type,
      questionText,
      explanation,
      points,
      tags,
      options: {
        create: optionsData,
      },
    },
  });

  revalidatePath('/teacher/question-bank');
  redirect('/teacher/question-bank');
}

