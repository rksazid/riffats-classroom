import { describe, it, expect } from 'vitest';
import { evaluateQuestion } from '@/features/quizzes/engine';
import { QuestionType } from '@prisma/client';

describe('Assessment Grading Engine', () => {
  it('correctly grades a Single MCQ when the right option is picked', () => {
    const result = evaluateQuestion({
      questionId: 'q-1',
      type: QuestionType.SINGLE_MCQ,
      points: 1.0,
      selectedOptionKeys: ['B'],
      correctOptionKeys: ['B'],
    });

    expect(result.isCorrect).toBe(true);
    expect(result.awardedMarks).toBe(1.0);
  });

  it('rejects a Single MCQ when the wrong option is picked', () => {
    const result = evaluateQuestion({
      questionId: 'q-2',
      type: QuestionType.SINGLE_MCQ,
      points: 1.0,
      selectedOptionKeys: ['A'],
      correctOptionKeys: ['B'],
    });

    expect(result.isCorrect).toBe(false);
    expect(result.awardedMarks).toBe(0);
  });

  it('correctly grades a True/False question', () => {
    const result = evaluateQuestion({
      questionId: 'q-3',
      type: QuestionType.TRUE_FALSE,
      points: 1.0,
      selectedOptionKeys: ['A'], // True
      correctOptionKeys: ['A'],
    });

    expect(result.isCorrect).toBe(true);
    expect(result.awardedMarks).toBe(1.0);
  });

  it('correctly handles Multiple MCQ with full credit when all correct keys are selected', () => {
    const result = evaluateQuestion({
      questionId: 'q-4',
      type: QuestionType.MULTIPLE_MCQ,
      points: 2.0,
      selectedOptionKeys: ['A', 'C'],
      correctOptionKeys: ['A', 'C'],
    });

    expect(result.isCorrect).toBe(true);
    expect(result.awardedMarks).toBe(2.0);
  });

  it('correctly handles Multiple MCQ partial credit when only 1 of 2 is picked', () => {
    const result = evaluateQuestion({
      questionId: 'q-5',
      type: QuestionType.MULTIPLE_MCQ,
      points: 2.0,
      selectedOptionKeys: ['A'],
      correctOptionKeys: ['A', 'C'],
    });

    expect(result.isCorrect).toBe(false);
    expect(result.awardedMarks).toBe(1.0);
  });

  it('grades Fill in the Blank case-insensitively and trimmed', () => {
    const result = evaluateQuestion({
      questionId: 'q-6',
      type: QuestionType.FILL_BLANK,
      points: 1.0,
      selectedOptionKeys: ['  An  '],
      correctOptionKeys: ['an'],
    });

    expect(result.isCorrect).toBe(true);
    expect(result.awardedMarks).toBe(1.0);
  });
});
