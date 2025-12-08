import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';

interface RouterContextValue {
  pathname: string;
  navigate: (to: string) => void;
}

const RouterContext = createContext<RouterContextValue | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export function useSimpleRouter() {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useSimpleRouter must be used within <SimpleRouterProvider>');
  }
  return context;
}

interface SimpleRouterProviderProps {
  children: ReactNode;
}

export function SimpleRouterProvider({ children }: SimpleRouterProviderProps) {
  const [pathname, setPathname] = useState(window.location.pathname || '/');

  useEffect(() => {
    const handlePopState = () => setPathname(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = useCallback((to: string) => {
    if (to === window.location.pathname) return;
    window.history.pushState({}, '', to);
    setPathname(to);
  }, []);

  const value = useMemo(
    () => ({ pathname, navigate }),
    [pathname, navigate],
  );

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}