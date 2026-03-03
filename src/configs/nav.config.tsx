import DashboardIcon from "@mui/icons-material/Dashboard";
import BarChartIcon from "@mui/icons-material/BarChart";
import GroupIcon from "@mui/icons-material/Group";
import FolderIcon from "@mui/icons-material/Folder";
import SettingsIcon from "@mui/icons-material/Settings";
import { ReactNode } from "react";

export interface NavItem {
  label: string;
  icon: ReactNode;
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Overview', icon: <DashboardIcon fontSize="small" /> },
  { label: 'Analytics', icon: <BarChartIcon fontSize="small" /> },
  { label: 'Users', icon: <GroupIcon fontSize="small" /> },
  { label: 'Projects', icon: <FolderIcon fontSize="small" /> },
  { label: 'Settings', icon: <SettingsIcon fontSize="small" /> },
];
