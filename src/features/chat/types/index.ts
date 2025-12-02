export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: string;
}

export interface ChatRequestBody {
  model: string;
  temperature: number;
  topP: number;
  stream: boolean;
  systemPrompt?: string;
  messages: Array<Pick<ChatMessage, 'role' | 'content'>>;
  sessionId?: string;
}

export interface ChatResponse {
  sessionId: string;
  reply: ChatMessage;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface ModelInfo {
  id: string;
  description?: string;
  family?: string;
}

export interface HealthResponse {
  status: 'ok' | 'degraded' | 'down';
  version?: string;
}