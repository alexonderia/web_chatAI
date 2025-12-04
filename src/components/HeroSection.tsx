import { alpha, styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import AttachmentIcon from '@mui/icons-material/Attachment';

const PromptBar = styled(Paper)(({ theme }) => ({
  maxWidth: 640,
  width: '100%',
  padding: theme.spacing(1.5, 2),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  backgroundColor: alpha(theme.palette.common.white, 0.9),
  border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
  boxShadow: '0 16px 50px rgba(0, 74, 173, 0.06)',
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
          sx={{ fontSize: 18, color: 'text.primary' }}
        />
        <IconButton aria-label="search" color="primary">
          <SearchRoundedIcon />
        </IconButton>
      </PromptBar>
    </Stack>
  );
}

export default HeroSection;