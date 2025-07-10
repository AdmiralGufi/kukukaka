import { NextRequest, NextResponse } from 'next/server';
import { checkRunwayVideoStatus } from '@/lib/runway';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const taskId = params.id;
    if (!taskId) {
      return NextResponse.json({ error: 'ID задачи обязателен' }, { status: 400 });
    }
    const status = await checkRunwayVideoStatus(taskId);
    return NextResponse.json(status);
  } catch (error) {
    console.error('Ошибка проверки статуса видео:', error);
    return NextResponse.json({ error: 'Не удалось проверить статус видео' }, { status: 500 });
  }
}
