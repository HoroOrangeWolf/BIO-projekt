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
import ClientVisits from '@main/components/Client/Visits/ClientVisits.tsx';
import VisitHistory from '@main/components/Client/History/VisitHistory.tsx';
import ClientDocumentation from '@main/components/Client/Documentation/ClientDocumentation.tsx';
import VisitCalendar from '@main/components/Client/Calendar/VisitCalendar.tsx';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import ArticleIcon from '@mui/icons-material/Article';
import GradeIcon from '@mui/icons-material/Grade';
import SpecializationList from '@main/components/system/specialization/SpecializationList.tsx';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import DoctorCalendar from '@main/components/Doctor/VisitsCalendar/Calendar.tsx';

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
        text: 'visits',
        icon: LocalHospitalIcon,
        path: '/client/visits',
        component: ClientVisits,
      },
      {
        text: 'history',
        icon: FormatListBulletedIcon,
        path: '/client/history',
        component: VisitHistory,
      },
      {
        text: 'medical_docs',
        icon: SettingsIcon,
        path: '/client/documentation',
        component: ClientDocumentation,
      },
      {
        text: 'calendar',
        icon: ArticleIcon,
        path: '/client/calendar',
        component: VisitCalendar,
      },
    ],
  },
  {
    text: 'doctor',
    icon: PeopleIcon,
    children: [
      {
        text: 'planed_visits',
        icon: CalendarMonthIcon,
        path: '/doctor/planed_visits',
        component: DoctorCalendar,
      },
      {
        text: 'documentation',
        icon: FileCopyIcon,
        path: '/doctor/documentation',
        component: Dashboard,
      },
    ],
  },
  {
    text: 'system',
    icon: AdminPanelSettingsIcon,
    children: [
      {
        text: 'specialization',
        icon: GradeIcon,
        path: '/system/specialization',
        component: SpecializationList,
      },
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
