import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI SMM Assistant',
  description: 'AI-инструмент генерации контента для SMM',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="AI-инструмент генерации контента для SMM" />
        <link rel="icon" href="/favicon.ico" />
        <title>AI SMM Assistant</title>
      </head>
      <body>
        <main className="max-w-4xl mx-auto px-6 py-10 space-y-10">
          {children}
        </main>
      </body>
    </html>
  );
}
