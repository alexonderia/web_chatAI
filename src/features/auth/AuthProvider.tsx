// src/features/auth/AuthProvider.tsx
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { authApi, AuthPayload } from '@/app/api/auth';
import { chatApi, ChatSummary } from '@/app/api/chat';
import { aiApi } from '@/app/api/ai';
import { settingsApi } from '@/app/api/settings';

interface User {
  id: number;
  login: string;
  model: string | null;
  modelChanged: boolean;
}

interface AuthContextValue {
  user: User | null;
  chats: ChatSummary[];
  initializing: boolean;

  login: (payload: AuthPayload) => Promise<void>;
  register: (payload: AuthPayload) => Promise<void>;
  refreshChats: () => Promise<ChatSummary[]>;
  createChat: (title?: string) => Promise<ChatSummary | null>;

  logout: () => Promise<void>;
  updateLogin: (newLogin: string) => Promise<void>;
  deleteAccount: () => Promise<void>;
}

const USER_STORAGE_KEY = 'chatai_user';

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

function persistUser(user: User | null) {
  if (user) {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(USER_STORAGE_KEY);
  }
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [chats, setChats] = useState<ChatSummary[]>([]);
  const [initializing, setInitializing] = useState(true);

  const refreshChats = useCallback(
    async (userId?: number): Promise<ChatSummary[]> => {
      const id = userId ?? user?.id;
      if (!id) return [];

      const chats = await chatApi.getUserChats(id);
      setChats(chats);
      return chats;
    },
    [user?.id],
  );


  useEffect(() => {
    if (!user && !initializing) {
      setChats([]);     
    }
  }, [user, initializing]);

  useEffect(() => {
    const loadSession = async () => {
      const stored = localStorage.getItem(USER_STORAGE_KEY);
      if (!stored) {
        setInitializing(false);
        return;
      }

      const storedUser: User = JSON.parse(stored);
      setUser(storedUser);

      if (!storedUser?.id) {          // ← 🔥 ВОТ ЭТО
        setInitializing(false);
        return;
      }

      try {
        await refreshChats(storedUser.id);
      } catch (e) {
        console.error('Не удалось получить список чатов при восстановлении сессии', e);
        setUser(null);
        setChats([]);
        localStorage.removeItem(USER_STORAGE_KEY);
      } finally {
        setInitializing(false);
      }
    };

    void loadSession();
  }, [refreshChats]);

  const login = useCallback(
    async (payload: AuthPayload) => {
      const res = await authApi.login(payload);

      const nextUser: User = {
        id: res.id,
        login: res.login,
        model: res.model,
        modelChanged: res.modelChanged,
      };

      setUser(nextUser);
      persistUser(nextUser);

      await refreshChats(nextUser.id);
    },
    [refreshChats],
  );

  const register = useCallback(
    async (payload: AuthPayload) => {
      const res = await authApi.register(payload);

      let defaultModel: string | null = null;
      try {
        const models = await aiApi.getModels();
        defaultModel = models[0]?.name ?? null;
        if (defaultModel) {
          await settingsApi.saveUserSettings({
            id: 0,
            stream: true,
            userId: res.id,
            model: defaultModel,
            temperature: 1,
            maxTokens: 1024,
          });
        }
      } catch (e) {
        console.error('Не удалось сохранить настройки модели по умолчанию', e);
      }

      const nextUser: User = {
        id: res.id,
        login: res.login,
        model: defaultModel,
        modelChanged: false,
      };

      setUser(nextUser);
      persistUser(nextUser);
      setChats([]);
    },
    [],
  );

  const createChat = useCallback(async (title?: string) => {
    if (!user) return null;
    try {
      const chat = await chatApi.createChat({ title, userId: user.id });
      if (!chat) return null;
      setChats((prev) => [chat, ...prev]);
      return chat;
    } catch (e) {
      console.error('Не удалось создать чат', e);
      return null;
    }
  }, [user]);

  const logout = useCallback(async () => {
    setUser(null);
    setChats([]);
    persistUser(null);
  }, []);

  const deleteAccount = useCallback(async () => {
    if (!user) return;
    await authApi.deleteUser(user.id);
    setUser(null);
    setChats([]);
    persistUser(null);
  }, [user]);

  const updateLogin = useCallback(
    async (newLogin: string) => {
      if (!user) return;
      await authApi.updateUserLogin(user.id, newLogin);

      const updated: User = { ...user, login: newLogin };
      setUser(updated);
      persistUser(updated);
    },
    [user],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      chats,
      initializing,
      login,
      register,
      refreshChats,
      createChat,
      logout,
      updateLogin,
      deleteAccount,
    }),
    [user, chats, initializing, login, register, refreshChats, createChat, logout, updateLogin, deleteAccount],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useAuthContext();
}
