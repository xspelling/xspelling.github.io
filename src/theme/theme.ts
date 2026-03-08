import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0071e3',
      light: '#0077ed',
      dark: '#005bb5',
    },
    secondary: {
      main: '#86868b',
    },
    background: {
      default: '#f5f5f7',
      paper: '#ffffff',
    },
    text: {
      primary: '#1d1d1f',
      secondary: '#86868b',
    },
    success: {
      main: '#30d158',
    },
    error: {
      main: '#ff453a',
    },
    warning: {
      main: '#ffd60a',
    },
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", Roboto, sans-serif',
    h1: {
      fontSize: '80px',
      fontWeight: 700,
      letterSpacing: '-0.02em',
      lineHeight: 1.1,
    },
    h2: {
      fontSize: '56px',
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontSize: '40px',
      fontWeight: 600,
    },
    h4: {
      fontSize: '28px',
      fontWeight: 500,
    },
    h5: {
      fontSize: '22px',
      fontWeight: 500,
    },
    h6: {
      fontSize: '17px',
      fontWeight: 600,
    },
    body1: {
      fontSize: '17px',
      fontWeight: 400,
    },
    body2: {
      fontSize: '15px',
      fontWeight: 400,
    },
    caption: {
      fontSize: '13px',
      fontWeight: 400,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          padding: '12px 24px',
          borderRadius: 20,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          borderRadius: 20,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
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
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255,255,255,0.8)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 1px 0 rgba(0,0,0,0.1)',
        },
      },
    },
  },
});

export default theme;
