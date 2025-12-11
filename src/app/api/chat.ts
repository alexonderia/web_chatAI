import { apiClient } from './client';

export interface ChatSummary {
  id: string;
  title: string;
}

export interface CreateChatPayload {
  title?: string;
}

export const chatApi = {
  getChatSettings(chatId: number) {
    return apiClient.get(`/Chat/getChatSettings/${chatId}`);
  },

  saveChatSettings(dto: any) {
    return apiClient.post('/Chat/chat/saveChatSettings', dto);
  },

  getMessages(chatId: number) {
    return apiClient.get(`/Chat/${chatId}/messages`);
  },

  sendMessage(payload: { chatId: number; userId: number; text: string; base64Images?: string[] }) {
    return apiClient.post('/Chat/send', payload);
  },

  createChat(payload = {}) {
    return apiClient.post('/Chat', payload);
  }
};