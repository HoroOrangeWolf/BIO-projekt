import React from 'react';
import {AppBar as MuiAppBar, Toolbar, Typography, IconButton, Button} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import {useDispatch, useSelector} from 'react-redux';
import {useTheme} from '@mui/material/styles';
import {clearUser} from "../features/auth/authSlice.js";
import {logout} from "../services/api.js";
import LogoutIcon from '@mui/icons-material/Logout';
import LanguageIcon from '@mui/icons-material/Language';
import {useTranslation} from "react-i18next";

function AppBar({drawerWidth, isSidebarOpen, toggleSidebar, toggleColorMode, changeLanguage}) {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const theme = useTheme();
  const {t} = useTranslation(["core"]);

  const handleLogout = async () => {
    await logout().then(() => {
      dispatch(clearUser());
    });
  };

  return (
    <MuiAppBar
      position="fixed"
      sx={{
        width: isSidebarOpen ? `calc(100% - ${drawerWidth}px)` : '100%',
        ml: isSidebarOpen ? `${drawerWidth}px` : 0,
      }}
    >
      <Toolbar>
        {!isSidebarOpen && (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={toggleSidebar}
          >
            <MenuIcon/>
          </IconButton>
        )}
        <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
          {t("app.name")}
        </Typography>
        <IconButton color="inherit" onClick={changeLanguage}>
          <LanguageIcon />
        </IconButton>
        <IconButton sx={{ml: 1}} onClick={toggleColorMode} color="inherit">
          {theme.palette.mode === 'dark' ? <Brightness7Icon/> : <Brightness4Icon/>}
        </IconButton>
        {isAuthenticated && (
          <IconButton color="inherit" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        )}
      </Toolbar>
    </MuiAppBar>
  );
}

export default AppBar;