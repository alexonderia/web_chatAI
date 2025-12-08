import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import Stack from '@mui/material/Stack';
import AttachmentIcon from '@mui/icons-material/Attachment';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { alpha } from '@mui/material/styles';

interface ChatInputProps {
  onSend?: () => void;
}

export function ChatInput({ onSend }: ChatInputProps) {
  return (
    <Paper
      elevation={0}
      sx={(theme) => ({
        width: '100%',
        maxWidth: 880,
        px: { xs: 1.5, sm: 2 },
        py: 1.25,
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        backgroundColor:
            theme.palette.mode === 'light'
            ? alpha(theme.palette.background.paper, 0.96)
            : alpha('#ffffff', 0.08),
        borderRadius: 999,
        border: `1px solid ${
            theme.palette.mode === 'light'
            ? alpha(theme.palette.primary.main, 0.2)
            : 'rgba(255, 255, 255, 0.28)'
        }`,
        boxShadow:
            theme.palette.mode === 'light'
            ? '0 16px 50px rgba(0, 46, 106, 0.08)'
            : '0 16px 40px rgba(0, 0, 0, 0.7)',
        '&:has(input:focus)': {
            borderColor:
            theme.palette.mode === 'light'
                ? theme.palette.primary.main
                : '#ffffff',
        },
      })}
    >
      <Stack direction="row" alignItems="center" spacing={1} flex={1}>
        <IconButton aria-label="attachment" color="primary">
          <AttachmentIcon />
        </IconButton>
        <InputBase
          placeholder="Введите ваш вопрос..."
          fullWidth
          inputProps={{ 'aria-label': 'Введите ваш вопрос' }}
          sx={(theme) => ({
                fontSize: 18,
                color: theme.palette.text.primary,
                '& .MuiInputBase-input::placeholder': {
                color:
                    theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.8)'
                    : theme.palette.text.secondary,
                opacity: 1,
                },
            })}
        />
      </Stack>
      <IconButton aria-label="search" color="primary" onClick={onSend}>
        <SearchRoundedIcon />
      </IconButton>
    </Paper>
  );
}