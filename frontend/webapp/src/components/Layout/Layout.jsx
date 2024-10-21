import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import Sidebar from './Sidebar';
import AppBar from './AppBar';

const drawerWidth = 240;

function Layout({ toggleColorMode, changeLanguage }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Box>
      <AppBar
        drawerWidth={drawerWidth}
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        toggleColorMode={toggleColorMode}
        changeLanguage={changeLanguage}
      />
      <Sidebar
        drawerWidth={drawerWidth}
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${isSidebarOpen ? drawerWidth : 0}px)` },
          marginLeft: { sm: isSidebarOpen ? `${drawerWidth}px` : 0 },
          mt: '64px',
          height: 'calc(100vh - 64px)',
          transition: (theme) => theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}

export default Layout;
