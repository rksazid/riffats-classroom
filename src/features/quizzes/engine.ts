import { QuestionType } from '@prisma/client';

export interface EvaluatedQuestion {
  questionId: string;
  type: QuestionType;
  points: number;
  selectedOptionKeys: string[];
  textAnswer?: string | null;
  correctOptionKeys: string[];
  correctText?: string | null;
}

export interface QuestionGradingResult {
  questionId: string;
  isCorrect: boolean;
  awardedMarks: number;
  totalPossibleMarks: number;
}

/**
 * Server-side evaluation of an individual question attempt
 */
export function evaluateQuestion(q: EvaluatedQuestion): QuestionGradingResult {
  const { type, points, selectedOptionKeys, textAnswer, correctOptionKeys, correctText } = q;

  let isCorrect = false;
  let awardedMarks = 0;

  switch (type) {
    case QuestionType.SINGLE_MCQ:
    case QuestionType.TRUE_FALSE: {
      if (
        selectedOptionKeys.length === 1 &&
        correctOptionKeys.length === 1 &&
        selectedOptionKeys[0] === correctOptionKeys[0]
      ) {
        isCorrect = true;
        awardedMarks = points;
      }
      break;
    }

    case QuestionType.MULTIPLE_MCQ: {
      // Check if exact match of sets
      const selectedSet = new Set(selectedOptionKeys);
      const correctSet = new Set(correctOptionKeys);

      if (
        selectedSet.size === correctSet.size &&
        [...selectedSet].every((k) => correctSet.has(k))
      ) {
        isCorrect = true;
        awardedMarks = points;
      } else {
        // Partial credit: count correctly selected minus incorrectly selected
        let correctCount = 0;
        let incorrectCount = 0;
        for (const k of selectedSet) {
          if (correctSet.has(k)) correctCount++;
          else incorrectCount++;
        }
        if (correctSet.size > 0) {
          const rawScore = (correctCount - incorrectCount) / correctSet.size;
          awardedMarks = Math.max(0, Math.round(rawScore * points * 100) / 100);
          isCorrect = awardedMarks === points;
        }
      }
      break;
    }

    case QuestionType.FILL_BLANK:
    case QuestionType.SHORT_ANSWER: {
      // Check option keys or text comparison
      const studentInput = (textAnswer || selectedOptionKeys[0] || '').trim().toLowerCase();
      
      // Compare with correct text or correct options
      const isMatchOption = correctOptionKeys.some(
        (key) => key.trim().toLowerCase() === studentInput
      );
      const isMatchText = correctText
        ? correctText.trim().toLowerCase() === studentInput
        : false;

      if (isMatchOption || isMatchText) {
        isCorrect = true;
        awardedMarks = points;
      }
      break;
    }

    case QuestionType.MATCHING:
    case QuestionType.ORDERING: {
      const selectedSet = new Set(selectedOptionKeys);
      const correctSet = new Set(correctOptionKeys);

      if (
        selectedSet.size === correctSet.size &&
        [...selectedSet].every((k) => correctSet.has(k))
      ) {
        isCorrect = true;
        awardedMarks = points;
      }
      break;
    }

    default: {
      // Long form / subjective questions default to 0 until teacher manually grades
      isCorrect = false;
      awardedMarks = 0;
      break;
    }
  }

  return {
    questionId: q.questionId,
    isCorrect,
    awardedMarks,
    totalPossibleMarks: points,
  };
}
