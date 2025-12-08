import Stack from '@mui/material/Stack';
import { ChatMessage, ChatMessageCard } from './ChatMessageCard';

interface ChatThreadProps {
  messages: ChatMessage[];
}

export function ChatThread({ messages }: ChatThreadProps) {
  return (
    <Stack
      spacing={3}
      alignItems="stretch"
      justifyContent="flex-start"
      sx={{ width: '100%' }}
    >
      <Stack spacing={3}>
        {messages.map((message) => (
          <ChatMessageCard key={message.id} message={message} />
        ))}
      </Stack>
    </Stack>
  );
}
