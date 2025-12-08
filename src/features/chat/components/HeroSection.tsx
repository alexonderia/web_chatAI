import { alpha, styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import AttachmentIcon from '@mui/icons-material/Attachment';

const PromptBar = styled(Paper)(({ theme }) => ({
  maxWidth: 720,
  width: '100%',
  padding: theme.spacing(1.5, 2),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  // такой же тёмный бар, как в чате
  backgroundColor:
    theme.palette.mode === 'light'
      ? alpha(theme.palette.background.paper, 0.96)
      : alpha(theme.palette.background.paper, 0.98),
  borderRadius: 999, // полностью «пилюля»
  border: `1px solid ${
    theme.palette.mode === 'light'
      ? alpha(theme.palette.primary.main, 0.18)
      : 'rgba(255, 255, 255, 0.18)'
  }`,
  boxShadow: 'none', // убираем тень
  '&:has(input:focus)': {
    borderColor:
      theme.palette.mode === 'light'
        ? theme.palette.primary.main
        : '#ffffff',
  },
}));

function HeroSection() {
  return (
    <Stack
      component="section"
      spacing={3}
      alignItems="center"
      justifyContent="center"
      sx={{
        minHeight: '70vh',
        textAlign: 'center',
        px: 2,
      }}
    >
      <Typography variant="h3" component="h1" color="text.primary">
        Чем помочь?
      </Typography>
      <PromptBar elevation={0}>
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
                  ? 'rgba(255, 255, 255, 0.9)' // как на первом скрине
                  : theme.palette.text.secondary,
              opacity: 1,
            },
          })}
        />
        <IconButton aria-label="search" color="primary">
          <SearchRoundedIcon />
        </IconButton>
      </PromptBar>
    </Stack>
  );
}

export default HeroSection;