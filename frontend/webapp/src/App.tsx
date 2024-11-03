import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router, Routes, Route, Navigate,
} from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useDispatch, useSelector } from 'react-redux';
import i18n from 'i18next';
import SetupTOTP from '@main/components/Auth/SetupTOTP.tsx';
import Login from '@main/components/Auth/Login.tsx';
import Register from '@main/components/Auth/Register.tsx';
import Layout from '@main/components/Layout/Layout.tsx';
import { clearUser, setAuthCheckComplete, setUser } from '@main/components/features/auth/authSlice.ts';
import { getCurrentUser } from '@main/components/services/api.ts';
import PrivateRoute from '@main/components/route/PrivateRoute.tsx';
import { useSnackbar } from '@main/SnackbarProvider.tsx';
import { darkTheme, lightTheme } from '@main/theme.ts';
import { menuConfig } from '@main/menuConfig.ts';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';

type ItemsType = {
  path: string;
  component: any;
  children: ItemsType[];
}

const App = () => {
  const [mode, setMode] = useState('dark');
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state: any) => state.auth.isAuthenticated);
  const showSnackbar: (v: string, type: 'success') => any = useSnackbar() as any;

  const changeLanguage = () => {
    const currentLanguage = localStorage.getItem('lng') || 'pl';
    const newLanguage = currentLanguage === 'pl' ? 'en' : 'pl';
    i18n.changeLanguage(newLanguage);
    localStorage.setItem('lng', newLanguage);
    showSnackbar(`Language changed to ${newLanguage === 'pl' ? 'Polish' : 'English'}`, 'success');
  };

  useEffect(() => {
    const savedLanguage = localStorage.getItem('lng') || 'pl';
    i18n.changeLanguage(savedLanguage);
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await getCurrentUser();
        dispatch(setUser(response.data));
      } catch (error) {
        console.error('Err', error);
        dispatch(clearUser());
      } finally {
        dispatch(setAuthCheckComplete(true));
      }
    };

    checkAuth();
  }, [dispatch]);

  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
    showSnackbar('Mode color changed.', 'success');
  };

  const renderRoutes = (items: ItemsType[]): React.ReactNode => items.flatMap((item) => {
    if (item.children) {
      return renderRoutes(item.children);
    }
    return (
      <Route
        key={item.path}
        path={item.path}
        element={<item.component />}
      />
    );
  });

  const theme = mode === 'light' ? lightTheme : darkTheme;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
            <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" />} />
            <Route element={<PrivateRoute />}>
              <Route path="/setup-totp" element={<SetupTOTP />} />
              <Route path="/" element={<Layout toggleColorMode={toggleColorMode} changeLanguage={changeLanguage} />}>
                {renderRoutes(menuConfig as unknown as ItemsType[])}
              </Route>
            </Route>
          </Routes>
        </Router>
      </ThemeProvider>
    </LocalizationProvider>
  );
};

export default App;
