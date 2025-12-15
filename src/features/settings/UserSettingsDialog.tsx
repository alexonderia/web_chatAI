import { useEffect, useMemo, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';

import { useThemeSettings } from '@/theme/ThemeSettingsProvider';
import { useAuth } from '@/features/auth/AuthProvider';
import { useModels } from '@/features/ai/ModelProvider';
import { useSettings } from '@/features/settings/SettingsProvider';
import { SaveUserSettingsRequest, settingsApi } from '@/app/api/settings';

interface UserSettingsDialogProps {
  open: boolean;
  onClose: () => void;
}

type ConnectionState =
  | { type: 'idle'; message: '' }
  | { type: 'success'; message: string }
  | { type: 'error'; message: string };

export function UserSettingsDialog({ open, onClose }: UserSettingsDialogProps) {
  const { mode, fontSize, setMode, setFontSize } = useThemeSettings();
  const { user, logout, updateLogin, deleteAccount } = useAuth();
  const { models, selectedModel, selectModel, reloadModels } = useModels();
  const { settings, updateLocal, reload } = useSettings();

  const [editedLogin, setEditedLogin] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [savingLogin, setSavingLogin] = useState(false);

  const [serviceUrl, setServiceUrl] = useState('http://192.168.3.63:5167/');
  const [defaultModelValue, setDefaultModelValue] = useState('');
  const [connectionState, setConnectionState] = useState<ConnectionState>({
    type: 'idle',
    message: '',
  });
  const [checking, setChecking] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [accountError, setAccountError] = useState<string | null>(null);

  // Подтягиваем логин из пользователя
  useEffect(() => {
    setEditedLogin(user?.login ?? '');
    setLoginError(null);
  }, [user?.login, open]);

  // Подтягиваем настройки при открытии окна
  useEffect(() => {
    if (open) {
      void reload();
    }
  }, [open, reload]);

  // Подтягиваем url и модель из настроек
  useEffect(() => {
    if (!open) return;

    setServiceUrl(settings?.serviceUrl ?? 'http://192.168.3.63:5167/');

    const resolvedModel =
      settings?.defaultModel ?? settings?.model ?? selectedModel ?? models[0]?.name ?? '';
    setDefaultModelValue(resolvedModel);

    setConnectionState({ type: 'idle', message: '' });
    setAccountError(null);
  }, [ open, settings?.defaultModel, settings?.model, settings?.serviceUrl]);

  // Текст статуса подключения
  const connectionText = useMemo(() => {
    if (connectionState.type === 'success') return connectionState.message;
    if (connectionState.type === 'error') return connectionState.message;
    if (!serviceUrl) return 'URL сервиса не задан.';
    return 'Нажмите «Проверить», чтобы проверить подключение.';
  }, [connectionState, serviceUrl]);

  // Выйти из профиля
  const handleLogout = async () => {
    await logout();
    onClose();
  };

  // Сохранить новый логин
  const handleSaveLogin = async () => {
    if (!user) return;
    const trimmed = editedLogin.trim();
    if (!trimmed) {
      setLoginError('Логин не может быть пустым');
      return;
    }

    setSavingLogin(true);
    setLoginError(null);
    try {
      await updateLogin(trimmed);
    } catch (e) {
      const msg = (e as Error).message || 'Не удалось сохранить логин';
      setLoginError(msg);
    } finally {
      setSavingLogin(false);
    }
  };

  const persistSettings = async (modelName: string | null) => {
    if (!user) return;

    if (!modelName) {
      throw new Error('Модель по умолчанию не выбрана');
    }

    updateLocal({
      serviceUrl,
      model: modelName,
      defaultModel: modelName,
    });

    const payload: SaveUserSettingsRequest = {
      id: settings?.id ?? 0,
      stream: settings?.stream ?? true,
      temperature: settings?.temperature ?? 0,
      maxTokens: settings?.maxTokens ?? 0,
      themeMode: settings?.themeMode,
      serviceUrl,
      model: modelName,
      defaultModel: modelName,
      userId: user.id,
    };

    await settingsApi.saveUserSettings(payload);
  };

  const runConnectionCheck = async (withSave: boolean) => {
    if (!serviceUrl) return;

    setChecking(true);
    setConnectionState({ type: 'idle', message: '' });

    try {
      if (withSave) {
        const preferredModel =
          defaultModelValue ||
          selectedModel ||
          settings?.defaultModel ||
          models[0]?.name ||
          null;

        if (!preferredModel) {
          throw new Error('Не удалось определить модель по умолчанию');
        }

        await persistSettings(preferredModel);
      }

      const refreshedModels = await reloadModels();
      const success = refreshedModels.length > 0;
      const statusMessage = success
        ? `Подключение установлено. Доступные модели: ${refreshedModels.length}`
        : 'Подключение установлено, но список моделей пуст.';

      setConnectionState({
        type: success ? 'success' : 'error',
        message: statusMessage,
      });
    } catch (e) {
      setConnectionState({
        type: 'error',
        message: (e as Error).message || 'Ошибка подключения к сервису ИИ',
      });
    } finally {
      setChecking(false);
    }
  };

  // авто-проверка при открытии, если url уже есть
  useEffect(() => {
    if (!open) return;
    if (!serviceUrl) return;
    if (connectionState.type !== 'idle') return;

    void runConnectionCheck(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, serviceUrl]);

  const handleCheckConnection = () => {
    void runConnectionCheck(true);
  };

  // Сброс настроек к значениям по умолчанию
  const handleResetSettings = async () => {
    setResetting(true);
    setConnectionState({ type: 'idle', message: '' });

    try {
      // перезагружаем настройки пользователя с сервера
      await reload();
      // перезагружаем модели (на случай смены URL)
      const refreshedModels = await reloadModels();
      const firstModel = refreshedModels[0]?.name;

      if (!firstModel) {
        throw new Error('Список моделей пуст — невозможно сбросить настройки');
      }

      await persistSettings(firstModel);
      selectModel(firstModel);
      setDefaultModelValue(firstModel);
    } catch (e) {
      setConnectionState({
        type: 'error',
        message: (e as Error).message || 'Не удалось сбросить настройки',
      });
    } finally {
      setResetting(false);
    }
  };

  const handleDefaultModelChange = async (value: string) => {
    setDefaultModelValue(value);
    selectModel(value);
    try {
      await persistSettings(value);
    } catch (e) {
      setConnectionState({
        type: 'error',
        message: (e as Error).message || 'Не удалось сохранить модель по умолчанию',
      });
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    if (!window.confirm('Удалить аккаунт без возможности восстановления?')) return;

    setDeletingAccount(true);
    setAccountError(null);
    try {
      await deleteAccount();
      onClose();
    } catch (e) {
      setAccountError((e as Error).message || 'Не удалось удалить аккаунт');
    } finally {
      setDeletingAccount(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      BackdropProps={{
        sx: (theme) => ({
          backdropFilter: "blur(4px)",  
          backgroundColor:
            theme.palette.mode === 'light'
              ? 'rgba(0,0,0,0.12)'
              : 'rgba(0,0,0,0.6)',
        }),
      }}
      PaperProps={{
        elevation: 0,
        sx: (theme) => ({          
          borderRadius: 2,
          px: 4,
          py: 4,
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          overflowY: 'auto',
          '&::-webkit-scrollbar': {
            width: 0,
            height: 0,
          },
          scrollbarWidth: 'none',
        }),
      }}
    >
      <Stack spacing={3}>
        {/* Пользователь */}
        <Stack spacing={2}>
          <Typography variant="h5" fontWeight={700}>
            Пользователь
          </Typography>

          <TextField
            fullWidth
            size="small"
            label="Логин"
            value={editedLogin}
            onChange={(e) => {
              setEditedLogin(e.target.value);
              setLoginError(null);
            }}
            error={!!loginError}
            helperText={loginError ?? 'Логин должен быть уникальным'}
            
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 999,
              },
            }}
          />

          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              fullWidth
              color="inherit"
              onClick={handleLogout}
            >
              Выйти из профиля
            </Button>
            <Button
              variant="contained"
              fullWidth
              onClick={handleSaveLogin}
              disabled={savingLogin}
            >
              {savingLogin ? <CircularProgress size={18} /> : 'Сохранить'}
            </Button>
          </Stack>
          <Button
            variant="outlined"
            color="error"
            onClick={handleDeleteAccount}
            disabled={deletingAccount}
          >
            {deletingAccount ? <CircularProgress size={18} /> : 'Удалить аккаунт'}
          </Button>
          {accountError && <Alert severity="error">{accountError}</Alert>}
        </Stack>

        {/* Внешний вид */}
        <Stack spacing={2}>
          <Typography variant="h5" fontWeight={700}>
            Внешний вид
          </Typography>

          <Stack direction="row" spacing={2} alignItems="center">
            <Typography flex={1}>Тема интерфейса</Typography>
            <TextField
              select
              size="small"
              value={mode}
              onChange={(e) => setMode(e.target.value as typeof mode)}
              sx={{ minWidth: 160 }}
            >
              <MenuItem value="light">Светлая</MenuItem>
              <MenuItem value="dark">Тёмная</MenuItem>
            </TextField>
          </Stack>

          <Stack direction="row" spacing={2} alignItems="center">
            <Typography flex={1}>Размер шрифта</Typography>
            <TextField
              select
              size="small"
              value={fontSize}
              onChange={(e) =>
                setFontSize(e.target.value as typeof fontSize)}
              sx={{ minWidth: 160 }}
            >
              <MenuItem value="small">Маленький</MenuItem>
              <MenuItem value="medium">Средний</MenuItem>
              <MenuItem value="large">Крупный</MenuItem>
            </TextField>
          </Stack>
        </Stack>

        {/* Система */}
        <Stack spacing={2}>
          <Typography variant="h5" fontWeight={700}>
            Система
          </Typography>

          <TextField
            fullWidth
            size="small"
            label="URL сервиса"
            value={serviceUrl}
            onChange={(e) => setServiceUrl(e.target.value)}
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 999,
              },
            }}
          />

          <TextField
            fullWidth
            size="small"
            select
            placeholder="Выбранная модель"
            variant="outlined"
            value={defaultModelValue}
            disabled={models.length === 0}
            onChange={(e) => {
              const value = e.target.value;
              void handleDefaultModelChange(value);
            }}
            helperText="Эта модель будет использоваться по умолчанию в новых чатах"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 999,
              },
            }}
          >
            {models.map((m) => (
              <MenuItem key={m.name} value={m.name}>
                {m.displayName ?? m.name}
              </MenuItem>
            ))}
          </TextField>

          {connectionState.type !== 'idle' && (
            <Alert
              severity={connectionState.type === 'success' ? 'success' : 'error'}
            >
              {connectionText}
            </Alert>
          )}

          {connectionState.type === 'idle' && (
            <Typography variant="body2">{connectionText}</Typography>
          )}

          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              fullWidth
              onClick={handleResetSettings}
              disabled={resetting}
            >
              {resetting ? <CircularProgress size={18} /> : 'Сброс настроек'}
            </Button>
            <Button
              variant="contained"
              fullWidth
              onClick={handleCheckConnection}
              disabled={checking || !serviceUrl}
            >
              {checking ? <CircularProgress size={18} /> : 'Проверить'}
            </Button>
          </Stack>
        </Stack>

        <Divider />

        <Button
          variant="outlined"
          fullWidth
          sx={{ mt: 1 }}
          onClick={onClose}
        >
          Информация о <Typography component="span" fontWeight={700} ml={0.5}>Web ChatAI</Typography>
        </Button>
      </Stack>
    </Dialog>
  );
}
