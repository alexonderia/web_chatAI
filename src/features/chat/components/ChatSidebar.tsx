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

import logo from '@/assets/logo.svg';
import { ChatSummary } from '@/app/api/chat';

type ChatSidebarProps = {
  open: boolean;
  drawerWidth: number;
  collapsedWidth: number;
  chats: ChatSummary[];
  selectedChat: string | null;
  onSelectChat: (id: string) => void;
  onToggle: () => void;
  onOpenSettings: () => void;
  onCreateChat: () => void;
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
}: ChatSidebarProps) {
  const [logoHovered, setLogoHovered] = useState(false);

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
            >
              Очистить всё
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
                  <ListItemText primary={chat.title} primaryTypographyProps={{ fontWeight: 600 }} />
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
