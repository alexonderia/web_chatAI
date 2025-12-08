import { createTheme, Theme } from '@mui/material/styles';

export type ThemeMode = 'light' | 'dark';
export type FontSizePreset = 'small' | 'medium' | 'large';

interface AppThemeOptions {
  mode: ThemeMode;
  fontSize: FontSizePreset;
}

const fontSizeMultiplier: Record<FontSizePreset, number> = {
  small: 0.9,
  medium: 1,
  large: 1.1,
};

export function createAppTheme(options: AppThemeOptions): Theme {
  const { mode, fontSize } = options;
  const k = fontSizeMultiplier[fontSize];

  const isLight = mode === 'light';

  return createTheme({
    palette: {
      mode,
      primary: {
        main: '#0d47a1',
        light: '#42a5f5',
        dark: '#002171',
      },
      secondary: {
        main: '#00bcd4',
        light: '#62efff',
        dark: '#008ba3',
      },
      background: {
        default: isLight ? '#f3f7fb' : '#050712',
        paper: isLight ? '#ffffff' : '#101321',
      },
      text: {
        primary: isLight ? '#0d1b2a' : '#f5f7ff',
        secondary: isLight ? '#43607c' : '#a9b4d8',
      },
    },
    shape: {
      borderRadius: 16,
    },
    typography: {
      fontFamily: 'Roboto, system-ui, -apple-system, "Segoe UI", sans-serif',
      fontSize: Math.round(14 * k),
      h2: {
        fontWeight: 700,
        letterSpacing: '-0.02em',
      },
      h3: {
        fontWeight: 600,
        letterSpacing: '-0.02em',
      },
      subtitle1: {
        fontWeight: 500,
        letterSpacing: '-0.01em',
      },
      body1: {
        fontSize: 14 * k,
      },
      body2: {
        fontSize: 13 * k,
      },
      button: {
        textTransform: 'none',
      },
    },
    components: {
      MuiCssBaseline: {
        // фон страницы и цвет текста зависят от темы
        styleOverrides: (themeParam) => ({
          body: {
            margin: 0,
            minHeight: '100vh',
            background:
              themeParam.palette.mode === 'light'
                ? `radial-gradient(circle at 20% 20%, rgba(0, 188, 212, 0.07), transparent 35%),
                   radial-gradient(circle at 80% 10%, rgba(63, 81, 181, 0.12), transparent 35%),
                   radial-gradient(circle at 50% 80%, rgba(3, 169, 244, 0.1), transparent 35%),
                   #f3f7fb`
                : `radial-gradient(circle at 20% 20%, rgba(0, 188, 212, 0.12), transparent 35%),
                   radial-gradient(circle at 80% 10%, rgba(63, 81, 181, 0.22), transparent 35%),
                   radial-gradient(circle at 50% 80%, rgba(3, 169, 244, 0.2), transparent 35%),
                   #050712`,
            color: themeParam.palette.text.primary,
          },
        }),
      },
      MuiButton: {
        defaultProps: {
          disableElevation: true,
        },
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: 999,
            paddingInline: '18px',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 20,
          },
        },
      },
    },
  });
}
