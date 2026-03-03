"use client";

import { TemplateProps } from "@/types/layout";
import { useLayoutStore, selectActiveNav, selectNotifications, selectDarkMode } from "@/stores/layout-store";
import { Box, AppBar, Toolbar, Stack, Typography, Tooltip, IconButton, Badge, Avatar, Chip } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { LAYOUT_CONFIG } from "@/configs/layout.config";
import { NAV_ITEMS } from "@/configs/nav.config";
import { LightMode as LightModeIcon, DarkMode as DarkModeIcon, Notifications as NotificationsIcon } from "@mui/icons-material";

export const SplitPanelTemplate: React.FC<TemplateProps> = ({ children, theme }) => {
  const activeNav = useLayoutStore(selectActiveNav);
  const setNav = useLayoutStore((s) => s.setNav);
  const pageTitle = useLayoutStore((s) => s.pageTitle);
  const notifications = useLayoutStore(selectNotifications);
  const darkMode = useLayoutStore(selectDarkMode);
  const toggleDark = useLayoutStore((s) => s.toggleDark);
  const accent = theme.palette.primary.main;

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden', bgcolor: 'background.default' }}>
      {/* Icon rail */}
      <Box sx={{ width: 64, bgcolor: 'background.paper', borderRight: 1, borderColor: 'divider', display: 'flex', flexDirection: 'column', alignItems: 'center', py: 2, gap: 0.5, flexShrink: 0 }}>
        <Box sx={{ width: 32, height: 32, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 14, bgcolor: 'primary.main', color: 'primary.contrastText', mb: 1.5 }}>N</Box>
        {NAV_ITEMS.map(({ label, icon }) => (
          <Tooltip key={label} title={label} placement="right" arrow>
            <IconButton onClick={() => setNav(label)} size="small" sx={{ width: 40, height: 40, borderRadius: 2, color: activeNav === label ? accent : 'text.secondary', bgcolor: activeNav === label ? alpha(accent, 0.12) : 'transparent', '&:hover': { bgcolor: 'action.hover' } }}>
              {icon}
            </IconButton>
          </Tooltip>
        ))}
        <Box sx={{ flex: 1 }} />
        <Tooltip title={darkMode ? 'Light' : 'Dark'} placement="right">
          <IconButton size="small" onClick={toggleDark} sx={{ color: 'text.secondary' }}>
            {darkMode ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
          </IconButton>
        </Tooltip>
        <Avatar sx={{ width: 32, height: 32, fontSize: 12, mt: 0.5, bgcolor: 'primary.main', color: 'primary.contrastText' }}>AD</Avatar>
      </Box>

      {/* Main */}
      <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0, overflow: 'hidden' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', px: 2.5, gap: 1.5, height: LAYOUT_CONFIG.appBarHeight, borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper', flexShrink: 0 }}>
          <Typography variant="h6" sx={{ flex: 1, fontSize: '1rem' }}>{pageTitle}</Typography>
          <Chip label="Live" size="small" color="success" variant="outlined" sx={{ fontSize: 10, height: 20 }} />
          <IconButton size="small" sx={{ color: 'text.secondary' }}>
            <Badge badgeContent={notifications} color="primary" max={9}><NotificationsIcon fontSize="small" /></Badge>
          </IconButton>
        </Box>
        <Box sx={{ flex: 1, overflow: 'auto', p: 2.5 }}>{children}</Box>
      </Box>

      {/* Right panel */}
      <Box sx={{ width: 220, bgcolor: 'background.paper', borderLeft: 1, borderColor: 'divider', display: { xs: 'none', lg: 'flex' }, flexDirection: 'column', p: 2, gap: 2, overflowY: 'auto', flexShrink: 0 }}>
        <Typography variant="overline" color="text.secondary">Quick Stats</Typography>
        {[
          { label: 'Uptime', val: '99.98%', color: '#22C55E' },
          { label: 'Latency', val: '42ms', color: '#F59E0B' },
          { label: 'Errors/hr', val: '0.3', color: '#06B6D4' },
        ].map((s) => (
          <Box key={s.label} sx={{ p: 1.5, borderRadius: 2, bgcolor: 'action.hover' }}>
            <Typography variant="overline" color="text.secondary" display="block">{s.label}</Typography>
            <Typography variant="h6" sx={{ color: s.color, fontSize: '1.2rem', fontWeight: 700 }}>{s.val}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};
