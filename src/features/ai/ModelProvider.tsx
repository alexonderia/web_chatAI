import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from 'react';
import { aiApi, AiModel } from '@/app/api/ai';
import { useAuth } from '@/features/auth/AuthProvider';
import { useSettings } from '@/features/settings/SettingsProvider';

type ModelContextValue = {
  models: AiModel[];
  loading: boolean;
  error: string | null;
  selectedModel: string | null;

  selectModel: (modelName: string) => void;
  reloadModels: () => Promise<void>;
};

const ModelContext = createContext<ModelContextValue | undefined>(undefined);

interface ModelProviderProps {
  children: ReactNode;
}

export function ModelProvider({ children }: ModelProviderProps) {
  const { user } = useAuth();
  const { settings } = useSettings();
  const [models, setModels] = useState<AiModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);

  const reloadModels = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await aiApi.getModels();
      setModels(data);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  // при первом монтировании грузим модели
  useEffect(() => {
    void reloadModels();
  }, [reloadModels]);

  // когда у пользователя есть своя модель по умолчанию
  useEffect(() => {
    if (user?.model) {
      setSelectedModel(user.model);
    }
  }, [user?.model]);

  // если в пользовательских настройках указана модель
  useEffect(() => {
    if (settings?.model) {
      setSelectedModel(settings.model);
    }
  }, [settings?.model]);
  
  // Если пользовательская модель не установлена — выбрать первую доступную
  useEffect(() => {
    if (!selectedModel && models.length > 0) {
      setSelectedModel(models[0].name);
    }
  }, [models, selectedModel]);

  const value = useMemo<ModelContextValue>(
    () => ({
      models,
      loading,
      error,
      selectedModel,
      selectModel: (name: string) => setSelectedModel(name),
      reloadModels,
    }),
    [models, loading, error, selectedModel, reloadModels],
  );

  return <ModelContext.Provider value={value}>{children}</ModelContext.Provider>;
}

// Хук для доступа к моделям
export function useModels() {
  const ctx = useContext(ModelContext);
  if (!ctx) {
    throw new Error('useModels must be used inside ModelProvider');
  }
  return ctx;
}