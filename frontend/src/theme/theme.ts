import { alpha, createTheme } from '@mui/material/styles';

export const smhcTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0b6b6f',
      light: '#3c9ca0',
      dark: '#07474a',
    },
    secondary: {
      main: '#f28f3b',
      light: '#ffc076',
      dark: '#b55d14',
    },
    info: {
      main: '#2a7fa2',
      light: '#6cb6d1',
      dark: '#1f5570',
    },
    background: {
      default: '#eef4f4',
      paper: '#ffffff',
    },
    success: {
      main: '#1c8c4e',
    },
  },
  typography: {
    fontFamily: 'Pretendard, "Plus Jakarta Sans", "Segoe UI", sans-serif',
    h3: {
      fontWeight: 700,
      letterSpacing: '-0.03em',
    },
    h5: {
      fontWeight: 800,
      letterSpacing: '-0.02em',
    },
    subtitle1: {
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },
    button: {
      textTransform: 'none',
      fontWeight: 700,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: '1px solid rgba(11, 107, 111, 0.14)',
          boxShadow: '0 16px 36px rgba(12, 53, 59, 0.08)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          paddingInline: 16,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          fontWeight: 700,
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          minHeight: 'auto',
        },
        indicator: {
          height: 4,
          borderRadius: 999,
          backgroundColor: '#0b6b6f',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: {
          backgroundImage: 'none',
        },
      },
    },
    MuiToggleButtonGroup: {
      styleOverrides: {
        grouped: {
          borderRadius: 10,
          borderColor: 'rgba(11, 107, 111, 0.12)',
          '&.Mui-selected': {
            backgroundColor: 'rgba(11, 107, 111, 0.1)',
            color: '#07474a',
          },
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 700,
          paddingInline: 12,
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        outlined: {
          backgroundColor: alpha('#ffffff', 0.72),
          borderRadius: 10,
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          transition:
            'transform 0.18s ease, box-shadow 0.18s ease, background-color 0.18s ease',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: `0 12px 28px ${alpha('#0c353b', 0.08)}`,
          },
        },
      },
    },
  },
});
