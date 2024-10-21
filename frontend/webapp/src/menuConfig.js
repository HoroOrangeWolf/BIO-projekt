import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import GroupIcon from '@mui/icons-material/Group';
import SecurityIcon from '@mui/icons-material/Security';
import UsersList from "./components/system/users/UsersList.jsx";
import GroupList from "./components/system/groups/GroupList.jsx";
import PermissionList from "./components/system/premissions/PermissionList.jsx";
import SetupTOTP from "./components/Auth/SetupTOTP.jsx";
import Dashboard from "./components/Dashboard/Dashboard.jsx";

export const menuConfig = [
  {
    text: 'dashboard',
    icon: DashboardIcon,
    path: '/',
    component: Dashboard
  },
  {
    text: 'client',
    icon: PeopleIcon,
    children: [
      {
        text: 'cos tam',
        icon: SettingsIcon,
        path: '/client/cos_tam'
      },
      {
        text: 'cos tam',
        icon: SettingsIcon,
        path: '/client/cos_tam'
      }
    ]
  },
  {
    text: 'doctor',
    icon: PeopleIcon,
    children: [
      {
        text: 'cos tam',
        icon: SettingsIcon,
        path: '/doctor/cos_tam'
      },
      {
        text: 'cos tam',
        icon: SettingsIcon,
        path: '/doctor/cos_tam'
      }
    ]
  },
  {
    text: 'system',
    icon: AdminPanelSettingsIcon,
    children: [
      {
        text: 'users',
        icon: PeopleIcon,
        path: '/system/users',
        component: UsersList
      },
      {
        text: 'groups',
        icon: GroupIcon,
        path: '/system/groups',
        component: GroupList
      },
      {
        text: 'permissions',
        icon: SecurityIcon,
        path: '/system/permissions',
        component: PermissionList
      },
      {
        text: 'settings',
        icon: SettingsIcon,
        path: '/system/settings',
        component: SetupTOTP
      }
    ]
  }
];