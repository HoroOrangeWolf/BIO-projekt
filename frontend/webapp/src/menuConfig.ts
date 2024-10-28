import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import GroupIcon from '@mui/icons-material/Group';
import SecurityIcon from '@mui/icons-material/Security';
import UsersList from '@main/components/system/users/UsersList.tsx';
import GroupList from '@main/components/system/groups/GroupList.tsx';
import PermissionList from '@main/components/system/premissions/PermissionList.tsx';
import SetupTOTP from '@main/components/Auth/SetupTOTP.tsx';
import Dashboard from '@main/components/Dashboard/Dashboard';

export const menuConfig = [
  {
    text: 'dashboard',
    icon: DashboardIcon,
    path: '/',
    component: Dashboard,
  },
  {
    text: 'client',
    icon: PeopleIcon,
    children: [
      {
        text: 'cos tam',
        icon: SettingsIcon,
        path: '/client/cos_tam',
        component: Dashboard,
      },
      {
        text: 'cos tam',
        icon: SettingsIcon,
        path: '/client/cos_tam',
        component: Dashboard,
      },
    ],
  },
  {
    text: 'doctor',
    icon: PeopleIcon,
    children: [
      {
        text: 'cos tam',
        icon: SettingsIcon,
        path: '/doctor/cos_tam',
        component: Dashboard,
      },
      {
        text: 'cos tam',
        icon: SettingsIcon,
        path: '/doctor/cos_tam',
        component: Dashboard,
      },
    ],
  },
  {
    text: 'system',
    icon: AdminPanelSettingsIcon,
    children: [
      {
        text: 'users',
        icon: PeopleIcon,
        path: '/system/users',
        component: UsersList,
      },
      {
        text: 'groups',
        icon: GroupIcon,
        path: '/system/groups',
        component: GroupList,
      },
      {
        text: 'permissions',
        icon: SecurityIcon,
        path: '/system/permissions',
        component: PermissionList,
      },
      {
        text: 'settings',
        icon: SettingsIcon,
        path: '/system/settings',
        component: SetupTOTP,
      },
    ],
  },
];
