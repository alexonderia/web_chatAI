import { useCallback } from 'react';

interface Props {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
  isSending?: boolean;
}

const MessageInput = ({ value, onChange, onSend, disabled, isSending }: Props) => {
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        onSend();
      }
    },
    [onSend],
  );

  return (
    <div className="composer">
      <label className="label" htmlFor="message-input">
        Сообщение
      </label>
      <textarea
        id="message-input"
        className="textarea"
        placeholder="Задайте вопрос модели... (Shift + Enter для новой строки)"
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={handleKeyDown}
      />
      <div className="composer-actions">
        <button className="button" onClick={onSend} disabled={disabled} type="button">
          {isSending ? 'Отправка...' : 'Отправить'}
        </button>
      </div>
    </div>
  );
};

export default MessageInput;