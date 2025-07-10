import ContentForm from './components/ContentForm';
import { LucideSparkles, LucideCheckCircle2 } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="space-y-10">
      <h1 className="text-center text-3xl font-bold text-cyan-300 mb-8">
        AI SMM Assistant
      </h1>
      <section className="glass-panel animate-fade-in-up">
        <h2 className="title-fx flex items-center gap-3 mb-4">
          <LucideSparkles className="text-cyan-400 drop-shadow" size={28} />{' '}
          Генерация SMM-контента
        </h2>
        <ContentForm />
      </section>
      <section className="glass-panel animate-fade-in-up">
        <h2 className="title-fx mb-2">Преимущества</h2>
        <ul className="space-y-2">
          <li className="flex items-center gap-2 text-lg">
            <LucideCheckCircle2 className="text-cyan-400" />{' '}
            Мгновенная генерация идей и текстов
          </li>
          <li className="flex items-center gap-2 text-lg">
            <LucideCheckCircle2 className="text-cyan-400" />{' '}
            Адаптация под разные соцсети
          </li>
          <li className="flex items-center gap-2 text-lg">
            <LucideCheckCircle2 className="text-cyan-400" />{' '}
            Экономия времени SMM-специалиста
          </li>
        </ul>
      </section>
      <section className="glass-panel animate-fade-in-up">
        <h2 className="title-fx mb-2">О сервисе</h2>
        <p className="text-gray-300 mb-2">
          AI SMM Assistant — это современный инструмент для генерации постов, идей
          и медиа-контента для Instagram, Telegram, TikTok и других платформ.
          Используйте искусственный интеллект для ускорения работы и повышения
          креатива!
        </p>
      </section>
      <footer className="text-center text-gray-500 text-sm mt-8">
        &copy; 2025 AI SMM Assistant. Все права защищены.
      </footer>
    </div>
  );
}
