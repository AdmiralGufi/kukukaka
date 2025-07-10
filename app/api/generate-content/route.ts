import { NextRequest, NextResponse } from 'next/server';
import { generateSMMContent } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();
    if (!formData.niche || !formData.targetAudience) {
      return NextResponse.json({ error: 'Ниша и целевая аудитория обязательны' }, { status: 400 });
    }
    const content = await generateSMMContent(formData);
    return NextResponse.json(content);
  } catch (error) {
    console.error('Ошибка генерации контента:', error);
    return NextResponse.json({ error: 'Не удалось сгенерировать контент' }, { status: 500 });
  }
}
