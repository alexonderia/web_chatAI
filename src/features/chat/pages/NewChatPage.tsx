import { useMemo, useState, MouseEvent } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Popover from '@mui/material/Popover';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Slider from '@mui/material/Slider';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MenuIcon from '@mui/icons-material/Menu';
import AddIcon from '@mui/icons-material/Add';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import AttachmentIcon from '@mui/icons-material/Attachment';
import CheckIcon from '@mui/icons-material/Check';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import Tooltip from '@mui/material/Tooltip';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { alpha } from '@mui/material/styles';
import logo from '@/assets/logo.svg';

import { UserSettingsDialog } from '../../settings/UserSettingsDialog'; // путь подправь под свою структуру


const drawerWidth = 320;
const collapsedWidth = 84;

type ModelId = 'model-1' | 'model-2' | 'model-3';

interface ModelSettingsPopoverProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  model: ModelId;
  onModelChange: (model: ModelId) => void;
  onOpenAdvanced: (anchor: HTMLElement) => void;
  advancedOpen: boolean;
}

function ModelSettingsPopover({
  anchorEl,
  open,
  onClose,
  model,
  onModelChange,
  onOpenAdvanced,
  advancedOpen,
}: ModelSettingsPopoverProps) {
  const handleSelectModel = (id: ModelId) => {
    onModelChange(id);
    onClose();
  };

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      PaperProps={{
        sx: {
          p: 0,
          boxShadow: 'none',
          backgroundColor: 'transparent',
          overflow: 'visible',
        },
      }}
    >
      <Card
        variant="outlined"
        sx={(theme) => ({
          minWidth: 260,
          borderRadius: 1.2,
          borderColor: alpha(theme.palette.grey[400], 0.8),
          backgroundColor: theme.palette.background.paper,
          boxShadow: '0 18px 60px rgba(0, 46, 106, 0.18)',
        })}
      >
        <CardContent>
          <Stack spacing={2}>
            {/* Список моделей без hover-эффектов */}
            <Stack spacing={0.5}>
              {[
                { id: 'model-1' as ModelId, label: 'Текущая модель' },
                { id: 'model-2' as ModelId, label: 'Модель 2' },
                { id: 'model-3' as ModelId, label: 'Модель 3' },
              ].map(({ id, label }) => {
                const selected = model === id;
                return (
                  <Button
                    key={id}
                    fullWidth
                    variant="text"
                    onClick={() => handleSelectModel(id)}
                    sx={{
                      justifyContent: 'space-between',
                      borderRadius: 999,
                      px: 1.5,
                      py: 0.75,
                      textTransform: 'none',
                      fontWeight: 500,
                      color: selected ? 'text.secondary' : 'text.primary',
                      '&:hover': {
                        backgroundColor: 'transparent', 
                      },
                    }}
                  >
                    {label}
                    {selected && <CheckIcon fontSize="small" />}
                  </Button>
                );
              })}
            </Stack>

            <Divider />

            {/* Дополнительные настройки: > / < и открытие второго поповера */}
            <Button
              variant="text"
              color="inherit"
              onClick={(e) => onOpenAdvanced(e.currentTarget)}
              sx={(theme) => ({
                justifyContent: 'space-between',
                textTransform: 'none',
                color: 'text.primary',

                alignSelf: 'stretch',
                borderRadius: 1,
                px: 1.2,
                py: 0.75,
                minHeight: 40,

                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.04),
                },
              })}
            >
              Дополнительные настройки
              {advancedOpen ? (
                <ChevronLeftIcon fontSize="small" />
              ) : (
                <ChevronRightIcon fontSize="small" />
              )}
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Popover>
  );
}

interface AdvancedSettingsPopoverProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
}

function AdvancedSettingsPopover({
  anchorEl,
  open,
  onClose,
}: AdvancedSettingsPopoverProps) {
  const [temperature, setTemperature] = useState(1);
  const [maxTokens, setMaxTokens] = useState(512);

  const temperatureMarks = [
    { value: 0, label: '0' },
    { value: 2, label: '2' },
  ];

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      PaperProps={{
        sx: {
          p: 0,
          boxShadow: 'none',
          backgroundColor: 'transparent',
          overflow: 'visible',
        },
      }}
    >
      <Card
        variant="outlined"
        sx={(theme) => ({
          minWidth: 260,
          maxWidth: 280,
          borderRadius: 1.2,
          borderColor: alpha(theme.palette.grey[400], 0.8),
          backgroundColor: theme.palette.background.paper,
          boxShadow: '0 18px 60px rgba(0, 46, 106, 0.18)',
        })}
      >
        <CardContent>
          <Stack spacing={2}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="subtitle1" fontWeight={700} color="text.primary">
                Температура
              </Typography>
              <Tooltip
                title={
                  <>
                    <Typography fontWeight={600}>Что такое температура?</Typography>
                    <Typography variant="body2">
                      Это параметр, который управляет степенью случайности при генерации текста.<br />
                      0 — последовательные и предсказуемые ответы.<br />
                      2 — креативные и непредсказуемые ответы.
                    </Typography>
                  </>
                }
                enterTouchDelay={0}
                arrow
              >
                <InfoOutlinedIcon
                  fontSize="small"
                  sx={{ color: 'text.secondary', cursor: 'pointer' }}
                />
              </Tooltip>
            </Stack>

            <Slider
              min={0}
              max={2}
              step={0.1}
              value={temperature}
              marks={temperatureMarks}
              valueLabelDisplay="auto"
              onChange={(_, value) => setTemperature(value as number)}
            />

            <Stack spacing={1}>
              <Typography variant="subtitle2" fontWeight={600} color="text.primary">
                Максимальная длина ответа
              </Typography>
              <InputBase
                value={maxTokens}
                onChange={(e) => setMaxTokens(Number(e.target.value) || 0)}
                sx={{
                  px: 1.5,
                  py: 1,
                  borderRadius: 999,
                  border: (theme) =>
                    `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                  fontSize: 14,
                  backgroundColor: 'white',
                  color: 'text.primary',
                }}
              />
            </Stack>

            <Stack direction="row" spacing={1.5} justifyContent="flex-end" pt={1}>
              <Button
                variant="text"
                size="small"
                sx={{ textTransform: 'none', color: 'text.primary' }}
                onClick={() => {
                  setTemperature(1);
                  setMaxTokens(512);
                }}
              >
                Сбросить
              </Button>
              <Button variant="contained" size="small">
                Сохранить
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Popover>
  );
}


/**
 * Главная страница нового диалога (второй макет).
 */
function NewChatPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [logoHovered, setLogoHovered] = useState(false);
  const [selectedChat, setSelectedChat] = useState<number | null>(0);

  const [modelSettingsAnchor, setModelSettingsAnchor] =
    useState<HTMLElement | null>(null);
  const [advancedSettingsAnchor, setAdvancedSettingsAnchor] =
    useState<HTMLElement | null>(null);

  const advancedOpen = Boolean(advancedSettingsAnchor);
  const [currentModel, setCurrentModel] = useState<ModelId>('model-1');

  const sidebarWidth = useMemo(
    () => (sidebarOpen ? drawerWidth : collapsedWidth),
    [sidebarOpen],
  );

  const [settingsOpen, setSettingsOpen] = useState(false);

  const handleOpenSettings = () => setSettingsOpen(true);
  const handleCloseSettings = () => setSettingsOpen(false);

  const handleToggleSidebar = () => setSidebarOpen((prev) => !prev);

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

  const handleCloseAdvancedSettings = () => {
    setAdvancedSettingsAnchor(null);
  };

  const modelButtonLabel = 'Текущая модель';

  return (
    <Box
      sx={(theme) => ({
        position: 'relative',
        minHeight: '100vh',
        bgcolor: theme.palette.background.default,
      })} 
    >
      <Drawer
        variant="permanent"
        anchor="left"
        sx={(theme) => ({
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
            borderRadius: 0,
            bgcolor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            display: 'flex',
            flexDirection: 'column',
            transition: (theme) => theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
          },
        })}
      >
        <Toolbar
          sx={{
            px: sidebarOpen ? 3 : 2,
            justifyContent: sidebarOpen ? 'space-between' : 'center',
          }}
        >
          {sidebarOpen ? (
            <>
              <img src={logo} alt="Web ChatAI" width={36} height={36} />
              <IconButton
                aria-label="Свернуть панель"
                onClick={handleToggleSidebar}
              >
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
              <Box
                sx={{
                  opacity: logoHovered ? 0 : 1,
                  transition: 'opacity 150ms ease',
                }}
              >
                <img src={logo} alt="Web ChatAI" width={36} height={36} />
              </Box>
              <IconButton
                aria-label="Открыть боковую панель"
                onClick={handleToggleSidebar}
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

        {sidebarOpen && (
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              px: 2,
              pb: 3,
            }}
          >
            {/* Новый чат — как элемент списка, без рамки */}
            <List disablePadding sx={{ mb: 2 }}>
              <ListItem disablePadding>
                <ListItemButton sx={{ px: 1.2, borderRadius: 1, }}>
                  <AddIcon fontSize="small" sx={{ mr: 1 }} />
                  <ListItemText
                    primary="Новый чат"
                    primaryTypographyProps={{ fontWeight: 600 }} />
                </ListItemButton>
              </ListItem>
            </List>

            {/* Заголовок "Ваши чаты" + Очистить всё */}
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 1, px: 0 }}
            >
              <Typography
                variant="subtitle1"
                fontWeight={700}
                color="text.primary"
                sx={{ px: 1.2 }}
              >
                Ваши чаты
              </Typography>
              <Button
                color="secondary"
                size="small"
                sx={{ textTransform: 'none', fontWeight: 600, minWidth: 'auto' }}
              >
                Очистить всё
              </Button>
            </Stack>

            {/* Разделительная полоса между заголовком и чатами */}
            <Divider sx={{ mb: 1.5 }} />

            {/* Список чатов — текст выровнен как "Ваши чаты" */}
            <List sx={{ flexGrow: 1 }} disablePadding>
              {['Название чата', 'Название чата', 'Название чата'].map(
                (text, index) => (
                  <ListItem key={index} disablePadding>
                    <ListItemButton
                      selected={selectedChat === index}
                      onClick={() => setSelectedChat(index)}
                      sx={(theme) => ({
                        // отступ от левого/правого края, чтобы был виден радиус
                        px: 1.2,
                        borderRadius: 1, // скруглённый прямоугольник


                        // hover
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.primary.main, 0.08),
                        },

                        // выбранный (кликнутый)
                        '&.Mui-selected': {
                          backgroundColor: alpha(theme.palette.primary.main, 0.16),
                          '&:hover': {
                            backgroundColor: alpha(theme.palette.primary.main, 0.22),
                          },
                        },
                      })}
                    >
                      <ListItemText
                        primary={text}
                        primaryTypographyProps={{ fontWeight: 600 }} />
                    </ListItemButton>
                  </ListItem>
                )
              )}
            </List>

            {/* Пользователь — такая же "кнопка-строка" без рамки */}
            <Divider sx={{ my: 1.5 }} />

            <List disablePadding>
              <ListItem disablePadding>
                <ListItemButton
                  sx={{ px: 1.2, borderRadius: 1, }}
                  onClick={handleOpenSettings}
                >
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                      mr: 1.5,
                    }} />
                  <ListItemText
                    primary="Пользователь"
                    primaryTypographyProps={{ fontWeight: 600 }} />
                </ListItemButton>
              </ListItem>
            </List>
          </Box>
        )}
      </Drawer>

      {/* Верхняя панель */}
      <AppBar
        position="fixed"
        color="transparent"
        elevation={0}
        sx={(theme) => ({
          bgcolor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
          width: { xs: '100%', sm: `calc(100% - ${sidebarWidth}px)` },
          ml: { xs: 0, sm: `${sidebarWidth}px` },
          borderRadius: 0,
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        })}
      >
        <Toolbar sx={{ justifyContent: 'space-between', borderRadius: 0, }}>
          <Button
            variant="text"
            color="inherit"
            endIcon={<ExpandMoreIcon />}
            onClick={handleOpenModelSettings}
            sx={{
              textTransform: 'none',
              fontWeight: 700,
              fontSize: 18,
            }}
          >
            {modelButtonLabel}
          </Button>

          <Button
            variant="text"
            color="primary"
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            Очистить чат
          </Button>
        </Toolbar>
      </AppBar>

      {/* Основное содержимое */}
      <Box
        component="main"
        sx={(theme) => ({
          flexGrow: 1,
          p: { xs: 3, md: 6 },
          mt: 10,
          ml: { xs: 0, sm: `${sidebarWidth}px` },
          transition: theme.transitions.create('margin-left', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        })}
      >
        <Stack
          spacing={4}
          alignItems="center"
          justifyContent="center"
          sx={{
            minHeight: { xs: '70vh', md: '75vh' },
            textAlign: 'center',
          }}
        >
          <Typography variant="h3" component="h1" fontWeight={600} color="text.primary">
            Чем помочь?
          </Typography>

          <Paper
            elevation={0}
            sx={(theme) => ({
              width: '100%',
              maxWidth: 780,
              px: { xs: 1.5, sm: 2 },
              py: 1.25,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              backgroundColor:
                theme.palette.mode === 'light'
                  ? alpha(theme.palette.background.paper, 0.95)
                  : alpha(theme.palette.background.paper, 0.98),
              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
              borderRadius: 6,
              boxShadow:
                theme.palette.mode === 'light'
                  ? '0 16px 50px rgba(0, 46, 106, 0.06)'
                  : '0 16px 40px rgba(0, 0, 0, 0.6)',
              '&:has(input:focus)': {
                border: `1.2px solid ${theme.palette.primary.main}`,
              },
            })}
          >
            <IconButton aria-label="attachment" color="primary">
              <AttachmentIcon />
            </IconButton>
            <InputBase
              placeholder="Введите ваш вопрос..."
              fullWidth
              inputProps={{ 'aria-label': 'Введите ваш вопрос' }}
              sx={{ fontSize: 18, color: 'text.primary' }}
            />
            <IconButton aria-label="search" color="primary">
              <SearchRoundedIcon />
            </IconButton>
          </Paper>
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

      <UserSettingsDialog
        open={settingsOpen}
        onClose={handleCloseSettings}
      />
    </Box>
  );
}

export default NewChatPage;
