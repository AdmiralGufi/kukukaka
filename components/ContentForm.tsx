'use client';

import { useState } from 'react';

export default function ContentForm() {
  const [form, setForm] = useState({
    niche: '',
    audience: '',
    platform: 'Instagram',
    tone: 'Дружелюбный',
    additionalInfo: '',
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = () => console.log(form);

  return (
    <section className="glass space-y-5">
      <h2 className="futuristic-title">Генерация SMM-поста</h2>

      <input
        type="text"
        name="niche"
        placeholder="Ниша / Тематика"
        value={form.niche}
        onChange={handleChange}
        className="futuristic-input"
      />

      <input
        type="text"
        name="audience"
        placeholder="Целевая аудитория"
        value={form.audience}
        onChange={handleChange}
        className="futuristic-input"
      />

      <select
        name="platform"
        value={form.platform}
        onChange={handleChange}
        className="futuristic-input"
      >
        <option>Instagram</option>
        <option>TikTok</option>
        <option>Telegram</option>
      </select>

      <select
        name="tone"
        value={form.tone}
        onChange={handleChange}
        className="futuristic-input"
      >
        <option>Дружелюбный</option>
        <option>Экспертный</option>
        <option>Провокационный</option>
      </select>

      <textarea
        name="additionalInfo"
        placeholder="Дополнительная информация"
        value={form.additionalInfo}
        onChange={handleChange}
        className="futuristic-input h-24 resize-none"
      />

      <button onClick={handleSubmit} className="neon-btn">
        ⚡ Сгенерировать контент
      </button>
    </section>
  );
}
