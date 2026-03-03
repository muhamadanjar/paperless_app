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
      gap: collapsed ? 0 : 1.5,
      justifyContent: collapsed ? 'center' : 'flex-start',
      px: collapsed ? 0 : 2.5,
      height: LAYOUT_CONFIG.appBarHeight,
      borderBottom: 1,
      borderColor: 'divider',
      flexShrink: 0,
    }}
  >
    <Box
      sx={{
        width: 32, height: 32, borderRadius: '10px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 900, fontSize: 14,
        bgcolor: 'primary.main', color: 'primary.contrastText', flexShrink: 0,
      }}
    >
      N
    </Box>
    {!collapsed && (
      <Typography variant="h6" noWrap sx={{ fontSize: '1.1rem' }}>
        Nexus
      </Typography>
    )}
  </Box>
);
