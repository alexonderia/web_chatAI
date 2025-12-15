import { MouseEvent, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { chatApi, ChatSettingsDto, ChatSummary, deleteAllUserChats } from '@/app/api/chat';
import { useSimpleRouter } from '@/app/router/SimpleRouter';
import { ChatMessage } from '@/features/chat/components/ChatMessageCard';
import { useAuth } from '@/features/auth/AuthProvider';
import { useSettings } from '@/features/settings/SettingsProvider';
import { useModels } from '@/features/ai/ModelProvider';
import { mapMessages } from '@/features/chat/utils/messageMappers';

const drawerWidth = 320;
const collapsedWidth = 84;

export interface ChatPageProps {
  chatIdFromRoute?: number | null;
}

type ChatMeta = {
  lastMessageAt?: string;
  model?: string | null;
};

const getDataUrl = (src: string) => (src.startsWith('data:') ? src : `data:image/png;base64,${src}`);

export function useChatPage({ chatIdFromRoute = null }: ChatPageProps) {
  const { user, chats, refreshChats, createChat, initializing, replaceChats, updateChatTitle, removeChat } = useAuth();
  const { navigate, pathname } = useSimpleRouter();
  const { settings } = useSettings();
  const { models, reloadModels } = useModels();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedChat, setSelectedChat] = useState<number | null>(chatIdFromRoute ?? null);
  const [modelSettingsAnchor, setModelSettingsAnchor] = useState<HTMLElement | null>(null);
  const [advancedSettingsAnchor, setAdvancedSettingsAnchor] = useState<HTMLElement | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [currentModel, setCurrentModel] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatSettings, setChatSettings] = useState<ChatSettingsDto | null>(null);
  const [loadingChat, setLoadingChat] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [temperature, setTemperature] = useState<number>(1);
  const [maxTokens, setMaxTokens] = useState<number>(512);
  const [chatMeta, setChatMeta] = useState<Record<number, ChatMeta>>({});
  const [chatTitleDialogOpen, setChatTitleDialogOpen] = useState(false);
  const [chatTitleValue, setChatTitleValue] = useState('');
  const [chatForAction, setChatForAction] = useState<ChatSummary | null>(null);
  const [dialogMode, setDialogMode] = useState<'create' | 'rename'>('create');
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [deletingChatId, setDeletingChatId] = useState<number | null>(null);
  const [createIncognito, setCreateIncognito] = useState<boolean>(false);
  const [incognitoChatId, setIncognitoChatId] = useState<number | null>(null);
  const [incognitoChat, setIncognitoChat] = useState<ChatSummary | null>(null);
  const scrollAnchorRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const prevMessagesLengthRef = useRef(0);
  const prevChatIdRef = useRef<number | null>(null);
  const prevLastMessageRef = useRef<{ id: string | null; length: number }>({ id: null, length: 0 });
  const initialDataLoadedRef = useRef(false);
  const initialModelsLoadedRef = useRef(false);
  const chatCacheRef = useRef<Record<number, { messages: ChatMessage[]; settings: ChatSettingsDto | null }>>({});

  const advancedOpen = Boolean(advancedSettingsAnchor);

  const sidebarWidth = useMemo(() => (sidebarOpen ? drawerWidth : collapsedWidth), [sidebarOpen]);

  const fallbackModel = useMemo(
    () => chatSettings?.model ?? settings?.model ?? settings?.defaultModel ?? models[0]?.name ?? null,
    [chatSettings?.model, models, settings?.defaultModel, settings?.model],
  );

  const incognitoChatWithMeta = useMemo(() => {
    if (!incognitoChat) return null;

    return {
      ...incognitoChat,
      lastMessageAt: chatMeta[incognitoChat.id]?.lastMessageAt ?? incognitoChat.lastMessageAt,
      model: chatMeta[incognitoChat.id]?.model ?? incognitoChat.model ?? null,
    };
  }, [chatMeta, incognitoChat]);

  const chatsWithMeta = useMemo(() => {
    const mapped = chats.map((chat) => ({
      ...chat,
      lastMessageAt: chatMeta[chat.id]?.lastMessageAt ?? chat.lastMessageAt,
      model: chatMeta[chat.id]?.model ?? chat.model ?? null,
    }));

    if (!incognitoChatWithMeta) return mapped;

    if (mapped.some((chat) => chat.id === incognitoChatWithMeta.id)) return mapped;

    return [incognitoChatWithMeta, ...mapped];
  }, [chatMeta, chats, incognitoChatWithMeta]);

  const selectedChatIsIncognito = useMemo(
    () => (selectedChat !== null ? selectedChat === incognitoChatId : false),
    [incognitoChatId, selectedChat],
  );

  useEffect(() => {
    if (user) return;

    setIncognitoChatId(null);
    setIncognitoChat(null);
    setSelectedChat(null);
    setMessages([]);
    setChatSettings(null);
    chatCacheRef.current = {};
    setCreateIncognito(false);
    setChatMeta({});
  }, [user]);

  const updateChatMeta = useCallback((chatId: number, meta: ChatMeta) => {
    setChatMeta((prev) => ({
      ...prev,
      [chatId]: { ...prev[chatId], ...meta },
    }));
  }, []);

  const resetChatMeta = useCallback((chatId: number) => {
    setChatMeta((prev) => {
      const next = { ...prev };
      delete next[chatId];
      return next;
    });
  }, []);

  const navigateToChat = useCallback(
    (chatId: number | null) => {
      if (!chatId) {
        navigate('/client/newChat');
      } else {
        navigate(`/client/chat/${chatId}`);
      }
    },
    [navigate],
  );

  const loadInitialChats = useCallback(async () => {
    if (!user) return;
    const loadedChats = await refreshChats();
    const metaEntries = await Promise.all(
      loadedChats.map(async (chat) => {
        try {
          const [lastMessage] = await chatApi.getLastMessage(chat.id);
          if (!lastMessage) return null;
          return { chatId: chat.id, lastMessageAt: lastMessage.createdAt };
        } catch (e) {
          console.error('Не удалось получить время последнего сообщения', e);
          return null;
        }
      }),
    );

    setChatMeta((prev) => {
      const next = { ...prev };
      metaEntries.forEach((entry) => {
        if (!entry) return;
        next[entry.chatId] = { ...next[entry.chatId], lastMessageAt: entry.lastMessageAt };
      });
      return next;
    });
  }, [refreshChats, user]);

  const createIncognitoChat = useCallback(
    async (title?: string) => {
      if (!user) {
        setError('Авторизуйтесь, чтобы создать инкогнито-чат');
        return null;
      }
      setLoadingChat(true);
      setError(null);
      try {
        const chat = await chatApi.createChat({
          title: title || 'Инкогнито чат',
          userId: user.id,
          isIncognito: true,
        });
        if (!chat) return null;

        setIncognitoChatId(chat.id);
        setIncognitoChat(chat);
        setSelectedChat(chat.id);
        setChatSettings(null);
        setMessages([]);
        chatCacheRef.current[chat.id] = { messages: [], settings: null };
        resetChatMeta(chat.id);
        return chat;
      } catch (e) {
        setError((e as Error).message);
        return null;
      } finally {
        setLoadingChat(false);
      }
    },
    [resetChatMeta, user],
  );

  useEffect(() => {
    if (!initializing && user && !initialDataLoadedRef.current) {
      initialDataLoadedRef.current = true;
      void loadInitialChats();
    }
  }, [initializing, loadInitialChats, user]);

  useEffect(() => {
    if (!initializing && (user || incognitoChatId) && !initialModelsLoadedRef.current) {
      initialModelsLoadedRef.current = true;
      void reloadModels().catch((err) => {
        console.error('Не удалось загрузить список моделей', err);
      });
    }
  }, [incognitoChatId, initializing, reloadModels, user]);

  useEffect(() => {
    if (fallbackModel) {
      setCurrentModel(fallbackModel);
    }
  }, [fallbackModel]);

  useEffect(() => {
    if (chatSettings) {
      setTemperature(chatSettings.temperature);
      setMaxTokens(chatSettings.maxTokens);
    } else {
      setTemperature(settings?.temperature ?? 1);
      setMaxTokens(settings?.maxTokens ?? 512);
    }
  }, [chatSettings, settings?.maxTokens, settings?.temperature]);

  const handleOpenModelSettings = (event: MouseEvent<HTMLElement>) => {
    setModelSettingsAnchor(event.currentTarget);
  };

  const handleCloseModelSettings = () => {
    setModelSettingsAnchor(null);
    setAdvancedSettingsAnchor(null);
  };

  const handleOpenAdvancedSettings = (anchor: HTMLElement) => {
    setAdvancedSettingsAnchor((prev) => (prev ? null : anchor));
  };

  const handleCloseAdvancedSettings = () => setAdvancedSettingsAnchor(null);

  useEffect(() => {
    if (chatIdFromRoute && chatIdFromRoute !== selectedChat) {
      setSelectedChat(chatIdFromRoute);
    }
  }, [chatIdFromRoute, selectedChat]);

  useEffect(() => {
    if (!initializing && !user) {
      navigate('/');
    }
  }, [initializing, navigate, user]);

  const applyChatData = useCallback(
    (chatId: number, settingsDto: ChatSettingsDto | null, msgs: ChatMessage[]) => {
      chatCacheRef.current[chatId] = { messages: msgs, settings: settingsDto };
      setChatSettings(settingsDto);
      setMessages(msgs);
    },
    [],
  );

  const loadChatData = useCallback(
    async (chatId: number) => {
      const cached = chatCacheRef.current[chatId];
      setLoadingChat(true);
      setError(null);

      if (chatId === incognitoChatId) {
        applyChatData(chatId, null, cached?.messages ?? []);
        setLoadingChat(false);
        return;
      }


      if (cached) {
        applyChatData(chatId, cached.settings, cached.messages);
        setLoadingChat(false);
        return;
      }

      try {
        const [settingsDto, msgs] = await Promise.all([chatApi.getChatSettings(chatId), chatApi.getMessages(chatId)]);
        const mappedMessages = mapMessages(msgs);
        applyChatData(chatId, settingsDto, mappedMessages);
        updateChatMeta(chatId, {
          lastMessageAt: msgs.at(-1)?.createdAt,
          model: settingsDto.model,
        });
      } catch (e) {
        setError((e as Error).message);
        setChatSettings(null);
        setMessages([]);
      } finally {
        setLoadingChat(false);
      }
    },
    [applyChatData, incognitoChatId, updateChatMeta],
  );

  useEffect(() => {
    if (!user && selectedChat !== incognitoChatId) return;
    if (!selectedChat) {
      setChatSettings(null);
      setMessages([]);
      return;
    }
    void loadChatData(selectedChat);
  }, [incognitoChatId, loadChatData, selectedChat, user]);

  useEffect(() => {
    if (!pathname.startsWith('/client')) return;
    if (!selectedChat && chatIdFromRoute) {
      setSelectedChat(chatIdFromRoute);
    }
  }, [chatIdFromRoute, pathname, selectedChat]);

  const scrollToBottom = useCallback(
    (behavior: ScrollBehavior = 'auto') => {
      const container = scrollContainerRef.current;
      const anchor = scrollAnchorRef.current;
      if (!container) return;

      requestAnimationFrame(() => {
        if (anchor) {
          anchor.scrollIntoView({ block: 'end', behavior });
          return;
        }
        const top = container.scrollHeight - container.clientHeight;
        container.scrollTo({
          top: top > 0 ? top : 0,
          behavior,
        });
      });
    },
    [],
  );

  useLayoutEffect(() => {
    if (loadingChat) return;

    const prevLen = prevMessagesLengthRef.current;
    const currLen = messages.length;
    const prevChatId = prevChatIdRef.current;
    const lastMessage = messages.at(-1);
    const lastMessageLength = (lastMessage?.content?.length ?? 0) + (lastMessage?.images?.length ?? 0);
    const prevLastMessage = prevLastMessageRef.current;

    if (!currLen) {
      prevMessagesLengthRef.current = currLen;
      prevChatIdRef.current = selectedChat ?? null;
      prevLastMessageRef.current = { id: null, length: 0 };
      return;
    }

    if (prevChatId !== (selectedChat ?? null) || prevLen === 0) {
      scrollToBottom('auto');
    } else if (currLen > prevLen) {
      scrollToBottom('smooth');
    } else if (lastMessage?.id === prevLastMessage.id && lastMessageLength > prevLastMessage.length) {
      scrollToBottom('auto');
    }

    prevMessagesLengthRef.current = currLen;
    prevChatIdRef.current = selectedChat ?? null;
    prevLastMessageRef.current = { id: lastMessage?.id ?? null, length: lastMessageLength };
  }, [messages, selectedChat, loadingChat, scrollToBottom]);

  useLayoutEffect(() => {
    if (!chatTitleDialogOpen) return;
    scrollToBottom('auto');
  }, [chatTitleDialogOpen, scrollToBottom]);

  const persistChatSettings = useCallback(
    async (next: Partial<ChatSettingsDto>) => {
      if (!selectedChat || selectedChatIsIncognito) return;
      const dto: ChatSettingsDto = {
        id: chatSettings?.id ?? 0,
        chatId: selectedChat,
        model: next.model ?? chatSettings?.model ?? currentModel ?? null,
        temperature: next.temperature ?? chatSettings?.temperature ?? temperature,
        maxTokens: next.maxTokens ?? chatSettings?.maxTokens ?? maxTokens,
      };
      try {
        await chatApi.saveChatSettings(dto);
      } catch (err) {
        const message = (err as Error).message?.toLowerCase() ?? '';
        if (!message.includes('cycle')) {
          throw err;
        }
        console.warn('Получена циклическая структура при сохранении настроек чата', err);
      }
      setChatSettings(dto);
      chatCacheRef.current[selectedChat] = { ...chatCacheRef.current[selectedChat], settings: dto };
      updateChatMeta(selectedChat, { model: dto.model ?? null });
    },
    [chatSettings, currentModel, maxTokens, selectedChat, selectedChatIsIncognito, temperature, updateChatMeta],
  );

  const handleModelChange = async (model: string) => {
    setCurrentModel(model);
    if (selectedChat) {
      try {
        await persistChatSettings({ model });
      } catch (e) {
        setError((e as Error).message);
      }
    }
  };

  const handleAdvancedSave = async (next: { temperature: number; maxTokens: number }) => {
    setTemperature(next.temperature);
    setMaxTokens(next.maxTokens);
    if (selectedChat) {
      try {
        await persistChatSettings(next);
      } catch (e) {
        setError((e as Error).message);
      }
    }
    handleCloseAdvancedSettings();
  };

  const handleStartNewChat = () => {
    setError(null);
    setChatForAction(null);
    setDialogMode('create');
    setChatTitleValue('');
    setCreateIncognito(false);
    setChatTitleDialogOpen(true);
  };

  const handleSelectChat = (id: number) => {
    setSelectedChat(id);
    navigateToChat(id);
  };

  const handleSubmitChatTitle = async () => {
    const trimmedTitle = chatTitleValue.trim();
    setSending(true);
    setError(null);
    let success = false;

    try {
      if (dialogMode === 'create') {
        if (createIncognito) {
          const chat = await createIncognitoChat(trimmedTitle || 'Инкогнито чат');
          if (chat) {
            success = true;
          }
        } else {
          const chat = await createChat(trimmedTitle || 'Новый чат');
          if (!chat) return;
          setSelectedChat(chat.id);
          setChatSettings(null);
          setMessages([]);
          setChatMeta((prev) => {
            const next = { ...prev };
            delete next[chat.id];
            return next;
          });
          navigateToChat(chat.id);
          success = true;
        }
      } else if (chatForAction) {
        const nextTitle = trimmedTitle || chatForAction.title;
        await chatApi.renameChat(chatForAction.id, nextTitle);
        updateChatTitle(chatForAction.id, nextTitle);
        if (incognitoChatId === chatForAction.id) {
          setIncognitoChat((prev) => (prev ? { ...prev, title: nextTitle } : prev));
        }
        setChatForAction((prev) => (prev ? { ...prev, title: nextTitle } : prev));
        success = true;
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSending(false);
      if (success) {
        setChatTitleDialogOpen(false);
      }
    }
  };

  const handleRequestRename = (chat: ChatSummary) => {
    setChatForAction(chat);
    setDialogMode('rename');
    setChatTitleValue(chat.title);
    setChatTitleDialogOpen(true);
  };

  const handleDeleteChat = async (chatId: number) => {
    if (!user) return;
    if (!window.confirm('Удалить чат?')) return;
    setDeletingChatId(chatId);
    setError(null);
    try {
      await chatApi.deleteChat(chatId);
      removeChat(chatId);
      if (incognitoChatId === chatId) {
        setIncognitoChatId(null);
        setIncognitoChat(null);
      }
      delete chatCacheRef.current[chatId];
      if (selectedChat === chatId) {
        setSelectedChat(null);
        setMessages([]);
        setChatSettings(null);
        navigateToChat(null);
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setDeletingChatId(null);
    }
  };

  const handleDeleteAllChats = async () => {
    if (!user) {
      setError('Авторизуйтесь, чтобы управлять чатами');
      return;
    }
    if (!window.confirm('Удалить все чаты?')) return;
    setBulkDeleting(true);
    setError(null);
    try {
      await deleteAllUserChats(user.id);
      replaceChats([]);
      setIncognitoChatId(null);
      setIncognitoChat(null);
      chatCacheRef.current = {};
      setSelectedChat(null);
      setMessages([]);
      setChatSettings(null);
      navigateToChat(null);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBulkDeleting(false);
    }
  };

  const handleClearChat = async () => {
    if (!selectedChat) return;
    setError(null);
    if (selectedChatIsIncognito) {
      setMessages([]);
      const existing = chatCacheRef.current[selectedChat] ?? { settings: null, messages: [] };
      chatCacheRef.current[selectedChat] = { ...existing, messages: [] };
      return;
    }
    try {
      await chatApi.clearChat(selectedChat);
      setMessages([]);
      const existing = chatCacheRef.current[selectedChat] ?? { settings: chatSettings };
      chatCacheRef.current[selectedChat] = { ...existing, messages: [] };
      updateChatMeta(selectedChat, { lastMessageAt: undefined });
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const handleSendMessage = async (payload: { text: string; images: string[] }) => {
    if (!user && !selectedChatIsIncognito && !createIncognito) return;

    const { text, images } = payload;
    setSending(true);
    setError(null);

    const imagePreviews = images.map(getDataUrl);

    try {
      let chatId = selectedChat;
      if (!chatId) {
        if (createIncognito) {
          const created = await createIncognitoChat(text.slice(0, 40) || 'Инкогнито чат');
          chatId = created?.id ?? null;
        } else {
          const created = await createChat(text.slice(0, 40) || 'Новый чат');
          if (!created) return;

          chatId = created.id;
          setSelectedChat(chatId);
          navigateToChat(chatId);
        }
      }

      if (!chatId) return;

      const nextMessages: ChatMessage[] = [
        ...messages,
        {
          id: `local-${Date.now()}`,
          role: 'user',
          author: 'Вы',
          content: text,
          images: imagePreviews,
        },
      ];

      setMessages(nextMessages);

      const response = await chatApi.sendMessage({
        chatId,
        userId: user?.id ?? 0,
        text,
        base64Images: images.length ? images : [],
      });

      const updatedMessages = [...nextMessages, mapMessages([response.aiMessage])[0]];
      setMessages(updatedMessages);
      chatCacheRef.current[chatId] = {
        settings: chatCacheRef.current[chatId]?.settings ?? chatSettings,
        messages: updatedMessages,
      };

      updateChatMeta(chatId, {
        lastMessageAt: response.aiMessage.createdAt,
      });
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSending(false);
    }
  };

  return {
    sidebarOpen,
    drawerWidth,
    collapsedWidth,
    sidebarWidth,
    setSidebarOpen,
    selectedChat,
    chatsWithMeta,
    messages,
    loadingChat,
    sending,
    error,
    currentModel,
    models,
    modelSettingsAnchor,
    advancedSettingsAnchor,
    advancedOpen,
    settingsOpen,
    chatTitleDialogOpen,
    chatTitleValue,
    dialogMode,
    createIncognito,
    incognitoLocked: !user,
    chatForAction,
    deletingChatId,
    bulkDeleting,
    temperature,
    maxTokens,
    isIncognito: selectedChatIsIncognito,
    scrollAnchorRef,
    scrollContainerRef,
    setChatTitleDialogOpen,
    setChatTitleValue,
    setCreateIncognito,
    setSettingsOpen,
    handleOpenModelSettings,
    handleCloseModelSettings,
    handleOpenAdvancedSettings,
    handleCloseAdvancedSettings,
    handleModelChange,
    handleAdvancedSave,
    handleStartNewChat,
    handleSelectChat,
    handleSubmitChatTitle,
    handleRequestRename,
    handleDeleteChat,
    handleDeleteAllChats,
    handleClearChat,
    handleSendMessage,
  };
}