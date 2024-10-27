import { createTheme } from '@mui/material';

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2196F3', // Niebieski
    },
    secondary: {
      main: '#115b14', // Zielony
    },
    error: {
      main: '#F44336', // Czerwony
    },
    background: {
      default: '#F4F6F8', // Jasno-szary
      paper: '#FFFFFF', // Biały
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90CAF9', // Jasno-niebieski
    },
    secondary: {
      main: '#115b14', // Jasno-pomarańczowy
    },
    error: {
      main: '#FF5252', // Jasno-czerwony
    },
    background: {
      default: '#262626', // Ciemno-szary
      paper: '#3a3838', // Szary
    },
  },
});
