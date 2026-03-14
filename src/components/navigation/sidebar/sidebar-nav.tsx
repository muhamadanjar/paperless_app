import { useLayoutStore, selectActiveNav } from "@/stores/layout-store";
import {
  List,
  Tooltip,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
} from "@mui/material";
import { Theme } from "@mui/material/styles";
import Link from "next/link";

import { NAV_ITEMS } from "@/configs/nav.config";

interface SidebarNavProps {
  collapsed: boolean;
  theme: Theme;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({
  collapsed,
  theme,
}) => {
  const activeNav = useLayoutStore(selectActiveNav);
  const setNav = useLayoutStore((s) => s.setNav);
  const accent = theme.palette.primary.main;

  return (
    <List disablePadding sx={{ px: 1, py: 1 }}>
      {NAV_ITEMS.map(({ label, icon, href }) => {
        const active = activeNav === label;
        return (
          <Tooltip
            key={label}
            title={collapsed ? label : ""}
            placement="right"
            arrow
          >
            <ListItemButton
              component={Link}
              href={href}
              selected={active}
              onClick={() => setNav(label)}
              sx={{
                justifyContent: collapsed ? "center" : "flex-start",
                px: collapsed ? 0 : 1.5,
                borderLeft: active
                  ? `3px solid ${accent}`
                  : "3px solid transparent",
                transition: "all .15s",
              }}
            >
              <ListItemIcon
                sx={{
                  color: active ? accent : "text.secondary",
                  justifyContent: "center",
                }}
              >
                {icon}
              </ListItemIcon>
              {!collapsed && (
                <ListItemText
                  primary={label}
                  primaryTypographyProps={{
                    fontSize: "0.8125rem", // 13px
                    fontWeight: active ? 600 : 500,
                    color: active ? "text.primary" : "text.secondary",
                  }}
                />
              )}
            </ListItemButton>
          </Tooltip>
        );
      })}
    </List>
  );
};
