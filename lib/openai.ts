import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface SMMContentRequest {
  niche: string;
  targetAudience: string;
  tone: string;
  platform: string;
  additionalInfo?: string;
}

export interface SMMContentResponse {
  caption: string;
  hashtags: string[];
  cta: string;
  ideas: string[];
  feedback: string;
}

export async function generateSMMContent(request: SMMContentRequest): Promise<SMMContentResponse> {
  try {
    const prompt = `
Ты — опытный SMM-стратег с 10+ летним опытом. Создай контент для ${request.platform}.

Ниша: ${request.niche}
Целевая аудитория: ${request.targetAudience}
Тон общения: ${request.tone}
Дополнительная информация: ${request.additionalInfo || 'не указана'}

Ответь в формате JSON:
{
  "caption": "готовый текст поста",
  "hashtags": ["хештег1", "хештег2", "хештег3"],
  "cta": "призыв к действию",
  "ideas": ["идея 1", "идея 2", "идея 3"],
  "feedback": "почему этот контент сработает"
}
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "Ты — профессиональный SMM-стратег. Отвечай только валидным JSON без дополнительного текста."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 1500,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) throw new Error('Пустой ответ от OpenAI');

    // Надёжная очистка markdown/JSON блока
    let clean = response.trim();
    // Удалить markdown-блоки (```json ... ``` или ``` ... ```)
    clean = clean.replace(/^```json[\r\n]?/i, '').replace(/^```[\r\n]?/i, '').replace(/```$/g, '').trim();
    // Удалить префикс json:
    clean = clean.replace(/^json:/i, '').replace(/^json/i, '').trim();

    // Попытка парсинга
    try {
      const parsed = JSON.parse(clean);
      // Можно добавить валидацию через zod здесь
      return parsed;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      console.error('Failed to parse OpenAI JSON. Raw output:', response, '\nCleaned:', clean);
      throw new Error('Failed to parse OpenAI JSON. Raw output: ' + response);
    }
  } catch (error) {
    console.error('Ошибка генерации SMM контента:', error);
    throw new Error('Не удалось сгенерировать контент');

}
}

export async function generateImageDalle(prompt: string, style: string = 'natural'): Promise<string> {
  try {
    const enhancedPrompt = `${prompt}. Стиль: ${style}, высокое качество, профессиональное освещение, современный дизайн`;

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: enhancedPrompt,
      n: 1,
      size: "1024x1024",
      quality: "hd",
      style: "natural"
    });

    // Логируем весь ответ для диагностики
    console.log('DALL·E raw response:', JSON.stringify(response));

    if (!response || !Array.isArray(response.data) || !response.data[0] || !response.data[0].url) {
      console.error('DALL·E did not return an image URL. Raw response:', response);
      throw new Error('DALL·E did not return an image URL');
    }

    return response.data[0].url;
  } catch (error) {
    console.error('Ошибка генерации изображения:', error);
    throw new Error('Не удалось сгенерировать изображение');
  }
}
export async function chatWithAI(message: string, context?: string[]): Promise<string> {
  try {
    const systemPrompt = `
Ты — AI SMM-ассистент и опытный маркетолог. Помогаешь пользователям с:
- Созданием контент-стратегий
- Генерацией идей для постов
- Анализом аудитории
- Планированием контента
- SMM-консультациями

Отвечай профессионально, но дружелюбно. Давай конкретные советы и примеры.
`;

    const messages = [
      { role: "system" as const, content: systemPrompt },
      ...(context?.map(msg => ({ role: "assistant" as const, content: msg })) || []),
      { role: "user" as const, content: message }
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages,
      temperature: 0.7,
      max_tokens: 1000,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) throw new Error('Пустой ответ от OpenAI');

    return response;
  } catch (error) {
    console.error('Ошибка чата с AI:', error);
    throw new Error('Не удалось получить ответ от AI');
  }
}
