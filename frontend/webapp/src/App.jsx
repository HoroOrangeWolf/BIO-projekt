import React, {useState, useEffect} from 'react';
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import {ThemeProvider} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {useDispatch, useSelector} from 'react-redux';
import Layout from './components/Layout/Layout';
import Dashboard from './components/Dashboard/Dashboard';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import SetupTOTP from './components/Auth/SetupTOTP';
import {getCurrentUser} from "./components/services/api.js";
import {clearUser, setAuthCheckComplete, setUser} from "./components/features/auth/authSlice.js";
import PrivateRoute from "./components/route/PrivateRoute.jsx";
import {darkTheme, lightTheme} from "./theme.js";
import i18n from "i18next";
import {useSnackbar} from "./SnackbarProvider.jsx";
import UsersList from "./components/system/users/UsersList.jsx";
import GroupList from "./components/system/groups/GroupList.jsx";
import PermissionList from "./components/system/premissions/PermissionList.jsx";
import {menuConfig} from "./menuConfig.js";

function App() {
  const [mode, setMode] = useState('dark');
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const showSnackbar = useSnackbar();

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
        dispatch(clearUser());
      } finally {
        dispatch(setAuthCheckComplete(true));
      }
    };

    checkAuth();
  }, [dispatch]);

  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
    showSnackbar(`Mode color changed.`, 'success');

  };

  const renderRoutes = (items) => {
    return items.flatMap(item => {
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
  };

  const theme = mode === 'light' ? lightTheme : darkTheme;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline/>
      <Router>
        <Routes>
          <Route path="/login" element={!isAuthenticated ? <Login/> : <Navigate to="/"/>}/>
          <Route path="/register" element={!isAuthenticated ? <Register/> : <Navigate to="/"/>}/>
          <Route element={<PrivateRoute/>}>
            <Route path="/setup-totp" element={<SetupTOTP/>}/>
            <Route path="/" element={<Layout toggleColorMode={toggleColorMode} changeLanguage={changeLanguage}/>}>
              {renderRoutes(menuConfig)}
            </Route>
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;