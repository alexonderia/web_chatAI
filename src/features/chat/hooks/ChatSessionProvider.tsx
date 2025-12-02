import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { fetchModels, sendChatMessage } from '../api/chatApi';
import type { ChatMessage, ChatRequestBody, ChatResponse, ModelInfo } from '../types';

const SESSION_STORAGE_KEY = 'webapi-chatai-session';

interface ChatContextValue {
  model: string;
  models?: ModelInfo[];
  setModel: (value: string) => void;
  messages: ChatMessage[];
  sendMessage: (content: string) => void;
  isSending: boolean;
  systemPrompt: string;
  setSystemPrompt: (value: string) => void;
  temperature: number;
  setTemperature: (value: number) => void;
  topP: number;
  setTopP: (value: number) => void;
  stream: boolean;
  setStream: (value: boolean) => void;
  canSend: boolean;
  sessionId?: string;
}

const ChatSessionContext = createContext<ChatContextValue | null>(null);

function createMessage(role: ChatMessage['role'], content: string): ChatMessage {
  return {
    id: crypto.randomUUID(),
    role,
    content,
    createdAt: new Date().toISOString(),
  };
}

export const ChatSessionProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();
  const [sessionId, setSessionId] = useState<string | undefined>(() =>
    localStorage.getItem(SESSION_STORAGE_KEY) || undefined,
  );
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [systemPrompt, setSystemPrompt] = useState('Вы — полезный ассистент.');
  const [model, setModel] = useState('gpt-3.5-turbo');
  const [temperature, setTemperature] = useState(0.7);
  const [topP, setTopP] = useState(1);
  const [stream, setStream] = useState(false);

  useEffect(() => {
    if (sessionId) {
      localStorage.setItem(SESSION_STORAGE_KEY, sessionId);
    }
  }, [sessionId]);

  const { data: models } = useQuery({
    queryKey: ['models'],
    queryFn: fetchModels,
    staleTime: 1000 * 60 * 10,
  });

  useEffect(() => {
    if (models?.length && !models.find((m) => m.id === model)) {
      setModel(models[0].id);
    }
  }, [model, models]);

  const mutation = useMutation({
    mutationFn: (content: string) => {
      const message = createMessage('user', content);
      const body: ChatRequestBody = {
        model,
        temperature,
        topP,
        stream,
        systemPrompt,
        messages: [...messages, message].map(({ role, content: text }) => ({ role, content: text })),
        sessionId,
      };

      setMessages((prev) => [...prev, message]);
      return sendChatMessage(body);
    },
    onSuccess: (response: ChatResponse) => {
      setSessionId(response.sessionId);
      setMessages((prev) => [...prev, response.reply]);
      queryClient.setQueryData(['sessions'], (old: string[] | undefined) => {
        const safe = old ?? [];
        return Array.from(new Set([response.sessionId, ...safe]));
      });
    },
  });

  const value: ChatContextValue = {
    model,
    models,
    setModel,
    messages,
    sendMessage: mutation.mutate,
    isSending: mutation.isPending,
    systemPrompt,
    setSystemPrompt,
    temperature,
    setTemperature,
    topP,
    setTopP,
    stream,
    setStream,
    canSend: !mutation.isPending,
    sessionId,
  };

  return <ChatSessionContext.Provider value={value}>{children}</ChatSessionContext.Provider>;
};

export function useChatSession() {
  const ctx = useContext(ChatSessionContext);
  if (!ctx) {
    throw new Error('useChatSession must be used within ChatSessionProvider');
  }
  return ctx;
}