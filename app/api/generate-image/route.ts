import { NextRequest, NextResponse } from 'next/server';
import { generateImageDalle } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    const { prompt, style } = await request.json();
    if (!prompt) {
      return NextResponse.json({ error: 'Промт обязателен' }, { status: 400 });
    }
    const imageUrl = await generateImageDalle(prompt, style);
    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error('Ошибка генерации изображения:', error);
    return NextResponse.json({ error: 'Не удалось сгенерировать изображение' }, { status: 500 });
  }
}
