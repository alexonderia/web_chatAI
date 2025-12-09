import { createTheme, Theme } from '@mui/material/styles';

export type ThemeMode = 'light' | 'dark';
export type FontSizePreset = 'small' | 'medium' | 'large';

interface AppThemeOptions {
  mode: ThemeMode;
  fontSize: FontSizePreset;
}

const fontSizeMultiplier: Record<FontSizePreset, number> = {
  small: 0.7,
  medium: 1,
  large: 1.3,
};

export function createAppTheme(options: AppThemeOptions): Theme {
  const { mode, fontSize } = options;
  const k = fontSizeMultiplier[fontSize];

  const isLight = mode === 'light';

  return createTheme({
    palette: {
      mode,
      primary: {
        main: '#005dac',
        light: '#6acff6',
        dark: '#283a97',
      },
      secondary: {
        main: '#00aef0', 
        light: '#6acff6',
        dark: '#005dac',
      },
      background: {
        default: isLight ? '#f1f7ff' : '#0b1221',
        paper: isLight ? '#ffffff' : '#0f1830',
      },
      text: {
        primary: isLight ? '#0b1a33' : '#eef2ff',
        secondary: isLight ? '#3a5174' : '#b3c1e4',
      },
    },
    shape: {
      borderRadius: 16,
    },
    typography: {
      fontFamily: '"Open Sans", "PT Sans", system-ui, -apple-system, "Segoe UI", sans-serif',
      fontWeightRegular: 400,
      fontWeightMedium: 600,
      fontWeightBold: 700,
      fontSize: Math.round(14 * k),
      h2: {
        fontFamily: '"PT Sans", "Open Sans", system-ui, sans-serif',
        fontWeight: 600,
        letterSpacing: '-0.01em',
      },
      h3: {
        fontFamily: '"PT Sans", "Open Sans", system-ui, sans-serif',
        fontWeight: 600,
        letterSpacing: '-0.01em',
      },
      h4: {
        fontFamily: '"PT Sans", "Open Sans", system-ui, sans-serif',
        fontWeight: 600,
        letterSpacing: '-0.005em',
      },
      subtitle1: {
        fontWeight: 500,
        letterSpacing: 0,
      },
      body1: {
        fontSize: 14 * k,
        lineHeight: 1.6,
      },
      body2: {
        fontFamily: '"Open Sans", "PT Sans", system-ui, sans-serif',
        fontWeight: 400,
        fontSize: 13 * k,
        lineHeight: 1.5,
      },
      button: {
        textTransform: 'none',
        fontWeight: 500,
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: (themeParam) => ({
          body: {
            margin: 0,
            minHeight: '100vh',
            backgroundColor: themeParam.palette.background.default,
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
            fontWeight: 500,
          },

          containedPrimary: {
            backgroundColor: isLight ? '#005dac' : '#1b8cff',
            color: '#ffffff',
            '&:hover': {
              backgroundColor: isLight ? '#00427a' : '#3b93ff',
            },
          },

          outlined: {
            borderWidth: 1,
            borderColor: isLight
              ? 'rgba(0, 93, 172, 0.4)'
              : 'rgba(255, 255, 255, 0.7)',
            color: isLight ? '#005dac' : '#e5f3ff',
            '&:hover': {
              borderColor: isLight ? '#005dac' : '#ffffff',
              backgroundColor: isLight
                ? 'rgba(0, 93, 172, 0.04)'
                : 'rgba(255, 255, 255, 0.06)',
            },
            '&.Mui-disabled': {
              borderColor: isLight
                ? 'rgba(148, 163, 184, 0.6)'
                : 'rgba(148, 163, 184, 0.7)',
              color: isLight
                ? 'rgba(148, 163, 184, 0.9)'
                : 'rgba(226, 232, 240, 0.9)',
            },
          },

          textPrimary: {
            color: isLight ? '#005dac' : '#e5f3ff',
            '&:hover': {
              backgroundColor: isLight
                ? 'rgba(0, 93, 172, 0.06)'
                : 'rgba(255, 255, 255, 0.08)',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 2,
            ...( !isLight && {
              backgroundImage: 'none', 
            }),
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            backgroundColor: isLight ? '#f9fafb' : 'rgba(15, 23, 42, 0.85)',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: isLight
                ? 'rgba(15, 23, 42, 0.12)'
                : 'rgba(226, 232, 240, 0.35)',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: isLight ? '#005dac' : '#6acff6',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: isLight ? '#005dac' : '#ffffff',
            },
          },
          input: {
            paddingTop: 12,
            paddingBottom: 12,
          },
        },
      },

      MuiInputLabel: {
        styleOverrides: {
          root: {
            color: isLight
              ? 'rgba(15, 23, 42, 0.6)'
              : 'rgba(226, 232, 240, 0.8)',
            '&.Mui-focused': {
              color: isLight ? '#005dac' : '#ffffffff',
            },
            '&.MuiInputLabel-outlined': {
              top: '50%',
              transform: 'translate(14px, -50%) scale(1)',
              '&.MuiInputLabel-shrink': {
                top: 0,
                transform: 'translate(14px, -9px) scale(0.75)',
              },
            },
          },
        },
        
      },
    },
  });
}
