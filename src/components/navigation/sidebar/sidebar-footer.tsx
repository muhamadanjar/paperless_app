"use client";

import { useLayoutStore } from "@/stores/layout-store";
import { Box, List, Tooltip, ListItemButton, ListItemIcon, ListItemText, Link } from "@mui/material";
import { Theme } from "@mui/material/styles";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import LogoutIcon from "@mui/icons-material/Logout";
import { signOut } from "next-auth/react";


interface SidebarFooterProps {
  collapsed: boolean;
  mobile?: boolean;
  theme: Theme;
}

export const SidebarFooter: React.FC<SidebarFooterProps> = ({ collapsed, mobile = false }) => {
  const toggleCollapse = useLayoutStore((s) => s.toggleCollapse);

  return (
    <Box sx={{ borderTop: 1, borderColor: 'divider' }}>
      {!mobile && (
        <List disablePadding sx={{ px: 1, py: 0.5 }}>
          <Tooltip title={collapsed ? 'Expand' : ''} placement="right">
            <ListItemButton
              onClick={toggleCollapse}
              sx={{ justifyContent: collapsed ? 'center' : 'flex-start', minHeight: 36, px: collapsed ? 0 : 1.5 }}
            >
              <ListItemIcon sx={{ minWidth: collapsed ? 0 : 32, justifyContent: 'center', color: 'text.secondary' }}>
                {collapsed ? <ChevronRightIcon fontSize="small" /> : <ChevronLeftIcon fontSize="small" />}
              </ListItemIcon>
              {!collapsed && (
                <ListItemText
                  primary="Collapse"
                  primaryTypographyProps={{ fontSize: "0.8125rem", fontWeight: 500, color: 'text.secondary' }}
                />
              )}
            </ListItemButton>
          </Tooltip>
        </List>
      )}
      <List disablePadding sx={{ px: 1, py: 0.5 }}>
        <ListItemButton onClick={() => signOut()}
          sx={{ justifyContent: collapsed && !mobile ? 'center' : 'flex-start', minHeight: 36, px: collapsed && !mobile ? 0 : 1.5 }}
        >
          <ListItemIcon sx={{ minWidth: collapsed && !mobile ? 0 : 32, justifyContent: 'center', color: 'text.secondary' }}>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          {(!collapsed || mobile) && (
            <ListItemText
              primary="Logout"
              primaryTypographyProps={{ fontSize: "0.8125rem", fontWeight: 500, color: 'text.secondary' }}
            />
          )}
        </ListItemButton>
      </List>
    </Box>
  );
};
