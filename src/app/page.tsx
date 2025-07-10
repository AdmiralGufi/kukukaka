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
import { 
  MessageSquare, 
  Wand2, 
  Image as ImageIcon, 
  Video, 
  Calendar,
  BarChart3,
  Moon,
  Sun,
  Menu,
  X
} from 'lucide-react';
import ChatBox from '@/components/ChatBox';
import ContentForm from '@/components/ContentForm';
import DallePrompt from '@/components/DallePrompt';
import RunwayPrompt from '@/components/RunwayPrompt';

export default function Home() {
  const [activeTab, setActiveTab] = useState('chat');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const tabs = [
    { id: 'chat', label: 'Чат с AI', icon: MessageSquare },
    { id: 'content', label: 'Генератор постов', icon: Wand2 },
    { id: 'images', label: 'DALL·E Фото', icon: ImageIcon },
    { id: 'videos', label: 'Runway Видео', icon: Video },
    { id: 'plan', label: 'Контент-план', icon: Calendar },
    { id: 'analytics', label: 'Аналитика', icon: BarChart3 },
  ];

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors ${isDarkMode ? 'dark' : ''}`}>
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Wand2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  AI SMM Assistant
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Ваш персональный маркетолог
                </p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                      activeTab === tab.id
                        ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden lg:inline">{tab.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleDarkMode}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-200 dark:border-gray-700 py-4"
            >
              <nav className="grid grid-cols-2 gap-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`p-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                        activeTab === tab.id
                          ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </motion.div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'chat' && (
            <div className="max-w-4xl mx-auto">
              <div className="mb-6 text-center">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Чат с AI SMM-ассистентом
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Задавайте вопросы о маркетинге, получайте советы и идеи для контента
                </p>
              </div>
              <ChatBox />
            </div>
          )}

          {activeTab === 'content' && (
            <div className="max-w-6xl mx-auto">
              <div className="mb-6 text-center">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Генератор SMM контента
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Создавайте готовые посты с текстом, хештегами и призывом к действию
                </p>
              </div>
              <ContentForm />
            </div>
          )}

          {activeTab === 'images' && (
            <div className="max-w-4xl mx-auto">
              <div className="mb-6 text-center">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Генератор изображений DALL·E 3
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Создавайте уникальные изображения для ваших постов
                </p>
              </div>
              <DallePrompt />
            </div>
          )}

          {activeTab === 'videos' && (
            <div className="max-w-4xl mx-auto">
              <div className="mb-6 text-center">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Генератор видео Runway
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Создавайте короткие видео для соцсетей
                </p>
              </div>
              <RunwayPrompt />
            </div>
          )}

          {activeTab === 'plan' && (
            <div className="max-w-6xl mx-auto">
              <div className="mb-6 text-center">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Контент-планировщик
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Планируйте контент на неделю, месяц или квартал
                </p>
              </div>
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 text-center">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  Контент-планировщик будет доступен в следующей версии
                </p>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="max-w-6xl mx-auto">
              <div className="mb-6 text-center">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Аналитика и insights
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Анализируйте эффективность контента и аудиторию
                </p>
              </div>
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 text-center">
                <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  Аналитика будет доступна в следующей версии
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
