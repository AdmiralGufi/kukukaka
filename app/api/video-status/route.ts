import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Здесь должна быть ваша логика проверки статуса видео
    // Например: const status = await checkVideoStatus(...)
    return NextResponse.json({ status: 'processing' });
  } catch (error) {
    console.error('Ошибка проверки статуса видео:', error);
    return NextResponse.json({ error: 'Не удалось проверить статус видео' }, { status: 500 });
  }
}
