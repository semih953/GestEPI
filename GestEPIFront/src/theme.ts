import { createTheme } from '@mui/material/styles';

// Création d'un thème personnalisé
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Bleu foncé
      light: '#42a5f5', // Bleu clair
      dark: '#0d47a1', // Bleu très foncé
      contrastText: '#fff',
    },
    secondary: {
      main: '#f57c00', // Orange
      light: '#ffb74d', // Orange clair
      dark: '#e65100', // Orange foncé
      contrastText: '#fff',
    },
    error: {
      main: '#d32f2f', // Rouge
    },
    warning: {
      main: '#ed6c02', // Orange
    },
    info: {
      main: '#0288d1', // Bleu clair
    },
    success: {
      main: '#2e7d32', // Vert
    },
    background: {
      default: '#f5f5f5',
      paper: '#fff',
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h4: {
      fontWeight: 600,
      marginBottom: '1rem',
    },
    h6: {
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 4,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 'bold',
          backgroundColor: 'rgba(0, 0, 0, 0.04)',
        },
      },
    },
  },
});

export default theme;