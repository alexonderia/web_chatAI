import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { ChatInput } from './ChatInput';

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
      
      <ChatInput maxWidth={720} />
    </Stack>
  );
}

export default HeroSection;