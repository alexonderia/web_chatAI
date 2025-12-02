import { useMemo, useState } from 'react';
import { useChatSession } from '../hooks/ChatSessionProvider';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import ModelSelect from './ModelSelect';

const ChatPanel = () => {
  const {
    messages,
    sendMessage,
    isSending,
    model,
    models,
    setModel,
    canSend,
  } = useChatSession();
  const [draft, setDraft] = useState('');

  const sortedMessages = useMemo(
    () => [...messages].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()),
    [messages],
  );

  const handleSend = () => {
    if (!draft.trim()) return;
    sendMessage(draft.trim());
    setDraft('');
  };

  return (
    <section className="card" aria-label="Чат">
      <header className="chat-header">
        <div>
          <p className="label">Модель</p>
          <ModelSelect value={model} options={models} onChange={(value) => setModel(value)} />
        </div>
      </header>

      <MessageList messages={sortedMessages} isSending={isSending} />

      <MessageInput
        value={draft}
        onChange={setDraft}
        onSend={handleSend}
        disabled={!canSend}
        isSending={isSending}
      />
    </section>
  );
};

export default ChatPanel;