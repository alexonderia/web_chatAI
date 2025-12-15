import { apiClient } from './client';

// то, что хранится в БД + пара опциональных полей под UI
export interface UserSettingsDto {
  id?: number;
  themeMode?: 'light' | 'dark';
  model: string | null;
  temperature: number;
  maxTokens: number;
  stream?: boolean;

  // опционально, для UI (url сервиса и модель по умолчанию)
  serviceUrl?: string;
  defaultModel?: string | null;
}

export type SaveUserSettingsRequest = UserSettingsDto & { userId: number };

export const settingsApi = {
  getUserSettings(userId: number) {
    return apiClient.get<UserSettingsDto>(`/Settings/${userId}`);
  },

  // используется в SettingsProvider.save и кнопке «Проверить»
  // в swagger это POST /api/Settings/save
  saveUserSettings(dto: SaveUserSettingsRequest) {
    return apiClient.post<void>('/Settings/save', dto);
  },
};
