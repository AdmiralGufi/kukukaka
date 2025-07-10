// 🧠 PROMPT: Твоя задача — проверить и исправить все ошибки в этом компоненте.
// Используй API OpenAI (для чата), DALL·E (для изображений), Runway (для видео).
// Проверь все fetch-запросы, убедись, что пути существуют и авторизация работает.
// Замени все ручные проверки на try-catch с консольной отладкой и понятным текстом ошибок.
// Добавь подробные сообщения для ошибок 400, 401, 403, 404 и 500.
// Используй async/await и проверь, правильно ли обрабатывается JSON.
// Если fetch указывает на /api/..., то проверь, есть ли такая папка и нужный handler.
// Проверь .env на наличие нужных ключей и подсвети, если переменной не хватает.
// Если не хватает API-роута или файла, предложи создать его автоматически.
// Примени лучший UX: обрабатывай ошибки без перезагрузки, не блокируй UI, покажи alert или toast.
// По завершении дай мне краткий список всех найденных и исправленных проблем.
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Wand2, Copy, RefreshCw, Loader2, CheckCircle } from 'lucide-react';

interface GeneratedContent {
  caption: string;
  hashtags: string[];
  cta: string;
  ideas: string[];
  feedback: string;
}


export default function ContentForm() {
  const [formData, setFormData] = useState({
    niche: '',
    targetAudience: '',
    tone: 'дружелюбный',
    platform: 'instagram',
    additionalInfo: '',
  });
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const platforms = [
    { value: 'instagram', label: 'Instagram' },
    { value: 'telegram', label: 'Telegram' },
    { value: 'vk', label: 'ВКонтакте' },
    { value: 'tiktok', label: 'TikTok' },
    { value: 'youtube', label: 'YouTube' },
  ];

  const tones = [
    { value: 'дружелюбный', label: 'Дружелюбный' },
    { value: 'профессиональный', label: 'Профессиональный' },
    { value: 'энергичный', label: 'Энергичный' },
    { value: 'серьёзный', label: 'Серьёзный' },
    { value: 'юмористический', label: 'Юмористический' },
  ];

  const generateContent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.niche || !formData.targetAudience) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/generate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Ошибка генерации');

      const data = await response.json();
      setGeneratedContent(data);
    } catch (error) {
      console.error('Ошибка:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (error) {
      console.error('Ошибка копирования:', error);
    }
  };

  return (
    <div className="flex flex-col bg-zinc-900 text-white rounded-2xl shadow-xl p-6 space-y-4 max-w-2xl mx-auto transition-all duration-300">
      <div className="flex items-center gap-3 mb-4">
        <Wand2 className="w-7 h-7 text-indigo-400" />
        <h3 className="text-2xl font-bold font-sans">Генерация SMM-поста</h3>
      </div>
      <form onSubmit={generateContent} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ниша / Тематика *</label>
            <input
              type="text"
              value={formData.niche}
              onChange={(e) => setFormData({ ...formData, niche: e.target.value })}
              placeholder="Например: фитнес, кулинария, IT..."
              className="w-full bg-zinc-800 text-white border-none rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans transition-all duration-300"
              required
              autoComplete="off"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Целевая аудитория *</label>
            <input
              type="text"
              value={formData.targetAudience}
              onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
              placeholder="Например: женщины 25-35 лет..."
              className="w-full bg-zinc-800 text-white border-none rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans transition-all duration-300"
              required
              autoComplete="off"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Платформа</label>
            <select
              value={formData.platform}
              onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
              className="w-full bg-zinc-800 text-white border-none rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans transition-all duration-300"
            >
              {platforms.map((platform) => (
                <option key={platform.value} value={platform.value}>{platform.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Тон общения</label>
            <select
              value={formData.tone}
              onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
              className="w-full bg-zinc-800 text-white border-none rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans transition-all duration-300"
            >
              {tones.map((tone) => (
                <option key={tone.value} value={tone.value}>{tone.label}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Дополнительная информация</label>
          <textarea
            value={formData.additionalInfo}
            onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
            placeholder="Любые особенности, акции, ключевые слова..."
            rows={3}
            className="w-full bg-zinc-800 text-white border-none rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans transition-all duration-300"
            autoComplete="off"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !formData.niche || !formData.targetAudience}
          className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg px-4 py-2 transition-all duration-300 font-sans flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Генерируем...
            </>
          ) : (
            <>
              <Wand2 className="w-5 h-5" />
              Сгенерировать контент
            </>
          )}
        </button>
      </form>

      {/* Generated Content */}
      {generatedContent && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/90 dark:bg-neutral-900/90 rounded-2xl shadow-md border border-gray-100 dark:border-neutral-800 p-6 md:p-8 transition-colors"
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Сгенерированный контент</h3>
            <button
              onClick={() => generateContent({ preventDefault: () => {} } as React.FormEvent)}
              className="p-2 rounded-lg text-gray-500 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400 dark:focus:ring-purple-600"
              title="Перегенерировать"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-8">
            {/* Caption */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Текст поста</label>
                <button
                  onClick={() => copyToClipboard(generatedContent.caption, 'caption')}
                  className="p-1 rounded text-gray-500 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400 dark:focus:ring-purple-600"
                >
                  {copiedField === 'caption' ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
              <div className="p-4 bg-gray-50/80 dark:bg-neutral-800/80 rounded-xl border border-gray-100 dark:border-neutral-800">
                <p className="whitespace-pre-wrap text-gray-900 dark:text-gray-100 text-base">{generatedContent.caption}</p>
              </div>
            </div>

            {/* Hashtags */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Хештеги
                </label>
                <button
                  onClick={() => copyToClipboard(generatedContent.hashtags.join(' '), 'hashtags')}
                  className="p-1 text-gray-500 hover:text-purple-600 transition-colors"
                >
                  {copiedField === 'hashtags' ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {generatedContent.hashtags.map((hashtag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full text-sm"
                  >
                    {hashtag}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Призыв к действию
                </label>
                <button
                  onClick={() => copyToClipboard(generatedContent.cta, 'cta')}
                  className="p-1 text-gray-500 hover:text-purple-600 transition-colors"
                >
                  {copiedField === 'cta' ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-blue-800 dark:text-blue-300 font-medium">
                  {generatedContent.cta}
                </p>
              </div>
            </div>

            {/* Ideas */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Дополнительные идеи
              </label>
              <ul className="space-y-2">
                {generatedContent.ideas.map((idea, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <span className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                      {index + 1}
                    </span>
                    <p className="text-gray-900 dark:text-white">{idea}</p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Feedback */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Обратная связь от AI
              </label>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <p className="text-green-800 dark:text-green-300">
                  {generatedContent.feedback}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
