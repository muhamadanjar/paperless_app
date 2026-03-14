import { Box, Typography } from "@mui/material";
import { LAYOUT_CONFIG } from "@/configs/layout.config";

interface SidebarLogoProps {
  collapsed: boolean;
}

export const SidebarLogo: React.FC<SidebarLogoProps> = ({ collapsed }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: collapsed ? 0 : 1.25,
      justifyContent: collapsed ? 'center' : 'flex-start',
      px: collapsed ? 0 : 2,
      height: LAYOUT_CONFIG.appBarHeight,
      borderBottom: 1,
      borderColor: 'divider',
      flexShrink: 0,
    }}
  >
    <Box
      sx={{
        width: 28, height: 28, borderRadius: '8px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 800, fontSize: 13,
        bgcolor: 'primary.main', color: 'primary.contrastText', flexShrink: 0,
      }}
    >
      N
    </Box>
    {!collapsed && (
      <Typography variant="subtitle2" noWrap sx={{ fontSize: '0.95rem', fontWeight: 700, letterSpacing: '0.02em' }}>
        NEXUS
      </Typography>
    )}
  </Box>
);
