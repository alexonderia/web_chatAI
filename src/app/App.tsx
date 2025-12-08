import HomePage from '@/features/chat/pages/HomePage';
import NewChatPage from '@/features/chat/pages/NewChatPage';
import { SimpleRouterProvider, useSimpleRouter } from './router/SimpleRouter';

function AppRoutes() {
  const { pathname } = useSimpleRouter();

  if (pathname.startsWith('/client/newChat')) {
    return <NewChatPage />;
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