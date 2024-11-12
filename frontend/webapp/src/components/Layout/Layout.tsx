import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import Sidebar from './Sidebar.js';
import AppBar from './AppBar.js';

const drawerWidth = 240;

type PropsType = {
    toggleColorMode: () => void;
    changeLanguage: () => void;
}

const Layout = ({ toggleColorMode, changeLanguage }: PropsType) => {
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
          p: 1,
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
};

export default Layout;
