import { NextRequest, NextResponse } from 'next/server';
import { generateRunwayVideo } from '@/lib/runway';

export async function POST(request: NextRequest) {
  try {
    const { prompt, duration, style } = await request.json();
    if (!prompt) {
      return NextResponse.json({ error: 'Промт обязателен' }, { status: 400 });
    }
    const result = await generateRunwayVideo({ prompt, duration: duration || 3, style: style || 'cinematic' });
    return NextResponse.json(result);
  } catch (error) {
    console.error('Ошибка генерации видео:', error);
    return NextResponse.json({ error: 'Не удалось сгенерировать видео' }, { status: 500 });
  }
}
