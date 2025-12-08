import Dialog from '@mui/material/Dialog';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import { useThemeSettings } from '../../theme/ThemeSettingsProvider'; 


interface UserSettingsDialogProps {
  open: boolean;
  onClose: () => void;
}

export function UserSettingsDialog({ open, onClose }: UserSettingsDialogProps) {
  const { mode, fontSize, setMode, setFontSize } = useThemeSettings();
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
        sx: (theme) => ({
          borderRadius: 2,
          px: 4,
          py: 4,
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          boxShadow: theme.shadows[24],
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
            label="Имя"
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 999,
              },
            }}
          />

          <Stack direction="row" spacing={2}>
            <Button variant="outlined" fullWidth>
              Выйти из профиля
            </Button>
            <Button variant="contained" fullWidth>
              Сохранить
            </Button>
          </Stack>
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
              onChange={(e) => setMode(e.target.value as 'light' | 'dark')}
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
                setFontSize(e.target.value as 'small' | 'medium' | 'large')
              }
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
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 999,
              },
            }}
          >
            <MenuItem value="model-1">Модель 1</MenuItem>
            <MenuItem value="model-2">Модель 2</MenuItem>
            <MenuItem value="model-3">Модель 3</MenuItem>
          </TextField>

          <Stack spacing={0.5}>
            <Typography fontWeight={700} variant="body2">
              Подключение установлено.
            </Typography>
            <Typography variant="body2">
              Модель по умолчанию: &lt;&gt;
            </Typography>
          </Stack>

          <Stack direction="row" spacing={2}>
            <Button variant="outlined" fullWidth>
              Сброс настроек
            </Button>
            <Button variant="contained" fullWidth>
              Проверить
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
