import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { SaveUserSettingsRequest, settingsApi, UserSettingsDto } from '@/app/api/settings';
import { useAuth } from '@/features/auth/AuthProvider';

type SettingsContextValue = {
  settings: UserSettingsDto | null;
  loading: boolean;
  error: string | null;

  updateLocal: (patch: Partial<UserSettingsDto>) => void;
  save: () => Promise<void>;
  reload: () => Promise<void>;
};

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

interface SettingsProviderProps {
  children: ReactNode;
}

export function SettingsProvider({ children }: SettingsProviderProps) {
  const { user } = useAuth();
  const [settings, setSettings] = useState<UserSettingsDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);

  const reload = useCallback(async () => {
    if (!user) {
      setSettings(null);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await settingsApi.getUserSettings(user.id);

      setSettings({
        id: data.id ?? 0,
        stream: data.stream ?? true,
        ...data,
        model: data.model ?? data.defaultModel ?? null,
      });
      setDirty(false);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      setSettings(null);
      return;
    }
    void reload();
  }, [user, reload]);

  const updateLocal = useCallback((patch: Partial<UserSettingsDto>) => {
    setSettings((prev) => (prev ? { ...prev, ...patch } : prev));
    setDirty(true);
  }, []);

  const save = useCallback(async () => {
    if (!user || !settings || !dirty) return;

    setLoading(true);
    setError(null);
    try {
      const payload: SaveUserSettingsRequest = {
        id: settings.id ?? 0,
        stream: settings.stream ?? true,
        ...settings,
        userId: user.id,
      };

      await settingsApi.saveUserSettings(payload);
      setDirty(false);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [dirty, settings, user]);

  const value = useMemo<SettingsContextValue>(
    () => ({
      settings,
      loading,
      error,
      updateLocal,
      save,
      reload,
    }),
    [settings, loading, error, updateLocal, save, reload],
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}
// eslint-disable-next-line react-refresh/only-export-components
export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error('useSettings must be used inside SettingsProvider');
  }
  return ctx;
}
