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

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export default function ChatBox() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Привет! Я — ваш AI SMM-ассистент. Помогу создать эффективную контент-стратегию, сгенерировать идеи для постов и проанализировать аудиторию. Что вас интересует?',
      role: 'assistant',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input, context: messages.slice(-5).map(m => m.content) }),
      });
      if (!response.ok) {
        let msg = '';
        switch (response.status) {
          case 400: msg = 'Некорректный запрос. Проверьте ввод.'; break;
          case 401: msg = 'Ошибка авторизации. Проверьте ключ OpenAI.'; break;
          case 403: msg = 'Доступ запрещён. Проверьте права доступа.'; break;
          case 404: msg = 'API-роут не найден. Проверьте файл route.ts и перезапустите dev-сервер.'; break;
          case 500: msg = 'Внутренняя ошибка сервера. Попробуйте позже.'; break;
          default:  msg = `Неизвестная ошибка: ${response.status} ${response.statusText}`;
        }
        toast.error(msg);
        console.error('Ошибка сети:', response.status, response.statusText);
        throw new Error(msg);
      }
      const data = await response.json();
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.message,
        role: 'assistant',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Ошибка выполнения запроса:', error);
      toast.error(error instanceof Error ? error.message : 'Извините, произошла ошибка. Попробуйте еще раз.');
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: error instanceof Error ? error.message : 'Извините, произошла ошибка. Попробуйте еще раз.',
        role: 'assistant',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass flex flex-col h-[600px] space-y-4 max-w-2xl mx-auto transition-all duration-300">
      <div className="flex items-center gap-3 mb-4">
        <Bot className="w-7 h-7 text-cyan-400 drop-shadow-[0_0_6px_#00faff]" />
        <h3 className="futuristic-title text-2xl">Чат с AI</h3>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-2 md:p-4 space-y-4 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-900">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex gap-3 ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.role === 'assistant' && (
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}
              
              <div
                className={`max-w-[80%] px-5 py-3 rounded-2xl shadow-sm transition-all duration-300 font-sans ${
                  message.role === 'user'
                    ? 'bg-indigo-600 text-white ml-auto'
                    : 'bg-zinc-800 text-white'
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
                <p className={`text-xs mt-1 ${
                  message.role === 'user' 
                    ? 'text-indigo-100' 
                    : 'text-zinc-400'
                }`}>
                  {message.timestamp.toLocaleTimeString('ru-RU', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>

              {message.role === 'user' && (
                <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-2xl">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
                <span className="text-gray-500 dark:text-gray-400">Печатает...</span>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} className="pt-2">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Напишите ваш вопрос..."
            className="futuristic-input w-full flex-1"
            disabled={isLoading}
            autoComplete="off"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="neon-btn flex items-center justify-center"
            aria-label="Отправить"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
