import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import ReplayIcon from '@mui/icons-material/Replay';
import { alpha } from '@mui/material/styles';

export type MessageRole = 'user' | 'assistant';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  author: string;
  content: string;
  messageType?: 'text' | 'image' | string;
  images?: string[];
  timestamp?: string;
}

interface ChatMessageCardProps {
  message: ChatMessage;
}

export function ChatMessageCard({ message }: ChatMessageCardProps) {
  const isAssistant = message.role === 'assistant';

  return (
    <Stack spacing={1} alignItems={isAssistant ? 'flex-start' : 'flex-end'}>
      <Typography variant="subtitle2" color="text.secondary" fontWeight={700} sx={{ px: 1 }}>
        {message.author}
      </Typography>
      <Paper
        elevation={0}
        sx={(theme) => {
          const isDark = theme.palette.mode === 'dark';

          return {
            maxWidth: 640,
            p: 2,
            bgcolor: isAssistant
              ? alpha(theme.palette.primary.light, isDark ? 0.25 : 0.18)
              : alpha(theme.palette.secondary.light, isDark ? 0.3 : 0.22),
            color: theme.palette.text.primary,
            borderRadius: '18px', 
            border: `1px solid ${alpha(
              isAssistant ? theme.palette.primary.main : theme.palette.secondary.main,
              0.25,
            )}`,
          };
        }}
      >
        <Stack spacing={2}>
          {message.content && (
            <Typography
              variant="body1"
              sx={{
                whiteSpace: 'pre-line',
                overflowWrap: 'anywhere',
                wordBreak: 'break-word',
              }}
            >
              {message.content}
            </Typography>
          )}

          {message.images?.length ? (
            <Stack direction="row" spacing={2} flexWrap="wrap">
              {message.images.map((src, idx) => (
                <Box
                  key={`${message.id}-image-${idx}`}
                  component="img"
                  src={src}
                  alt={message.author}
                  sx={{
                    maxWidth: 320,
                    maxHeight: 320,
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: (theme) => theme.palette.divider,
                    objectFit: 'contain',
                    backgroundColor: (theme) => theme.palette.background.paper,
                  }}
                />
              ))}
            </Stack>
          ) : null}
        </Stack>
      </Paper>
      {isAssistant && (
        <Stack direction="row" spacing={1} alignItems="center" sx={{ px: 0.5 }}>
          <Tooltip title="Скопировать">
            <IconButton size="small" aria-label="copy answer">
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Нравится">
            <IconButton size="small" aria-label="like answer">
              <ThumbUpOffAltIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Не нравится">
            <IconButton size="small" aria-label="dislike answer">
              <ThumbDownOffAltIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Сгенерировать ещё раз">
            <IconButton size="small" aria-label="regenerate answer">
              <ReplayIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      )}
    </Stack>
  );
}