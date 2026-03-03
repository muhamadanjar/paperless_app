"use client";

import { TemplateProps } from "@/types/layout";
import { useLayoutStore, selectNotifications, selectDarkMode, selectActiveNav } from "@/stores/layout-store";
import { Box, AppBar, Toolbar, Stack, Typography, Tooltip, IconButton, Badge, Avatar } from "@mui/material";
import { LAYOUT_CONFIG } from "@/configs/layout.config";
import { NAV_ITEMS } from "@/configs/nav.config";
import { LightMode as LightModeIcon, DarkMode as DarkModeIcon, Notifications as NotificationsIcon } from "@mui/icons-material";

export const MinimalTemplate: React.FC<TemplateProps> = ({ children, theme }) => {
  const activeNav = useLayoutStore(selectActiveNav);
  const setNav = useLayoutStore((s) => s.setNav);
  const notifications = useLayoutStore(selectNotifications);
  const darkMode = useLayoutStore(selectDarkMode);
  const toggleDark = useLayoutStore((s) => s.toggleDark);
  const accent = theme.palette.primary.main;

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
      <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider', color: 'text.primary' }}>
        <Toolbar sx={{ height: LAYOUT_CONFIG.appBarHeight, px: { xs: 2, md: 4 }, gap: 2 }}>
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mr: 4 }}>
            <Box sx={{ width: 28, height: 28, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 12, bgcolor: 'primary.main', color: 'primary.contrastText' }}>N</Box>
            <Typography variant="h6" sx={{ fontSize: '1rem' }}>Nexus</Typography>
          </Stack>

          <Stack direction="row" spacing={0} sx={{ flex: 1, display: { xs: 'none', md: 'flex' } }}>
            {NAV_ITEMS.map(({ label, icon }) => (
              <Box
                key={label}
                onClick={() => setNav(label)}
                sx={{
                  display: 'flex', alignItems: 'center', gap: 0.75,
                  px: 2, cursor: 'pointer',
                  height: LAYOUT_CONFIG.appBarHeight,
                  borderBottom: 2,
                  borderColor: activeNav === label ? accent : 'transparent',
                  color: activeNav === label ? accent : 'text.secondary',
                  fontSize: 13, fontWeight: activeNav === label ? 600 : 400,
                  transition: 'all .15s',
                  '&:hover': { color: 'text.primary', bgcolor: 'action.hover' },
                }}
              >
                {icon}<span>{label}</span>
              </Box>
            ))}
          </Stack>

          <Tooltip title={darkMode ? 'Light' : 'Dark'}>
            <IconButton size="small" onClick={toggleDark} sx={{ color: 'text.secondary' }}>
              {darkMode ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
            </IconButton>
          </Tooltip>
          <IconButton size="small" sx={{ color: 'text.secondary' }}>
            <Badge badgeContent={notifications} color="primary" max={9}>
              <NotificationsIcon fontSize="small" />
            </Badge>
          </IconButton>
          <Avatar sx={{ width: 32, height: 32, fontSize: 12, bgcolor: 'primary.main', color: 'primary.contrastText' }}>AD</Avatar>
        </Toolbar>
      </AppBar>

      <Box sx={{ flex: 1, width: '100%', maxWidth: 1152, mx: 'auto', px: { xs: 2, md: 3 }, py: 3.5 }}>
        <Typography variant="h4" sx={{ mb: 3.5, fontSize: '1.7rem' }}>{activeNav}</Typography>
        {children}
      </Box>
    </Box>
  );
};
