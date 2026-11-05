import { describe, it, expect } from 'vitest';
import { getTodayDhakaDateString, formatDhakaDateOnly } from '@/lib/timezone';

describe('Asia/Dhaka Timezone Formatting', () => {
  it('returns valid YYYY-MM-DD date string', () => {
    const todayStr = getTodayDhakaDateString();
    expect(todayStr).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('formats dates consistently', () => {
    const testDate = new Date('2026-03-15T10:00:00Z');
    const formatted = formatDhakaDateOnly(testDate);
    expect(formatted).toContain('2026');
    expect(formatted).toContain('Mar');
  });
});
