import { useEffect, useState } from 'react';
// import HomePage from './pages/HomePage';
import NewChatPage from '../features/chat/pages/NewChatPage';

function App() {
  const [pathname, setPathname] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => setPathname(window.location.pathname);

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  if (pathname.startsWith('/client/newChat')) {
    return <NewChatPage />;
  }
  return <NewChatPage />;
  // return <HomePage />;
}

export default App;