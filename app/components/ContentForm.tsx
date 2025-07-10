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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    alert('Контент сгенерирован:\n' + JSON.stringify(form, null, 2));
  };

  return (
    <section className="glass-panel space-y-4">
      <h2 className="title-fx">Генерация SMM-поста</h2>

      <input
        className="hiInput"
        placeholder="Ниша / Тематика"
        name="niche"
        value={form.niche}
        onChange={handleChange}
      />

      <input
        className="hiInput"
        placeholder="Целевая аудитория"
        name="audience"
        value={form.audience}
        onChange={handleChange}
      />

      <select
        className="hiInput"
        name="platform"
        value={form.platform}
        onChange={handleChange}
      >
        <option value="Instagram">Instagram</option>
        <option value="TikTok">TikTok</option>
        <option value="Telegram">Telegram</option>
      </select>

      <select
        className="hiInput"
        name="tone"
        value={form.tone}
        onChange={handleChange}
      >
        <option>Дружелюбный</option>
        <option>Экспертный</option>
        <option>Провокационный</option>
      </select>

      <textarea
        className="hiInput h-24 resize-none"
        name="additionalInfo"
        placeholder="Дополнительная информация..."
        value={form.additionalInfo}
        onChange={handleChange}
      />

      <button onClick={handleSubmit} className="btn-glow">
        ⚡ Сгенерировать контент
      </button>
    </section>
  );
}
