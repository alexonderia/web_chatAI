import { apiClient } from './client';

export interface AuthPayload {
  login: string;
  password: string;
}

export interface AuthResponse {
  id: number;
  login: string;
  createdAt: string;
  modelChanged: boolean;
  model: string | null;
}
export const authApi = {
  login(payload: AuthPayload) {
    return apiClient.post<AuthResponse>('/WebAPIChatAI/Login', payload);
  },
  register(payload: AuthPayload) {
    return apiClient.post<AuthResponse>('/WebAPIChatAI/AddUser', payload);
  },
};