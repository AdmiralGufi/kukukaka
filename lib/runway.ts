export interface RunwayVideoRequest {
  prompt: string;
  duration: number; // секунды (до 5)
  style: string;
}

export interface RunwayVideoResponse {
  videoUrl: string;
  taskId: string;
  status: 'processing' | 'completed' | 'failed';
}

export async function generateRunwayVideo(request: RunwayVideoRequest): Promise<RunwayVideoResponse> {
  try {
    const response = await fetch('https://api.runwayml.com/v1/image_to_video', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RUNWAY_API_KEY}`,
      },
      body: JSON.stringify({
        prompt: `${request.prompt}. Стиль: ${request.style}, cinematic, высокое качество`,
        duration: Math.min(request.duration, 5), // Максимум 5 секунд
        motion_strength: 0.8,
      }),
    });

    if (!response.ok) {
      throw new Error(`Runway API ошибка: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      videoUrl: data.output || '',
      taskId: data.id || '',
      status: data.status || 'processing',
    };
  } catch (error) {
    console.error('Ошибка генерации видео Runway:', error);
    throw new Error('Не удалось сгенерировать видео');
  }
}

export async function checkRunwayVideoStatus(taskId: string): Promise<RunwayVideoResponse> {
  try {
    const response = await fetch(`https://api.runwayml.com/v1/tasks/${taskId}`, {
      headers: {
        'Authorization': `Bearer ${process.env.RUNWAY_API_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Runway API ошибка: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      videoUrl: data.output || '',
      taskId: data.id || '',
      status: data.status || 'processing',
    };
  } catch (error) {
    console.error('Ошибка проверки статуса видео:', error);
    throw new Error('Не удалось проверить статус видео');
  }
}

// Вспомогательная функция для ожидания готовности видео
export async function waitForRunwayVideo(taskId: string, maxWaitTime: number = 60000): Promise<string> {
  const startTime = Date.now();
  
  while (Date.now() - startTime < maxWaitTime) {
    const status = await checkRunwayVideoStatus(taskId);
    
    if (status.status === 'completed' && status.videoUrl) {
      return status.videoUrl;
    }
    
    if (status.status === 'failed') {
      throw new Error('Генерация видео не удалась');
    }
    
    // Ждем 3 секунды перед следующей проверкой
    await new Promise(resolve => setTimeout(resolve, 3000));
  }
  
  throw new Error('Превышено время ожидания генерации видео');
}
