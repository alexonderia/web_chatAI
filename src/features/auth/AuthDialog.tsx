import { ChangeEvent, FormEvent, useMemo, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Alert from '@mui/material/Alert';
import logo from '@/assets/logo.svg';

interface AuthCredentials {
  login: string;
  password: string;
}

interface AuthDialogProps {
  open: boolean;
  mode: 'login' | 'register';
  onClose: () => void;
  onAction?: () => void;
  onModeChange: (mode: 'login' | 'register') => void;
  onAuthenticate: (credentials: AuthCredentials, mode: 'login' | 'register') => Promise<void>;
}

function AuthDialog({ open, mode, onClose, onModeChange, onAuthenticate }: AuthDialogProps) {
  const [credentials, setCredentials] = useState<AuthCredentials>({ login: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const title = useMemo(() => (mode === 'login' ? 'Авторизация' : 'Регистрация'), [mode]);

  const primaryAction = useMemo(() => (mode === 'login' ? 'Вход' : 'Регистрация'), [mode]);

  const secondaryAction = useMemo(() => (mode === 'login' ? 'Регистрация' : 'Вход'), [mode]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await onAuthenticate(credentials, mode);
      setCredentials({ login: '', password: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось выполнить запрос');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (field: keyof AuthCredentials) => (event: ChangeEvent<HTMLInputElement>) => {
    setCredentials((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleModeSwitch = () => onModeChange(mode === 'login' ? 'register' : 'login');

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      BackdropProps={{
        sx: {
          backdropFilter: 'blur(4px)',
          backgroundColor: 'rgba(0,0,0,0.2)',
        },
      }}
      PaperProps={{
        sx: {
          minHeight: 600,         
          borderRadius: 2,
          px: 4,
          py: 4,
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <DialogTitle 
        sx={{
          my: 4,
        }}>
        <Stack spacing={1} alignItems="center">
          <Box component="img" src={logo} alt="Web ChatAI" sx={{ width: 136, height: 136 }} />
          <Typography variant="h5" component="div" fontWeight={500} color="text.primary">
            {title}
          </Typography>
        </Stack>
      </DialogTitle>
      <Box
        component="form"
        onSubmit={handleSubmit} 
        sx={{
            width: '100%',
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
          }}>
        <Stack spacing={2.5} alignItems="stretch">
          <Stack spacing={1.5}>
            <TextField
              label="Логин"
              variant="outlined"
              fullWidth
              autoFocus
              required
              value={credentials.login}
              onChange={handleChange('login')}
            />
            <TextField
              label="Пароль"
              type="password"
              variant="outlined"
              fullWidth
              required
              value={credentials.password}
              onChange={handleChange('password')}
            />
          </Stack>

          {error && <Alert severity="error">{error}</Alert>}

          <Divider flexItem sx={{ my: 1 }} />

          <Stack spacing={1.25}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              disabled={submitting}
            >
              {primaryAction}
            </Button>
            <Button
              variant="outlined"
              color="primary"
              size="large"
              disabled={submitting}
              onClick={handleModeSwitch}
            >
              {secondaryAction}
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Dialog>
  );
}

export default AuthDialog;