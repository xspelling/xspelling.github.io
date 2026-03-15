import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6366f1',
      light: '#818cf8',
      dark: '#4f46e5',
    },
    secondary: {
      main: '#f59e0b',
    },
    background: {
      default: '#0f172a',
      paper: '#1e293b',
    },
    text: {
      primary: '#f8fafc',
      secondary: '#94a3b8',
    },
    success: {
      main: '#10b981',
    },
    error: {
      main: '#ef4444',
    },
    warning: {
      main: '#f59e0b',
    },
    info: {
      main: '#06b6d4',
    },
  },
  typography: {
    fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
    h1: {
      fontFamily: '"Orbitron", sans-serif',
      fontSize: '48px',
      fontWeight: 700,
    },
    h2: {
      fontFamily: '"Orbitron", sans-serif',
      fontSize: '32px',
      fontWeight: 700,
    },
    h3: {
      fontFamily: '"Orbitron", sans-serif',
      fontSize: '24px',
      fontWeight: 600,
    },
    h4: {
      fontFamily: '"Orbitron", sans-serif',
      fontSize: '20px',
      fontWeight: 600,
    },
    body1: {
      fontSize: '16px',
    },
    body2: {
      fontSize: '14px',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 8,
          padding: '10px 20px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#1e293b',
          borderRadius: 12,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

export default theme;
