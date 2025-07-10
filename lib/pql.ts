import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.PQL_DB_HOST,
  port: parseInt(process.env.PQL_DB_PORT || '5432'),
  database: process.env.PQL_DB_NAME,
  user: process.env.PQL_DB_USER,
  password: process.env.PQL_DB_PASS,
  ssl: {
    rejectUnauthorized: false, // Для Kamatera
  },
});

export interface AudienceInsight {
  id: string;
  platform: string;
  demographics: {
    age_range: string;
    gender: string;
    location: string;
  };
  interests: string[];
  engagement_rate: number;
  best_posting_times: string[];
  content_preferences: string[];
}

export interface ContentFeedback {
  id: string;
  content_type: string;
  platform: string;
  performance_score: number;
  engagement_metrics: {
    likes: number;
    comments: number;
    shares: number;
    views: number;
  };
  feedback_text: string;
  created_at: Date;
}

export async function getAudienceInsights(platform?: string): Promise<AudienceInsight[]> {
  try {
    const client = await pool.connect();
    
    const query = `
      SELECT * FROM audience_insights 
      ${platform ? 'WHERE platform = $1' : ''}
      ORDER BY created_at DESC 
      LIMIT 10
    `;
    
    const params = platform ? [platform] : [];
    const result = await client.query(query, params);
    
    client.release();
    return result.rows;
  } catch (error) {
    console.error('Ошибка получения аналитики аудитории:', error);
    throw new Error('Не удалось получить данные об аудитории');
  }
}

export async function logFeedback(feedback: Omit<ContentFeedback, 'id' | 'created_at'>): Promise<void> {
  try {
    const client = await pool.connect();
    
    await client.query(`
      INSERT INTO content_feedback (
        content_type, platform, performance_score, 
        engagement_metrics, feedback_text, created_at
      ) VALUES ($1, $2, $3, $4, $5, NOW())
    `, [
      feedback.content_type,
      feedback.platform,
      feedback.performance_score,
      JSON.stringify(feedback.engagement_metrics),
      feedback.feedback_text,
    ]);
    
    client.release();
  } catch (error) {
    console.error('Ошибка записи обратной связи:', error);
    throw new Error('Не удалось записать обратную связь');
  }
}

export async function saveContentPlan(plan: {
  title: string;
  platform: string;
  posts: Array<{
    date: Date;
    content: string;
    media_type: string;
    hashtags: string[];
  }>;
}): Promise<string> {
  try {
    const client = await pool.connect();
    
    const result = await client.query(`
      INSERT INTO content_plans (title, platform, posts_data, created_at)
      VALUES ($1, $2, $3, NOW())
      RETURNING id
    `, [
      plan.title,
      plan.platform,
      JSON.stringify(plan.posts),
    ]);
    
    client.release();
    return result.rows[0].id;
  } catch (error) {
    console.error('Ошибка сохранения контент-плана:', error);
    throw new Error('Не удалось сохранить контент-план');
  }
}

export interface ContentPlan {
  id: string;
  title: string;
  platform: string;
  posts_data: Array<{
    date: Date;
    content: string;
    media_type: string;
    hashtags: string[];
  }>;
  created_at: Date;
}

export async function getContentPlans(platform?: string): Promise<ContentPlan[]> {
  try {
    const client = await pool.connect();
    
    const query = `
      SELECT * FROM content_plans 
      ${platform ? 'WHERE platform = $1' : ''}
      ORDER BY created_at DESC 
      LIMIT 20
    `;
    
    const params = platform ? [platform] : [];
    const result = await client.query(query, params);
    
    client.release();
    return result.rows;
  } catch (error) {
    console.error('Ошибка получения контент-планов:', error);
    throw new Error('Не удалось получить контент-планы');
  }
}

// Функция для инициализации таблиц
export async function initializeDatabase(): Promise<void> {
  try {
    const client = await pool.connect();
    
    // Создание таблиц если они не существуют
    await client.query(`
      CREATE TABLE IF NOT EXISTS audience_insights (
        id SERIAL PRIMARY KEY,
        platform VARCHAR(50),
        demographics JSONB,
        interests TEXT[],
        engagement_rate DECIMAL(5,2),
        best_posting_times TEXT[],
        content_preferences TEXT[],
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS content_feedback (
        id SERIAL PRIMARY KEY,
        content_type VARCHAR(50),
        platform VARCHAR(50),
        performance_score DECIMAL(5,2),
        engagement_metrics JSONB,
        feedback_text TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS content_plans (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255),
        platform VARCHAR(50),
        posts_data JSONB,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    
    client.release();
    console.log('База данных инициализирована успешно');
  } catch (error) {
    console.error('Ошибка инициализации базы данных:', error);
    throw new Error('Не удалось инициализировать базу данных');
  }
}
