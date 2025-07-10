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
import { Image as ImageIcon, Download, Loader2, RefreshCw } from 'lucide-react';
import Image from 'next/image';

export default function DallePrompt() {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('natural');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const styles = [
    { value: 'natural', label: 'Естественный' },
    { value: 'vivid', label: 'Яркий' },
    { value: 'minimalist', label: 'Минималистичный' },
    { value: 'professional', label: 'Профессиональный' },
    { value: 'artistic', label: 'Художественный' },
  ];

  const generateImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, style }),
      });
      if (!response.ok) {
        console.error('Ошибка сети:', response.status, response.statusText);
        throw new Error('Ошибка генерации изображения. Проверьте ключ DALL·E или промт.');
      }
      const data = await response.json();
      setGeneratedImage(data.imageUrl);
    } catch (error) {
      console.error('Ошибка выполнения запроса:', error);
      alert('Ошибка генерации изображения. Проверьте ключ DALL·E или промт.');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadImage = async () => {
    if (!generatedImage) return;

    try {
      const response = await fetch(generatedImage);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `generated-image-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Ошибка скачивания:', error);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <ImageIcon className="w-7 h-7 text-pink-500" />
        <h3 className="text-2xl font-bold">Генерация фото (DALL·E 3)</h3>
      </div>
      <form onSubmit={generateImage} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Описание изображения</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Опишите изображение, которое хотите создать..."
            rows={3}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:outline-none focus:ring-pink-500"
            required
            autoComplete="off"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Стиль</label>
          <select
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:outline-none focus:ring-pink-500"
          >
            {styles.map((styleOption) => (
              <option key={styleOption.value} value={styleOption.value}>{styleOption.label}</option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          disabled={isLoading || !prompt.trim()}
          className="bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Генерируем изображение...
            </>
          ) : (
            <>
              <ImageIcon className="w-5 h-5" />
              Создать изображение
            </>
          )}
        </button>
      </form>

      {/* Generated Image */}
      {generatedImage && (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xl font-semibold text-gray-900 dark:text-white">Сгенерированное изображение</h4>
            <div className="flex gap-2">
              <button
                onClick={downloadImage}
                className="p-2 rounded-lg text-gray-500 hover:text-pink-600 hover:bg-pink-50 dark:hover:bg-pink-900/30 transition-colors focus:outline-none focus:ring-2 focus:ring-pink-400 dark:focus:ring-pink-600"
                title="Скачать изображение"
              >
                <Download className="w-5 h-5" />
              </button>
              <button
                onClick={() => generateImage({ preventDefault: () => {} } as React.FormEvent)}
                className="p-2 rounded-lg text-gray-500 hover:text-pink-600 hover:bg-pink-50 dark:hover:bg-pink-900/30 transition-colors focus:outline-none focus:ring-2 focus:ring-pink-400 dark:focus:ring-pink-600"
                title="Сгенерировать заново"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-xl border border-gray-100 dark:border-neutral-800 shadow-md">
            <Image
              src={generatedImage}
              alt="Сгенерированное изображение"
              width={1024}
              height={1024}
              className="w-full h-auto object-cover"
            />
          </div>
          <div className="p-4 bg-gray-50/80 dark:bg-neutral-800/80 rounded-xl border border-gray-100 dark:border-neutral-800">
            <p className="text-sm text-gray-600 dark:text-gray-400"><strong>Промт:</strong> {prompt}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1"><strong>Стиль:</strong> {styles.find(s => s.value === style)?.label}</p>
          </div>
        </motion.div>
      )}

      {/* Loading State */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400"
        >
          <Loader2 className="w-12 h-12 animate-spin mb-4" />
          <p className="text-lg font-medium">Создаём изображение...</p>
          <p className="text-sm">Это может занять несколько секунд</p>
        </motion.div>
      )}
    </div>
  );
}
