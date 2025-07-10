"use client";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Автоматически ставим тему по системной
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDark(document.documentElement.classList.contains("dark") || systemDark);
    if (systemDark) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      return next;
    });
  };

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-4 right-4 z-50 bg-zinc-200 dark:bg-zinc-800 rounded-full p-2 shadow-md hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors"
      aria-label="Переключить тему"
      title={isDark ? "Светлая тема" : "Тёмная тема"}
    >
      {isDark ? (
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M17.75 15.5a7.25 7.25 0 0 1-7.25-7.25c0-1.61.52-3.1 1.41-4.3A.75.75 0 0 0 10.5 2a10 10 0 1 0 11.5 11.5a.75.75 0 0 0-1.95-1.41a7.22 7.22 0 0 1-2.3.41Z"/></svg>
      ) : (
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M12 18a6 6 0 1 0 0-12a6 6 0 0 0 0 12Zm0 4a1 1 0 0 1-1-1v-1a1 1 0 1 1 2 0v1a1 1 0 0 1-1 1Zm-7-5a1 1 0 0 1 1-1h1a1 1 0 1 1 0 2H6a1 1 0 0 1-1-1Zm13 0a1 1 0 0 1 1-1h1a1 1 0 1 1 0 2h-1a1 1 0 0 1-1-1ZM4.22 5.64a1 1 0 0 1 1.42 0l.7.7a1 1 0 1 1-1.42 1.42l-.7-.7a1 1 0 0 1 0-1.42Zm12.02 12.02a1 1 0 0 1 1.42 0l.7.7a1 1 0 1 1-1.42 1.42l-.7-.7a1 1 0 0 1 0-1.42ZM2 12a1 1 0 0 1 1-1h1a1 1 0 1 1 0 2H3a1 1 0 0 1-1-1Zm16-7a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0V6a1 1 0 0 1 1-1Zm-9.78 14.36a1 1 0 0 1 0-1.42l.7-.7a1 1 0 1 1 1.42 1.42l-.7.7a1 1 0 0 1-1.42 0Zm12.02-12.02a1 1 0 0 1 0-1.42l.7-.7a1 1 0 1 1 1.42 1.42l-.7.7a1 1 0 0 1-1.42 0Z"/></svg>
      )}
    </button>
  );
}
