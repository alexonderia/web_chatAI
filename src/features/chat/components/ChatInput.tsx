import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import Stack from '@mui/material/Stack';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SendIcon from '@mui/icons-material/Send';
import { alpha  } from '@mui/material/styles';

interface ChatInputProps {
  onSend?: () => void;
  maxWidth?: number;
}
export function ChatInput({ onSend, maxWidth = 880}: ChatInputProps) {
  return (
    <Paper
      elevation={0}
      sx={(theme) => ({
        width: '100%',
        maxWidth,
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

        '&:has(input:focus)': {
            borderColor:
            theme.palette.mode === 'light'
                ? theme.palette.primary.main
                : '#ffffff',
        },
      })}
    >
      <Stack direction="row" alignItems="center" spacing={1} flex={1}>
        <IconButton aria-label="attach-file" color="primary">
          <AttachFileIcon />
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
      <IconButton aria-label="send" color="primary" onClick={onSend}>
        <SendIcon />
      </IconButton>
    </Paper>
  );
}