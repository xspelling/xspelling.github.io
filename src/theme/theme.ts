import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#0071e3',
      light: '#0077ed',
      dark: '#005bb5',
    },
    secondary: {
      main: '#86868b',
    },
    background: {
      default: '#000000',
      paper: '#1d1d1f',
    },
    text: {
      primary: '#f5f5f7',
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
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
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
          backgroundColor: '#2d2d2f',
          borderRadius: 16,
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
