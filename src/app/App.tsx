import HomePage from '@/features/chat/pages/HomePage';
import NewChatPage from '@/features/chat/pages/NewChatPage';
import { SimpleRouterProvider, useSimpleRouter } from './router/SimpleRouter';

function AppRoutes() {
  const { pathname } = useSimpleRouter();

  if (pathname.startsWith('/client/newChat')) {
    return <NewChatPage />;
  }

  const chatMatch = pathname.match(/^\/client\/chat\/(\d+)/);
  if (chatMatch) {
    const chatId = Number(chatMatch[1]);
    return <NewChatPage chatIdFromRoute={chatId} />;
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