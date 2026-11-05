import { describe, it, expect } from 'vitest';
import { getOrCreateDailyChallenge } from '@/features/daily-challenge/generator';

describe('Daily Grammar Challenge Generator', () => {
  it('is idempotent: calling twice for the same date returns the existing instance without error', async () => {
    const firstCall = await getOrCreateDailyChallenge();
    expect(firstCall.instanceId).toBeDefined();
    expect(firstCall.quizId).toBeDefined();

    const secondCall = await getOrCreateDailyChallenge();
    expect(secondCall.instanceId).toBe(firstCall.instanceId);
    expect(secondCall.quizId).toBe(firstCall.quizId);
    expect(secondCall.isExisting).toBe(true);
  });
});
