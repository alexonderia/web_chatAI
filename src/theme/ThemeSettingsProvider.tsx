import {
  createContext,
  useContext,
  useMemo,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { createAppTheme, ThemeMode, FontSizePreset } from './theme';

type ThemeSettingsContextValue = {
  mode: ThemeMode;
  fontSize: FontSizePreset;
  setMode: (mode: ThemeMode) => void;
  setFontSize: (size: FontSizePreset) => void;
};

const ThemeSettingsContext = createContext<ThemeSettingsContextValue | undefined>(
  undefined,
);

// eslint-disable-next-line react-refresh/only-export-components
export function useThemeSettings() {
  const ctx = useContext(ThemeSettingsContext);
  if (!ctx) {
    throw new Error('useThemeSettings must be used within ThemeSettingsProvider');
  }
  return ctx;
}

interface Props {
  children: ReactNode;
}

const STORAGE_KEY = 'web-chatai-theme-settings';

export function ThemeSettingsProvider({ children }: Props) {
  const [mode, setMode] = useState<ThemeMode>('light');
  const [fontSize, setFontSize] = useState<FontSizePreset>('medium');

  // загрузка из localStorage
  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as { mode?: ThemeMode; fontSize?: FontSizePreset };
      if (parsed.mode) setMode(parsed.mode);
      if (parsed.fontSize) setFontSize(parsed.fontSize);
    } catch {
      // ignore
    }
  }, []);

  // сохранение
  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ mode, fontSize }),
    );
  }, [mode, fontSize]);

  const theme = useMemo(
    () => createAppTheme({ mode, fontSize }),
    [mode, fontSize],
  );

  const value = useMemo(
    () => ({
      mode,
      fontSize,
      setMode,
      setFontSize,
    }),
    [mode, fontSize],
  );

  return (
    <ThemeSettingsContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeSettingsContext.Provider>
  );
}
