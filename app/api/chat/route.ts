import { NextRequest, NextResponse } from 'next/server';
import { chatWithAI } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    const { message, context } = await request.json();
    if (!message) {
      return NextResponse.json({ error: 'Сообщение обязательно' }, { status: 400 });
    }
    const response = await chatWithAI(message, context);
    return NextResponse.json({ message: response });
  } catch (error) {
    console.error('Ошибка чата:', error);
    return NextResponse.json({ error: 'Не удалось получить ответ от AI' }, { status: 500 });
  }
}
