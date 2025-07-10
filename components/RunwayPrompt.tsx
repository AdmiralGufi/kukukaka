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
import { Video, Download, Loader2, RefreshCw, Clock } from 'lucide-react';

export default function RunwayPrompt() {
  const [prompt, setPrompt] = useState('');
  const [duration, setDuration] = useState(3);
  const [style, setStyle] = useState('cinematic');
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const styles = [
    { value: 'cinematic', label: 'Кинематографичный' },
    { value: 'dynamic', label: 'Динамичный' },
    { value: 'smooth', label: 'Плавный' },
    { value: 'artistic', label: 'Художественный' },
    { value: 'natural', label: 'Естественный' },
  ];

  const durations = [
    { value: 1, label: '1 секунда' },
    { value: 2, label: '2 секунды' },
    { value: 3, label: '3 секунды' },
    { value: 4, label: '4 секунды' },
    { value: 5, label: '5 секунд' },
  ];

  // Универсальная функция для обработки ошибок fetch
  function handleApiError(response: Response, context: string) {
    let message = '';
    switch (response.status) {
      case 400:
        message = 'Некорректные параметры запроса. Проверьте промт и настройки.';
        break;
      case 401:
        message = 'Ошибка авторизации. Проверьте ключ Runway в .env.';
        break;
      case 403:
        message = 'Доступ запрещён. Проверьте права доступа к Runway API.';
        break;
      case 404:
        message = 'API-роут не найден. Проверьте структуру /api.';
        break;
      case 500:
        message = 'Внутренняя ошибка сервера. Попробуйте позже.';
        break;
      default:
        message = `Неизвестная ошибка (${response.status}): ${response.statusText}`;
    }
    const fullMsg = `${context}\n${message}`;
    console.error(fullMsg);
    alert(fullMsg);
  }

  const generateVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setProgress(0);
    setGeneratedVideo(null);

    try {
      const response = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, duration, style }),
      });
      if (!response.ok) {
        handleApiError(response, 'Ошибка генерации видео.');
        setIsLoading(false);
        return;
      }
      const data = await response.json();
      if (!data.taskId) {
        alert('Ошибка: не получен taskId от сервера.');
        setIsLoading(false);
        return;
      }
      checkVideoStatus(data.taskId);
    } catch (error) {
      console.error('Ошибка выполнения запроса:', error);
      alert('Ошибка генерации видео. Проверьте ключ Runway и параметры.');
      setIsLoading(false);
    }
  };

  const checkVideoStatus = async (id: string) => {
    try {
      const response = await fetch(`/api/video-status/${id}`);
      if (!response.ok) {
        handleApiError(response, 'Ошибка проверки статуса видео.');
        setIsLoading(false);
        return;
      }
      const data = await response.json();

      if (data.status === 'completed' && data.videoUrl) {
        setGeneratedVideo(data.videoUrl);
        setIsLoading(false);
        setProgress(100);
      } else if (data.status === 'failed') {
        alert('Генерация видео не удалась. Попробуйте изменить промт или параметры.');
        setIsLoading(false);
      } else {
        // Увеличиваем прогресс и продолжаем проверку
        setProgress(prev => Math.min(prev + 10, 90));
        setTimeout(() => checkVideoStatus(id), 3000);
      }
    } catch (error) {
      console.error('Ошибка проверки статуса:', error);
      alert('Ошибка проверки статуса видео. Проверьте соединение или ключ Runway.');
      setIsLoading(false);
    }
  };

  const downloadVideo = async () => {
    if (!generatedVideo) return;

    try {
      const response = await fetch(generatedVideo);
      if (!response.ok) {
        handleApiError(response, 'Ошибка скачивания видео.');
        return;
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `generated-video-${Date.now()}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Ошибка скачивания:', error);
      alert('Ошибка скачивания видео. Проверьте ссылку или соединение.');
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <Video className="w-7 h-7 text-red-500" />
        <h3 className="text-2xl font-bold">Генерация видео (Runway)</h3>
      </div>
      <form onSubmit={generateVideo} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Описание видео</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Опишите видео, которое хотите создать..."
            rows={3}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:outline-none focus:ring-red-500"
            required
            autoComplete="off"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Длительность</label>
            <select
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:outline-none focus:ring-red-500"
            >
              {durations.map((durationOption) => (
                <option key={durationOption.value} value={durationOption.value}>{durationOption.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Стиль</label>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:outline-none focus:ring-red-500"
            >
              {styles.map((styleOption) => (
                <option key={styleOption.value} value={styleOption.value}>{styleOption.label}</option>
              ))}
            </select>
          </div>
        </div>
        <button
          type="submit"
          disabled={isLoading || !prompt.trim()}
          className="bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Генерируем видео... {progress}%
            </>
          ) : (
            <>
              <Video className="w-5 h-5" />
              Создать видео
            </>
          )}
        </button>
      </form>

      {/* Progress Bar */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6"
        >
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Генерация может занять до 2-3 минут
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-red-500 to-purple-600 h-2 rounded-full"
              style={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </motion.div>
      )}

      {/* Generated Video */}
      {generatedVideo && (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xl font-semibold text-gray-900 dark:text-white">Сгенерированное видео</h4>
            <div className="flex gap-2">
              <button
                onClick={downloadVideo}
                className="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors focus:outline-none focus:ring-2 focus:ring-red-400 dark:focus:ring-red-600"
                title="Скачать видео"
              >
                <Download className="w-5 h-5" />
              </button>
              <button
                onClick={() => generateVideo({ preventDefault: () => {} } as React.FormEvent)}
                className="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors focus:outline-none focus:ring-2 focus:ring-red-400 dark:focus:ring-red-600"
                title="Сгенерировать заново"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-xl border border-gray-100 dark:border-neutral-800 shadow-md">
            <video
              src={generatedVideo}
              controls
              className="w-full h-auto"
              style={{ maxHeight: '400px' }}
            >
              Ваш браузер не поддерживает видео.
            </video>
          </div>
          <div className="p-4 bg-gray-50/80 dark:bg-neutral-800/80 rounded-xl border border-gray-100 dark:border-neutral-800">
            <p className="text-sm text-gray-600 dark:text-gray-400"><strong>Промт:</strong> {prompt}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1"><strong>Длительность:</strong> {duration} сек</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1"><strong>Стиль:</strong> {styles.find(s => s.value === style)?.label}</p>
          </div>
        </motion.div>
      )}

      {/* Loading State */}
      {isLoading && !progress && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400"
        >
          <Loader2 className="w-12 h-12 animate-spin mb-4" />
          <p className="text-lg font-medium">Создаём видео...</p>
          <p className="text-sm">Это займёт 2-3 минуты</p>
        </motion.div>
      )}
    </div>
  );
}
