import HomePage from '@/features/chat/pages/HomePage';
import ChatPage from '@/features/chat/pages/ChatPage';
import { SimpleRouterProvider, useSimpleRouter } from './router/SimpleRouter';

function AppRoutes() {
  const { pathname } = useSimpleRouter();

  if (pathname.startsWith('/client/newChat')) {
    return <ChatPage />;
  }

  const chatMatch = pathname.match(/^\/client\/chat\/(\d+)/);
  if (chatMatch) {
    const chatId = Number(chatMatch[1]);
    return <ChatPage chatIdFromRoute={chatId} />;
  }
  
  return <HomePage />;
}

function App() {
  return (
    <SimpleRouterProvider>
      <AppRoutes />
    </SimpleRouterProvider>
  );
}

export default App;