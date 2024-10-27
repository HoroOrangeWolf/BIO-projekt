import React, { useState } from 'react';
import {
  Drawer, List, ListItem, ListItemIcon, ListItemText, Collapse, IconButton, SvgIconTypeMap,
} from '@mui/material';
import { Link } from 'react-router-dom';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useTranslation } from 'react-i18next';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import { menuConfig } from '../../menuConfig.ts';

type PropsType = {
    drawerWidth: number;
    isSidebarOpen: boolean;
    toggleSidebar: () => any;
}

type ItemType = {
    text: string;
    path: string;
    icon: OverridableComponent<SvgIconTypeMap> & { muiName: string; };
    children?: ItemType[];
}

const Sidebar = ({ drawerWidth, isSidebarOpen, toggleSidebar }: PropsType) => {
  const [openSubmenu, setOpenSubmenu] = useState<{[x: string]: string | boolean}>({});
  const { t } = useTranslation(['core']);

  const handleSubmenuClick = (text: string) => {
    setOpenSubmenu((prev) => ({ ...prev, [text]: !prev[text] }));
  };

  const renderMenuItem = (item: ItemType, depth = 0) => {
    const Icon = item.icon;

    if (item.children) {
      return (
        <React.Fragment key={item.text}>
          <ListItem button onClick={() => handleSubmenuClick(item.text)} sx={{ pl: 2 * depth }}>
            <ListItemIcon><Icon /></ListItemIcon>
            <ListItemText primary={t(`pages.${item.text}`)} />
            {openSubmenu[item.text] ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={openSubmenu[item.text] as boolean} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children.map((child) => renderMenuItem(child, depth + 1))}
            </List>
          </Collapse>
        </React.Fragment>
      );
    }

    return (
      <ListItem
        button
        key={item.text}
        component={Link}
        to={item.path}
        sx={{ pl: 2 * depth }}
      >
        <ListItemIcon><Icon /></ListItemIcon>
        <ListItemText primary={t(`pages.${item.text}`)} />
      </ListItem>
    );
  };

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={isSidebarOpen}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          p: '10px',
        },
      }}
    >
      <IconButton
        onClick={toggleSidebar}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <ChevronRightIcon />
      </IconButton>
      <List sx={{ mt: 5 }}>
        {menuConfig.map((item) => renderMenuItem(item as ItemType))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
