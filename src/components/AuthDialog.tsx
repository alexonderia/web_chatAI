import { useMemo } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import logo from '@/assets/logo.jpeg';

interface AuthDialogProps {
  open: boolean;
  mode: 'login' | 'register';
  onClose: () => void;
}

function AuthDialog({ open, mode, onClose }: AuthDialogProps) {
  const title = useMemo(
    () => (mode === 'login' ? 'Авторизация' : 'Регистрация'),
    [mode],
  );

  const primaryAction = useMemo(
    () => (mode === 'login' ? 'Вход' : 'Регистрация'),
    [mode],
  );

  const secondaryAction = useMemo(
    () => (mode === 'login' ? 'Регистрация' : 'Войти'),
    [mode],
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{ sx: { borderRadius: 4, p: 1.5 } }}
    >
      <DialogTitle sx={{ textAlign: 'center' }}>
        <Stack spacing={2} alignItems="center">
          <Box
            component="img"
            src={logo}
            alt="Web ChatAI"
            sx={{ width: 72, height: 72, borderRadius: 2, bgcolor: 'grey.100', p: 1 }}
          />
          <Typography variant="h5" component="div" color="text.primary">
            {title}
          </Typography>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2.5} alignItems="stretch">
          <Stack spacing={1.5}>
            <TextField label="Логин" variant="outlined" fullWidth autoFocus />
            <TextField label="Пароль" type="password" variant="outlined" fullWidth />
          </Stack>

          <Divider flexItem sx={{ my: 1 }} />

          <Stack spacing={1.25}>
            <Button variant="contained" color="primary" size="large">
              {primaryAction}
            </Button>
            <Button variant="outlined" color="primary" size="large">
              {secondaryAction}
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

export default AuthDialog;