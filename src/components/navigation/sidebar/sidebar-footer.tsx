import { useLayoutStore } from "@/stores/layout-store";
import { Box, List, Tooltip, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { Theme } from "@mui/material/styles";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import LogoutIcon from "@mui/icons-material/Logout";


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
              sx={{ justifyContent: collapsed ? 'center' : 'flex-start', minHeight: 40 }}
            >
              <ListItemIcon sx={{ minWidth: collapsed ? 0 : 36, justifyContent: 'center', color: 'text.secondary' }}>
                {collapsed ? <ChevronRightIcon fontSize="small" /> : <ChevronLeftIcon fontSize="small" />}
              </ListItemIcon>
              {!collapsed && (
                <ListItemText
                  primary="Collapse"
                  primaryTypographyProps={{ fontSize: 12, color: 'text.secondary' }}
                />
              )}
            </ListItemButton>
          </Tooltip>
        </List>
      )}
      <List disablePadding sx={{ px: 1, py: 0.5 }}>
        <ListItemButton
          sx={{ justifyContent: collapsed && !mobile ? 'center' : 'flex-start', minHeight: 40 }}
        >
          <ListItemIcon sx={{ minWidth: collapsed && !mobile ? 0 : 36, justifyContent: 'center', color: 'text.secondary' }}>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          {(!collapsed || mobile) && (
            <ListItemText
              primary="Logout"
              primaryTypographyProps={{ fontSize: 13, color: 'text.secondary' }}
            />
          )}
        </ListItemButton>
      </List>
    </Box>
  );
};
