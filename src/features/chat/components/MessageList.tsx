import type { ChatMessage } from '../types';

interface Props {
  messages: ChatMessage[];
  isSending: boolean;
}

const roleLabel: Record<ChatMessage['role'], string> = {
  user: 'Пользователь',
  assistant: 'Ассистент',
  system: 'Системный промпт',
};

const MessageList = ({ messages, isSending }: Props) => {
  return (
    <div className="message-list scroll-area" aria-live="polite">
      {messages.length === 0 && <p className="muted">История пуста. Отправьте первое сообщение.</p>}
      {messages.map((message) => (
        <article key={message.id} className={`message message-${message.role}`}>
          <div className="message-meta">
            <span className="badge">{roleLabel[message.role]}</span>
            <span className="timestamp">{new Date(message.createdAt).toLocaleTimeString()}</span>
          </div>
          <p className="message-content">{message.content}</p>
        </article>
      ))}
      {isSending && <p className="muted">Сервер думает...</p>}
    </div>
  );
};

export default MessageList;