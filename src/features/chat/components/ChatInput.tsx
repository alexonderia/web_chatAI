import { useState } from 'react';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SendIcon from '@mui/icons-material/Send';
import { alpha } from '@mui/material/styles';

interface ChatInputProps {
  onSend?: (payload: { text: string; images: string[] }) => void;
  maxWidth?: number;
  disabled?: boolean;
}

export function ChatInput({ onSend, maxWidth = 880, disabled = false }: ChatInputProps) {
  const [text, setText] = useState('');
  const [images, setImages] = useState<string[]>([]);

  const handleSend = () => {
    if (!onSend) return;
    const payload = text.trim();
    if (!payload && images.length === 0) return;
    const preparedImages = images.map((img) => (img.includes(',') ? img.split(',')[1] ?? '' : img)).filter(Boolean);
    onSend({ text: payload, images: preparedImages });
    setText('');
    setImages([]);
  };

  const handleFilesSelected = (fileList: FileList | null) => {
    if (!fileList?.length) return;

    const files = Array.from(fileList);
    Promise.all(
      files.map(
        (file) =>
          new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(String(reader.result));
            reader.onerror = () => reject(new Error('Не удалось прочитать файл'));
            reader.readAsDataURL(file);
          }),
      ),
    )
      .then((base64List) => {
        setImages((prev) => [...prev, ...base64List]);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== index));
  };

  return (
    <>
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
          border: `1px solid ${theme.palette.mode === 'light'
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
          <IconButton
            aria-label="attach-file"
            color="primary"
            component="label"
            disabled={disabled}
          >
            <AttachFileIcon />
            <input
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={(event) => handleFilesSelected(event.target.files)}
            />
          </IconButton>
          <InputBase
            placeholder="Введите ваш вопрос..."
            fullWidth
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            inputProps={{ 'aria-label': 'Введите ваш вопрос' }}
            disabled={disabled}
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
        <IconButton aria-label="send" color="primary" onClick={handleSend} disabled={disabled}>
          <SendIcon />
        </IconButton>
      </Paper>

      {images.length > 0 && (
        <Stack
          direction="row"
          spacing={1}
          flexWrap="wrap"
          sx={{
            width: '100%',
            maxWidth,
            mt: 1.5,
            px: { xs: 1.5, sm: 2 },
          }}
        >
          {images.map((src, index) => (
            <Paper
              key={`${src}-${index}`}
              variant="outlined"
              sx={{
                position: 'relative',
                width: 120,
                height: 120,
                overflow: 'hidden',
                borderRadius: 2,
              }}
            >
              <Box
                component="img"
                src={src}
                alt={`attachment-${index}`}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
              <IconButton
                size="small"
                aria-label="Удалить изображение"
                onClick={() => handleRemoveImage(index)}
                sx={{
                  position: 'absolute',
                  top: 4,
                  right: 4,
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  color: '#fff',
                  '&:hover': { backgroundColor: 'rgba(0,0,0,0.6)' },
                }}
              >
                ×
              </IconButton>
            </Paper>
          ))}
        </Stack>
      )}
    </>
  );
}