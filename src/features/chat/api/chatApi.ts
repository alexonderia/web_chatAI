import { apiRequest } from '../../../lib/apiClient';
import type { ChatRequestBody, ChatResponse, HealthResponse, ModelInfo } from '../types';

export async function fetchModels() {
  return apiRequest<ModelInfo[]>({ path: '/models' });
}

export async function fetchHealth() {
  return apiRequest<HealthResponse>({ path: '/health' });
}

export async function sendChatMessage(body: ChatRequestBody, signal?: AbortSignal) {
  return apiRequest<ChatResponse, ChatRequestBody>({
    path: '/chat/completions',
    method: 'POST',
    body,
    signal,
  });
}

export async function fetchSessionHistory(sessionId: string) {
  return apiRequest<{ messages: ChatResponse['reply'][] }>({ path: `/chat/history/${sessionId}` });
}