import { apiClient } from './client';

export interface ChatSummary {
  id: number;
  title: string;
  lastMessageAt?: string;
  model?: string | null;
}

export interface CreateChatPayload {
  title?: string;
  userId?: number;
}

export interface ChatSettingsDto {
  id: number;
  chatId: number;
  model: string | null;
  temperature: number;
  maxTokens: number;
}

export interface ChatMessageDto {
  id: number | string;
  text?: string;
  content?: string;
  role?: 'user' | 'assistant' | number | string;
  author?: string;
  userLogin?: string;
  createdAt?: string;
  isAi?: boolean;
  isAI?: boolean;
  messageType?: 'text' | 'image' | string;
  type?: string;
  imageUrl?: string;
  imageUrls?: string[];
  base64Image?: string;
  base64Images?: string[];
  imageBlob?: string;
  imageBlobs?: string[];
  images?: (string | { imageBlob?: string; base64Image?: string; imageUrl?: string; url?: string })[];
}

export const chatApi = {
  getUserChats(userId: number) {
    return apiClient.get<ChatSummary[]>(`/Chat/user/${userId}/chats`);
  },

  getChatSettings(chatId: number) {
    return apiClient.get<ChatSettingsDto>(`/Chat/getChatSettings/${chatId}`);
  },

  saveChatSettings(dto: ChatSettingsDto) {
    return apiClient.post('/Chat/chat/saveChatSettings', dto);
  },

  getMessages(chatId: number) {
    return apiClient.get<ChatMessageDto[]>(`/Chat/${chatId}/messages`);
  },

  sendMessage(payload: { chatId: number; userId: number; text: string; base64Images: string[] }) {
    return apiClient.post('/Chat/send', payload);
  },

  createChat(payload = {}) {
    return apiClient.post<ChatSummary>('/Chat', payload);
  },

  renameChat(chatId: number, title: string) {
    return apiClient.put(`/Chat/${chatId}/rename`, { title });
  },

  deleteChat(chatId: number) {
    return apiClient.delete(`/Chat/${chatId}`);
  },

  clearChat(chatId: number) {
    return apiClient.post(`/Chat/${chatId}/clear`);
  },
};

export async function deleteAllUserChats(userId: number) {
  const userChats = await chatApi.getUserChats(userId);
  await Promise.all(userChats.map((chat) => chatApi.deleteChat(chat.id)));
}