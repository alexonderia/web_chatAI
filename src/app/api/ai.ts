import { apiClient } from './client';

export interface AiModel {
  name: string;
  displayName?: string; 
}

export const aiApi = {
  async getModels(): Promise<AiModel[]> {
    const data = await apiClient.get<(AiModel | string)[]>('/Ai/models');

    // Приводим всё к формату { name, displayName? }
    return data.map((item) =>
      typeof item === 'string'
        ? { name: item, displayName: item }
        : item,
    );
  },

  getOllamaVersion() {
    return apiClient.get<string>('/Ai/ollama-version');
  },
};