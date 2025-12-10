import { apiClient } from './client';

export interface ChatSummary {
  id: string;
  title: string;
}

export interface CreateChatPayload {
  title?: string;
}

export const chatApi = {
  getUserChats(userId: number) {
    return apiClient.get<ChatSummary[]>(`/Chat/user/${userId}/chats`);
  },

  createChat(payload: CreateChatPayload = {}) {
    return apiClient.post<ChatSummary>('/Chat', payload);
  },
};