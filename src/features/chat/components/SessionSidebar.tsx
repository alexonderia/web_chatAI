import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { useChatSession } from '../hooks/ChatSessionProvider';
import { fetchSessionHistory } from '../api/chatApi';
import type { ChatMessage } from '../types';

const SessionSidebar = () => {
  const { sessionId, messages } = useChatSession();

  const { data: history } = useQuery({
    enabled: Boolean(sessionId),
    queryKey: ['history', sessionId],
    queryFn: async () => {
      if (!sessionId) return [];
      const result = await fetchSessionHistory(sessionId);
      return result.messages;
    },
  });

  const timeline: ChatMessage[] = history?.length ? history : messages;

  return (
    <aside className="sidebar card">
      <header className="sidebar-header">
        <div>
          <p className="label">Текущая сессия</p>
          <p className="muted">ID: {sessionId ?? 'ещё не создана'}</p>
        </div>
      </header>

      <div className="scroll-area sidebar-history">
        {timeline.length === 0 ? (
          <p className="muted">История появится после первого запроса.</p>
        ) : (
          <ul className="history-list">
            {timeline.map((item) => (
              <li key={item.id} className={clsx('history-item', `role-${item.role}`)}>
                <span className="badge">{item.role}</span>
                <p className="history-content">{item.content}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
};

export default SessionSidebar;