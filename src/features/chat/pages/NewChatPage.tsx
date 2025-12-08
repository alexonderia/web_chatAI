import { MouseEvent, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

import { UserSettingsDialog } from '@/features/settings/UserSettingsDialog';
import { ChatSidebar } from '@/features/chat/components/ChatSidebar';
import { ChatTopBar } from '@/features/chat/components/ChatTopBar';
import { ChatInput } from '@/features/chat/components/ChatInput';
import { ChatThread } from '@/features/chat/components/ChatThread';
import { AdvancedSettingsPopover } from '@/features/chat/components/AdvancedSettingsPopover';
import {
  ModelSettingsPopover,
  ModelId,
} from '@/features/chat/components/ModelSettingsPopover';
import { ChatMessage } from '@/features/chat/components/ChatMessageCard';

const drawerWidth = 320;
const collapsedWidth = 84;

const initialMessages: ChatMessage[] = [
  {
    id: 'm-1',
    role: 'user',
    author: 'Вы',
    content: 'Текст вопроса',
  },
  {
    id: 'm-2',
    role: 'assistant',
    author: 'ИИ ассистент',
    content:
      'Текст ответа ответа Текст ответа\nТекст ответа ответа Текст ответа\nТекст ответа ответа Текст ответа ответа Текст ответа ответа',
  },
];


function NewChatPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedChat, setSelectedChat] = useState<number | null>(0);
  const [modelSettingsAnchor, setModelSettingsAnchor] = useState<HTMLElement | null>(null);
  const [advancedSettingsAnchor, setAdvancedSettingsAnchor] = useState<HTMLElement | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [currentModel, setCurrentModel] = useState<ModelId>('model-1');
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const advancedOpen = Boolean(advancedSettingsAnchor);
  
  const sidebarWidth = useMemo(
    () => (sidebarOpen ? drawerWidth : collapsedWidth),
    [sidebarOpen],
  );

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
  const handleStartNewChat = () => setMessages(initialMessages);

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
        selectedChat={selectedChat}
        onSelectChat={setSelectedChat}
        onToggle={() => setSidebarOpen((prev) => !prev)}
        onOpenSettings={() => setSettingsOpen(true)}
        onCreateChat={handleStartNewChat}
      />
      <ChatTopBar
        sidebarWidth={sidebarWidth}
        onOpenModelSettings={handleOpenModelSettings}
        modelButtonLabel="Текущая модель"
        onClearChat={handleClearChat}
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
          minHeight: `calc(100vh - ${theme.spacing(10)})`, // 100vh - высота AppBar (mt:10)
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
            <ChatThread messages={messages} />
          </Stack>

          <Stack
            sx={{
              width: '100%',
              maxWidth: 860,              
              px: { xs: 2, md: 0 },
            }}
          >
            <ChatInput />
          </Stack>
        </Stack>
      </Box>

      <ModelSettingsPopover
        anchorEl={modelSettingsAnchor}
        open={Boolean(modelSettingsAnchor)}
        onClose={handleCloseModelSettings}
        model={currentModel}
        onModelChange={setCurrentModel}
        onOpenAdvanced={handleOpenAdvancedSettings}
        advancedOpen={advancedOpen}
      />

      <AdvancedSettingsPopover
        anchorEl={advancedSettingsAnchor}
        open={advancedOpen}
        onClose={handleCloseAdvancedSettings}
      />

      <UserSettingsDialog open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </Box>
  );
}

export default NewChatPage;
