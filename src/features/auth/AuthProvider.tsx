import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { authApi, AuthPayload, AuthResponse } from '@/app/api/auth';
import { chatApi, ChatSummary } from '@/app/api/chat';

interface User {
  id: number;
  login: string;
}

interface AuthContextValue {
  user: User | null;
  chats: ChatSummary[];
  initializing: boolean;
  login: (payload: AuthPayload) => Promise<void>;
  register: (payload: AuthPayload) => Promise<void>;
  refreshChats: () => Promise<ChatSummary[]>;
  createChat: (title?: string) => Promise<ChatSummary | null>;
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

async function performAuth(request: Promise<AuthResponse>): Promise<User> {
  const result = await request;

  const user: User = {
    id: result.id,
    login: result.login,
  };

  persistUser(user);
  return user;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [chats, setChats] = useState<ChatSummary[]>([]);
  const [initializing, setInitializing] = useState(true);

  const refreshChats = useCallback(async (): Promise<ChatSummary[]> => {
    if (!user) return [];
    const data = await chatApi.getUserChats(user.id);
    setChats(data);
    return data;
  }, [user]);

  const loadSession = useCallback(async () => {
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);

    if (storedUser) {
      const userObj = JSON.parse(storedUser);
      setUser(userObj);

      try {
        const chats = await chatApi.getUserChats(userObj.id);
        setChats(chats);
      } catch (err) {
        console.error("Ошибка загрузки чатов:", err);
        setChats([]);
      }
    }

    setInitializing(false);
  }, []);


  useEffect(() => {
    loadSession();
  }, [loadSession]);

  const login = useCallback(async (payload: AuthPayload) => {
    const authedUser = await performAuth(authApi.login(payload));
    setUser(authedUser);
    await refreshChats();
  }, [refreshChats]);

  const register = useCallback(async (payload: AuthPayload) => {
    const authedUser = await performAuth(authApi.register(payload));
    setUser(authedUser);
    setChats([]);
  }, []);

  const createChat = useCallback(async (title?: string) => {
    try {
      const chat = await chatApi.createChat({ title });
      if (!chat) return null;
      setChats((prev): ChatSummary[] => [chat, ...prev]);
      return chat;
    } catch (error) {
      console.error('Не удалось создать чат', error);
      return null;
      }
  }, []);

  const value = useMemo(
    () => ({ user, chats, initializing, login, register, refreshChats, createChat }),
    [user, chats, initializing, login, register, refreshChats, createChat],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useAuthContext();
}
