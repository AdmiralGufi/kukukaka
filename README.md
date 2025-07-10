# 🧠 AI SMM Assistant — Full-Stack Web App

![AI SMM Assistant](https://img.shields.io/badge/Next.js-15.0.4-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-06B6D4?style=for-the-badge&logo=tailwindcss)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o-412991?style=for-the-badge&logo=openai)

## 🧩 Описание

AI SMM Assistant — это продвинутая веб-платформа для создания контента в социальных сетях с помощью искусственного интеллекта. Приложение предоставляет полный набор инструментов для SMM-специалистов и маркетологов.

### ✨ Основной функционал:

- **🤖 Чат с AI-ассистентом** — консультации по маркетингу на базе GPT-4o
- **📝 Генератор постов** — создание готового контента с текстом, хештегами и CTA
- **🎨 Генератор изображений** — создание уникальных изображений через DALL·E 3
- **🎬 Генератор видео** — создание коротких видео через Runway API
- **📊 Аналитика** — insights аудитории через PostgreSQL
- **🌙 Темная тема** — полная поддержка светлой и темной темы
- **📱 Адаптивный дизайн** — работает на всех устройствах

## 💻 Технологический стек

- **Frontend:** Next.js 15 + React 18 + TypeScript
- **Styling:** Tailwind CSS + Framer Motion
- **AI:** OpenAI GPT-4o + DALL·E 3 + Runway ML
- **Database:** PostgreSQL (Kamatera)
- **Icons:** Lucide React
- **Deployment:** Vercel Ready

## 🚀 Быстрый старт

### 1. Клонирование и установка

```bash
git clone <your-repo-url>
cd smm-assistant
npm install
```

### 2. Настройка переменных окружения

Создайте файл `.env.local` и добавьте ваши API ключи:

```env
# AI API Keys
OPENAI_API_KEY=sk-proj-your-openai-key-here
RUNWAY_API_KEY=key_your-runway-key-here

# PostgreSQL Database (Kamatera)
PQL_DB_HOST=xxx.xxx.xxx.xxx
PQL_DB_PORT=5432
PQL_DB_NAME=your_database
PQL_DB_USER=your_user
PQL_DB_PASS=your_pass

# Next.js
NEXTAUTH_SECRET=your-secret-key-here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Запуск в режиме разработки

```bash
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000) в браузере.

## 📁 Структура проекта

```
smm-assistant/
├── src/
│   ├── app/
│   │   ├── api/           # API Routes
│   │   │   ├── chat/
│   │   │   ├── generate-content/
│   │   │   ├── generate-image/
│   │   │   ├── generate-video/
│   │   │   └── video-status/
│   │   ├── globals.css    # Глобальные стили
│   │   ├── layout.tsx     # Основной макет
│   │   └── page.tsx       # Главная страница
│   ├── components/
│   │   ├── ChatBox.tsx    # Чат с AI
│   │   ├── ContentForm.tsx # Форма генерации постов
│   │   ├── DallePrompt.tsx # Генератор DALL-E
│   │   └── RunwayPrompt.tsx # Генератор Runway
│   └── lib/
│       ├── openai.ts      # OpenAI API интеграция
│       ├── runway.ts      # Runway API интеграция
│       └── pql.ts         # PostgreSQL интеграция
├── .env.local             # Переменные окружения
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

**Создано с ❤️ для SMM-специалистов и маркетологов**
