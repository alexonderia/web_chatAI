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
  replaceChats: (next: ChatSummary[]) => void;
  updateChatTitle: (chatId: number, title: string) => void;
  removeChat: (chatId: number) => void;

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
    if (!user) {
      setChats([]);
    }
  }, [user]);

  const replaceChats = useCallback((next: ChatSummary[]) => {
    setChats(next);
  }, []);

  const updateChatTitle = useCallback((chatId: number, title: string) => {
    setChats((prev) => prev.map((chat) => (chat.id === chatId ? { ...chat, title } : chat)));
  }, []);

  const removeChat = useCallback((chatId: number) => {
    setChats((prev) => prev.filter((chat) => chat.id !== chatId));
  }, []);

  useEffect(() => {
    const loadSession = async () => {
      const stored = localStorage.getItem(USER_STORAGE_KEY);
      if (!stored) {
        setInitializing(false);
        return;
      }

      const storedUser: User = JSON.parse(stored);
      setUser(storedUser);

      if (!storedUser?.id) {
        setInitializing(false);
        return;
      }

      setInitializing(false);
    };

    void loadSession();
  }, []);

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
    },
    [refreshChats],
  );

  const register = useCallback(
    async (payload: AuthPayload) => {
      const res = await authApi.register(payload);

      const nextUser: User = {
        id: res.id,
        login: res.login,
        model: res.model ?? null,
        modelChanged: res.modelChanged ?? false,
      };

      setUser(nextUser);
      persistUser(nextUser);
      setChats([]);
    },[]);

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
      replaceChats,
      updateChatTitle,
      removeChat,
      logout,
      updateLogin,
      deleteAccount,
    }),
    [
      user,
      chats,
      initializing,
      login,
      register,
      refreshChats,
      createChat,
      replaceChats,
      updateChatTitle,
      removeChat,
      logout,
      updateLogin,
      deleteAccount,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useAuthContext();
}
