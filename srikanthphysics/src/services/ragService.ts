const RAG_API_URL = import.meta.env.VITE_RAG_API_URL || 'http://localhost:8000';

export interface RAGQuestion {
  question: string;
  llm_provider?: 'anthropic' | 'openai';
  num_sources?: number;
}

export interface RAGAnswer {
  answer: string;
  sources: Array<{
    content: string;
    metadata: Record<string, any>;
    page: string;
    source: string;
  }>;
  total_chunks_searched: number;
}

export interface PracticeRequest {
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  num_problems?: number;
  llm_provider?: 'anthropic' | 'openai';
}

class RAGService {
  async askQuestion(request: RAGQuestion): Promise<RAGAnswer> {
    const response = await fetch(`${RAG_API_URL}/ask`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to get answer from RAG service: ${errorText}`);
    }

    return response.json();
  }

  async generatePractice(request: PracticeRequest) {
    const response = await fetch(`${RAG_API_URL}/generate-practice`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to generate practice problems: ${errorText}`);
    }

    return response.json();
  }

  async getStats() {
    const response = await fetch(`${RAG_API_URL}/stats`);
    if (!response.ok) {
      throw new Error('Failed to get stats from RAG service');
    }
    return response.json();
  }

  async addContent(content: string, metadata: Record<string, any>) {
    const response = await fetch(`${RAG_API_URL}/add-content`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content, metadata }),
    });

    if (!response.ok) {
      throw new Error('Failed to add content to RAG service');
    }

    return response.json();
  }
}

export const ragService = new RAGService();
