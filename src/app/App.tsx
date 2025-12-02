import ChatPanel from '../features/chat/components/ChatPanel';
import SessionSidebar from '../features/chat/components/SessionSidebar';
import StatusBar from '../features/chat/components/StatusBar';
import { ChatSessionProvider } from '../features/chat/hooks/ChatSessionProvider';
import SettingsPanel from '../features/settings/SettingsPanel';
import './App.css';

const App = () => {
  return (
    <ChatSessionProvider>
      <div className="app-shell">
        <header className="app-header">
          <div>
            <p className="eyebrow">WebAPIChatAI • клиент</p>
            <h1>Диалог с моделями сервера</h1>
            <p className="lede">
              Интерфейс для работы с функциями API: отправка сообщений, выбор моделей, настройка температуры
              и системного промпта, мониторинг статуса сервера.
            </p>
          </div>
          <div className="header-actions">
            <a
              className="button ghost"
              href="https://github.com/Elena-Shalaumova/WebAPIChatAI"
              target="_blank"
              rel="noreferrer"
            >
              Репозиторий сервера
            </a>
          </div>
        </header>

        <SessionSidebar />

        <main className="main-content">
          <ChatPanel />
          <SettingsPanel />
        </main>

        <StatusBar />
      </div>
    </ChatSessionProvider>
  );
};

export default App;