import DashboardIcon from "@mui/icons-material/Dashboard";
import BarChartIcon from "@mui/icons-material/BarChart";
import GroupIcon from "@mui/icons-material/Group";
import FolderIcon from "@mui/icons-material/Folder";
import SettingsIcon from "@mui/icons-material/Settings";
import { ReactNode } from "react";

export interface NavItem {
  label: string;
  icon: ReactNode;
  href: string;
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Overview', icon: <DashboardIcon fontSize="small" /> , href: '/'},
  { label: 'Quiz', icon: <BarChartIcon fontSize="small" /> , href: '/quiz' },
  { label: 'Leaderboard', icon: <GroupIcon fontSize="small" /> , href: '/leaderboard' },
  { label: 'Settings', icon: <SettingsIcon fontSize="small" /> , href: '/settings' },
];
