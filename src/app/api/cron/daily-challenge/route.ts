import { NextRequest, NextResponse } from 'next/server';
import { getOrCreateDailyChallenge } from '@/features/daily-challenge/generator';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await getOrCreateDailyChallenge();
    return NextResponse.json({
      success: true,
      message: result.isExisting
        ? 'Daily challenge already active'
        : 'Generated new daily challenge',
      result,
    });
  } catch (error: any) {
    console.error('Error generating daily challenge:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
