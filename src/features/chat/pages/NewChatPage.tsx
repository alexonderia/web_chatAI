import { MouseEvent, useCallback, useEffect, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { UserSettingsDialog } from '@/features/settings/UserSettingsDialog';
import { ChatSidebar } from '@/features/chat/components/ChatSidebar';
import { ChatTopBar } from '@/features/chat/components/ChatTopBar';
import { ChatInput } from '@/features/chat/components/ChatInput';
import { ChatThread } from '@/features/chat/components/ChatThread';
import { AdvancedSettingsPopover } from '@/features/chat/components/AdvancedSettingsPopover';
import { ModelSettingsPopover } from '@/features/chat/components/ModelSettingsPopover';
import { ChatMessage, MessageRole } from '@/features/chat/components/ChatMessageCard';
import { useAuth } from '@/features/auth/AuthProvider';
import { useSimpleRouter } from '@/app/router/SimpleRouter';
import { chatApi, ChatMessageDto, ChatSettingsDto } from '@/app/api/chat';
import { useSettings } from '@/features/settings/SettingsProvider';
import { useModels } from '@/features/ai/ModelProvider';
import { aiApi } from '@/app/api/ai';

const drawerWidth = 320;
const collapsedWidth = 84;

interface NewChatPageProps {
  chatIdFromRoute?: number | null;
}

const messageRoles = ['assistant', 'ai', 'bot', 'system'];

const safeLower = (value: unknown): string => (typeof value === 'string' ? value.toLowerCase() : '');

function normalizeMessageRole(item: ChatMessageDto): MessageRole {
  if (typeof item.role === 'number') {
    return item.role === 0 ? 'assistant' : 'user';
  }

  if (typeof item.role === 'string') {
    const normalizedRole = item.role.toLowerCase();
    if (normalizedRole === '0' || normalizedRole === 'assistant' || normalizedRole === 'ai' || normalizedRole === 'bot') {
      return 'assistant';
    }
    if (normalizedRole === '1' || normalizedRole === 'user') {
      return 'user';
    }
  }

  const normalizedRole = safeLower(item.role);
  if (normalizedRole) {
    if (normalizedRole === 'assistant' || normalizedRole === 'ai' || normalizedRole === 'bot') {
      return 'assistant';
    }
    if (normalizedRole === 'user') {
      return 'user';
    }
  }

  if (typeof item.isAi === 'boolean') {
    return item.isAi ? 'assistant' : 'user';
  }

  if (typeof item.isAI === 'boolean') {
    return item.isAI ? 'assistant' : 'user';
  }

  const normalizedType = safeLower(item.type);
  if (messageRoles.includes(normalizedType)) {
    return 'assistant';
  }

  const normalizedAuthor = safeLower(item.author ?? item.userLogin);
  if (messageRoles.some((role) => normalizedAuthor.includes(role))) {
    return 'assistant';
  }

  return 'user';
}

const toDataUri = (src: string) =>
  src.startsWith('data:') || src.startsWith('http') ? src : `data:image/png;base64,${src}`;

const flattenImageValues = (values: unknown): string[] => {
  if (!values) return [];
  if (typeof values === 'string') return [values];
  if (Array.isArray(values)) return values.flatMap(flattenImageValues);
  if (typeof values === 'object') {
    const candidate = values as { imageBlob?: string; base64Image?: string; imageUrl?: string; url?: string };
    return [candidate.imageBlob, candidate.base64Image, candidate.imageUrl, candidate.url].filter(
      Boolean,
    ) as string[];
  }
  return [];
};

function normalizeImages(item: ChatMessageDto): string[] {
  const candidates = [
    ...(item.base64Images ?? []),
    ...(item.imageUrls ?? []),
    ...(item.imageBlobs ?? []),
    ...flattenImageValues(item.images),
    item.base64Image,
    item.imageBlob,
    item.imageUrl,
  ].filter(Boolean) as string[];

  return Array.from(new Set(candidates)).map(toDataUri);
}
function mapMessages(items: ChatMessageDto[]): ChatMessage[] {
  return items.map((item, index) => {
    const role = normalizeMessageRole(item);
    const author = item.author ?? item.userLogin ?? (role === 'assistant' ? 'ИИ ассистент' : 'Вы');
    const messageType = safeLower(item.messageType ?? item.type) || 'text';
    const images = normalizeImages(item);
    const content = item.content ?? item.text ?? (images.length > 0 ? '' : '');

    return {
      id: String(item.id ?? index),
      role,
      author,
      content,
      messageType,
      images,
      timestamp: item.createdAt,
    };
  });
}

function NewChatPage({ chatIdFromRoute = null }: NewChatPageProps) {
  const { user, chats, refreshChats, createChat, initializing } = useAuth();
  const { navigate, pathname } = useSimpleRouter();
  const { settings } = useSettings();
  const { models } = useModels();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedChat, setSelectedChat] = useState<number | null>(chatIdFromRoute);
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

  const advancedOpen = Boolean(advancedSettingsAnchor);
  
  const sidebarWidth = useMemo(
    () => (sidebarOpen ? drawerWidth : collapsedWidth),
    [sidebarOpen],
  );

  const fallbackModel = useMemo(() => {
    return (
      chatSettings?.model ??
      settings?.model ??
      settings?.defaultModel ??
      models[0]?.name ??
      null
    );
  }, [chatSettings?.model, models, settings?.defaultModel, settings?.model]);

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

  const handleClearChat = () => setMessages([]);
  
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

  useEffect(() => {
    if (chatIdFromRoute && chatIdFromRoute !== selectedChat) {
      setSelectedChat(chatIdFromRoute);
    }
  }, [chatIdFromRoute, selectedChat]);

  useEffect(() => {
    if (!initializing && !user) {
      navigate('/');
      return;
    }

    if (user) {
      void refreshChats();
    }
  }, [user, initializing, navigate, refreshChats]);

  const loadChatData = useCallback(async (chatId: number) => {
    setLoadingChat(true);
    setError(null);
    try {
      const [settingsDto, msgs] = await Promise.all([
        chatApi.getChatSettings(chatId),
        chatApi.getMessages(chatId),
      ]);
      setChatSettings(settingsDto);
      setMessages(mapMessages(msgs));
    } catch (e) {
      setError((e as Error).message);
      setChatSettings(null);
      setMessages([]);
    } finally {
      setLoadingChat(false);
    }
  }, []);

  useEffect(() => {
    if (!selectedChat) {
      setChatSettings(null);
      setMessages([]);
      return;
    }
    void loadChatData(selectedChat);
  }, [selectedChat, loadChatData]);

  useEffect(() => {
    if (!pathname.startsWith('/client')) return;
    if (!selectedChat && chatIdFromRoute) {
      setSelectedChat(chatIdFromRoute);
    }
  }, [chatIdFromRoute, pathname, selectedChat]);

  const persistChatSettings = useCallback(
    async (next: Partial<ChatSettingsDto>) => {
      if (!selectedChat) return;
      const dto: ChatSettingsDto = {
        id: chatSettings?.id ?? 0,
        chatId: selectedChat,
        model: next.model ?? chatSettings?.model ?? currentModel ?? null,
        temperature: next.temperature ?? chatSettings?.temperature ?? temperature,
        maxTokens: next.maxTokens ?? chatSettings?.maxTokens ?? maxTokens,
      };
      await chatApi.saveChatSettings(dto);
      setChatSettings(dto);
    },
    [chatSettings, currentModel, maxTokens, selectedChat, temperature],
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
    setSelectedChat(null);
    setChatSettings(null);
    setMessages([]);
    navigateToChat(null);
  };

  const handleSelectChat = (id: number) => {
    setSelectedChat(id);
    navigateToChat(id);
  };

  const handleSendMessage = async (text: string) => {
    if (!user) return;
    setSending(true);
    setError(null);

    try {
      let chatId = selectedChat;
      if (!chatId) {
        const created = await createChat(text.slice(0, 40) || 'Новый чат');
        if (!created) return;
        chatId = created.id;
        setSelectedChat(chatId);
        await refreshChats();
        navigateToChat(chatId);
      }

      if (!chatId) return;

      const model = currentModel ?? fallbackModel;
      const nextTemperature = temperature ?? settings?.temperature ?? 1;
      const nextMaxTokens = maxTokens ?? settings?.maxTokens ?? 512;

      setMessages((prev) => [
        ...prev,
        { id: `local-${Date.now()}`, role: 'user', author: 'Вы', content: text },
      ]);

      await chatApi.sendMessage({ chatId, userId: user.id, text });

      if (model) {
        await aiApi.sendChatMessage({
          chatId,
          userId: user.id,
          text,
          model,
          temperature: nextTemperature,
          maxTokens: nextMaxTokens,
        });
      }

      const updated = await chatApi.getMessages(chatId);
      setMessages(mapMessages(updated));
      setChatSettings((prev) => ({
        id: prev?.id ?? chatSettings?.id ?? 0,
        chatId,
        model: model ?? prev?.model ?? null,
        temperature: nextTemperature,
        maxTokens: nextMaxTokens,
      }));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSending(false);
    }
  };
 

  return (
    <Box
      sx={(theme) => ({
        position: 'relative',
        minHeight: '100vh',
        bgcolor: theme.palette.background.default,
        display: 'flex',
        flexDirection: 'column',
      })} 
    >
      <ChatSidebar
        open={sidebarOpen}
        drawerWidth={drawerWidth}
        collapsedWidth={collapsedWidth}
        chats={chats}
        selectedChat={selectedChat}
        onSelectChat={handleSelectChat}
        onToggle={() => setSidebarOpen((prev) => !prev)}
        onOpenSettings={() => setSettingsOpen(true)}
        onCreateChat={handleStartNewChat}
      />
      <ChatTopBar
        sidebarWidth={sidebarWidth}
        onOpenModelSettings={handleOpenModelSettings}
        modelButtonLabel={currentModel ?? 'Выберите модель'}
        onClearChat={handleClearChat}
        rightSlot={error ? (
          <Typography color="error" variant="body2">
            {error}
          </Typography>
        ) : null}
      />

      <Box
        component="main"
        sx={(theme) => ({
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          p: { xs: 3, md: 6 },
          mt: 10,
          ml: { xs: 0, sm: `${sidebarWidth}px` },
          minHeight: `calc(100vh - ${theme.spacing(10)})`,
          boxSizing: 'border-box',
          transition: theme.transitions.create('margin-left', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        })}
      >
        <Stack
          spacing={4}
          alignItems="center"
          justifyContent="flex-end"
          sx={{
            flexGrow: 1,
            width: '100%',
            pb: 2,
          }}
        >
          <Stack
            spacing={3}
            sx={{
              width: '100%',
              maxWidth: 860,
              px: { xs: 2, md: 0 },
              flexGrow: 1,
              justifyContent: 'flex-end',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
           {loadingChat ? (
              <Stack alignItems="center" justifyContent="center" sx={{ py: 6 }}>
                <CircularProgress />
              </Stack>
            ) : (
              <ChatThread messages={messages} />
            )}
          </Stack>

          <Stack
            sx={{
              width: '100%',
              maxWidth: 860,
              px: { xs: 2, md: 0 },
            }}
          >
            <ChatInput onSend={handleSendMessage} disabled={sending || loadingChat} />
          </Stack>
        </Stack>
      </Box>

      <ModelSettingsPopover
        anchorEl={modelSettingsAnchor}
        open={Boolean(modelSettingsAnchor)}
        onClose={handleCloseModelSettings}
        model={currentModel}
        models={models}
        onModelChange={handleModelChange}
        onOpenAdvanced={handleOpenAdvancedSettings}
        advancedOpen={advancedOpen}
      />

      <AdvancedSettingsPopover
        anchorEl={advancedSettingsAnchor}
        open={advancedOpen}
        onClose={handleCloseAdvancedSettings}
        temperature={temperature}
        maxTokens={maxTokens}
        onSave={handleAdvancedSave}
      />

      <UserSettingsDialog open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </Box>
  );
}

export default NewChatPage;
