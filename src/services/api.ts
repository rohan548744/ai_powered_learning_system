const API_BASE_URL = 'http://localhost:3001/api';

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

class ApiService {
  private async makeRequest<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      return { 
        error: error instanceof Error ? error.message : 'An unexpected error occurred' 
      };
    }
  }

  async askQuestion(question: string) {
    return this.makeRequest<{ answer: string; timestamp: string }>('/ask', {
      method: 'POST',
      body: JSON.stringify({ question }),
    });
  }

  async summarizeText(text: string) {
    return this.makeRequest<{ 
      summary: string; 
      originalLength: number; 
      timestamp: string 
    }>('/summarize', {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  }

  async generateQuiz(text: string) {
    return this.makeRequest<{
      questions: Array<{
        id: string;
        question: string;
        options: string[];
        correctAnswer: number;
        explanation: string;
      }>;
      totalQuestions: number;
      timestamp: string;
    }>('/quiz', {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  }

  async generateRoadmap(topic: string, level: string = 'beginner') {
    return this.makeRequest<{
      topic: string;
      level: string;
      totalDuration: string;
      description: string;
      steps: Array<{
        id: string;
        title: string;
        description: string;
        duration: string;
        difficulty: string;
        topics: string[];
        resources: string[];
        skills: string[];
      }>;
      timestamp: string;
    }>('/roadmap', {
      method: 'POST',
      body: JSON.stringify({ topic, level }),
    });
  }
}

export const apiService = new ApiService();