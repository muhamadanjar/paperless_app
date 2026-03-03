import { useLayoutStore, selectActiveNav } from "@/stores/layout-store";
import { List, Tooltip, ListItemButton, ListItemIcon, ListItemText, Box } from "@mui/material";
import { Theme } from "@mui/material/styles";

import { NAV_ITEMS } from "@/configs/nav.config";



interface SidebarNavProps {
  collapsed: boolean;
  theme: Theme;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({ collapsed, theme }) => {
  const activeNav = useLayoutStore(selectActiveNav);
  const setNav = useLayoutStore((s) => s.setNav);
  const accent = theme.palette.primary.main;

  return (
    <List disablePadding sx={{ px: 1, py: 1 }}>
      {NAV_ITEMS.map(({ label, icon }) => {
        const active = activeNav === label;
        return (
          <Tooltip key={label} title={collapsed ? label : ''} placement="right" arrow>
            <ListItemButton
              selected={active}
              onClick={() => setNav(label)}
              sx={{
                justifyContent: collapsed ? 'center' : 'flex-start',
                minHeight: 44,
                px: collapsed ? 0 : '12px',
                borderLeft: active ? `3px solid ${accent}` : '3px solid transparent',
                transition: 'all .15s',
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: collapsed ? 0 : 36,
                  color: active ? accent : 'text.secondary',
                  justifyContent: 'center',
                }}
              >
                {icon}
              </ListItemIcon>
              {!collapsed && (
                <ListItemText
                  primary={label}
                  primaryTypographyProps={{
                    fontSize: 13,
                    fontWeight: active ? 600 : 400,
                    color: active ? 'text.primary' : 'text.secondary',
                  }}
                />
              )}
              {!collapsed && active && (
                <Box
                  sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: accent, flexShrink: 0 }}
                />
              )}
            </ListItemButton>
          </Tooltip>
        );
      })}
    </List>
  );
};
