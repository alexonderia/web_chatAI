import { useMemo } from 'react';
import Dialog from '@mui/material/Dialog';
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
    () => (mode === 'login' ? 'Регистрация' : 'Вход'),
    [mode],
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      BackdropProps={{
        sx: {
          backdropFilter: "blur(4px)",  
          backgroundColor: "rgba(0,0,0,0.2)", 
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
          <Box
            component="img"
            src={logo}
            alt="Web ChatAI"
            sx={{ width: 136, height: 136, borderRadius: 2, bgcolor: 'white'}}
          />
          <Typography variant="h5" component="div" fontWeight={500} color="text.primary">
            {title}
          </Typography>
        </Stack>
      </DialogTitle>
      <Box 
        sx={{
            width: '100%',
            flexGrow: 1, // занимает всё оставшееся место
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
          }}>
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
      </Box>
    </Dialog>
  );
}

export default AuthDialog;