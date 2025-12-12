import { useMemo, useState } from 'react';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AddIcon from '@mui/icons-material/Add';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import { alpha } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Tooltip from '@mui/material/Tooltip';

import logo from '@/assets/logo.svg';
import { ChatSummary } from '@/app/api/chat';

type ChatSidebarProps = {
  open: boolean;
  drawerWidth: number;
  collapsedWidth: number;
  chats: ChatSummary[];
  selectedChat: number | null;
  onSelectChat: (id: number) => void;
  onToggle: () => void;
  onOpenSettings: () => void;
  onCreateChat: () => void;
  onRenameChat: (chat: ChatSummary) => void;
  onDeleteChat: (chat: ChatSummary) => void;
  onDeleteAllChats: () => void;
  deletingChatId?: number | null;
  deletingAll?: boolean;
};

export function ChatSidebar({
  open,
  drawerWidth,
  collapsedWidth,
  chats,
  selectedChat,
  onSelectChat,
  onToggle,
  onOpenSettings,
  onCreateChat,
  onRenameChat,
  onDeleteChat,
  onDeleteAllChats,
  deletingChatId,
  deletingAll,
}: ChatSidebarProps) {
  const [logoHovered, setLogoHovered] = useState(false);

  const formatLastMessageDate = (value?: string) => {
    if (!value) return 'Нет сообщений';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'Нет сообщений';
    return date.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const sidebarWidth = useMemo(
    () => (open ? drawerWidth : collapsedWidth),
    [open, drawerWidth, collapsedWidth],
  );

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: sidebarWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          width: sidebarWidth,
          boxSizing: 'border-box',
          borderRight: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
          bgcolor: (theme) => theme.palette.background.paper,
          color: (theme) => theme.palette.text.primary,
          display: 'flex',
          flexDirection: 'column',
          transition: (theme) =>
            theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
        },
      }}
    >
      <Toolbar
        sx={{
          px: open ? 3 : 2,
          justifyContent: open ? 'space-between' : 'center',
        }}
      >
        {open ? (
          <>
            <img src={logo} alt="Web ChatAI" width={36} height={36} />
            <IconButton aria-label="Свернуть панель" onClick={onToggle}>
              <MenuIcon />
            </IconButton>
          </>
        ) : (
          <Box
            onMouseEnter={() => setLogoHovered(true)}
            onMouseLeave={() => setLogoHovered(false)}
            sx={{
              position: 'relative',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              py: 0.5,
            }}
          >
            <Box sx={{ opacity: logoHovered ? 0 : 1, transition: 'opacity 150ms ease' }}>
              <img src={logo} alt="Web ChatAI" width={36} height={36} />
            </Box>
            <IconButton
              aria-label="Открыть боковую панель"
              onClick={onToggle}
              sx={{
                position: 'absolute',
                opacity: logoHovered ? 1 : 0,
                transition: 'opacity 150ms ease',
              }}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        )}
      </Toolbar>

      {open && (
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            px: 2,
            pb: 3,
          }}
        >
          <List disablePadding sx={{ mb: 2 }}>
            <ListItem disablePadding>
              <ListItemButton sx={{ px: 1.2, borderRadius: 1 }} onClick={onCreateChat}>
                <AddIcon fontSize="small" sx={{ mr: 1 }} />
                <ListItemText primary="Новый чат" primaryTypographyProps={{ fontWeight: 600 }} />
              </ListItemButton>
            </ListItem>
          </List>

          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
            <Typography variant="subtitle1" fontWeight={700} color="text.primary" sx={{ px: 1.2 }}>
              Ваши чаты
            </Typography>
            <Button
              size="small"
              variant="text"
              sx={(theme) => ({
                minWidth: 'auto',
                fontWeight: 600,               
                textTransform: 'none',
                color: theme.palette.text.primary, 
                '&:hover': {
                  backgroundColor: 'transparent',
                },
              })}
              onClick={onDeleteAllChats}
              disabled={deletingAll}
            >
              Удалить все
            </Button>
          </Stack>

          <Divider sx={{ mb: 1.5 }} />

          <List sx={{ flexGrow: 1 }} disablePadding>
            {chats.length === 0 && (
              <ListItem disablePadding>
                <ListItemText
                  primary="Список чатов пуст"
                  secondary="Создайте новый чат, чтобы начать"
                  sx={{ px: 1.2 }}
                  primaryTypographyProps={{ fontWeight: 600 }}
                />
              </ListItem>
            )}

            {chats.map((chat) => (
              <ListItem key={chat.id} disablePadding>
                <ListItemButton
                  selected={selectedChat === chat.id}
                  onClick={() => onSelectChat(chat.id)}
                  sx={(theme) => ({
                    px: 1.2,
                    borderRadius: 1,
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.08),
                    },
                    '&.Mui-selected': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.16),
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.22),
                      },
                    },
                  })}
                >
                  <ListItemText
                    primary={chat.title}
                    primaryTypographyProps={{ fontWeight: 600 }}
                    secondary={formatLastMessageDate(chat.lastMessageAt)}
                    secondaryTypographyProps={{ variant: 'body2' }}
                  />
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Tooltip title="Переименовать">
                      <IconButton
                        size="small"
                        edge="end"
                        aria-label="rename chat"
                        onClick={(event) => {
                          event.stopPropagation();
                          onRenameChat(chat);
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Удалить">
                      <IconButton
                        size="small"
                        edge="end"
                        aria-label="delete chat"
                        onClick={(event) => {
                          event.stopPropagation();
                          onDeleteChat(chat);
                        }}
                        disabled={deletingChatId === chat.id || deletingAll}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </ListItemButton>
              </ListItem>
            ))}
          </List>

          <Divider sx={{ my: 1.5 }} />

          <List disablePadding>
            <ListItem disablePadding>
              <ListItemButton sx={{ px: 1.2, borderRadius: 1 }} onClick={onOpenSettings}>
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12),
                    border: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.24)}`,
                    mr: 1.5,
                  }}
                />
                <ListItemText
                  primary="Пользователь"
                  secondary="Настройки"
                  primaryTypographyProps={{ fontWeight: 700 }}
                  secondaryTypographyProps={{ variant: 'body2' }}
                />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      )}
    </Drawer>
  );
}
