import { LAYOUT_CONFIG } from "@/configs/layout.config";
import { useLayoutStore, selectPageTitle, selectNotifications, selectDarkMode } from "@/stores/layoutStore";
import { Box, IconButton, Typography, Tooltip, Badge, Divider, Stack, Avatar } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import NotificationsIcon from "@mui/icons-material/Notifications";

interface AppBarContentProps {
  showHamburger?: boolean;
  onMenuClick?: () => void;
}

export const AppBarContent: React.FC<AppBarContentProps> = ({
  showHamburger = false,
  onMenuClick,
}) => {
  const pageTitle = useLayoutStore(selectPageTitle);
  const notifications = useLayoutStore(selectNotifications);
  const darkMode = useLayoutStore(selectDarkMode);
  const toggleDark = useLayoutStore((s) => s.toggleDark);

  return (
    <Box
      sx={{
        display: 'flex', alignItems: 'center',
        height: LAYOUT_CONFIG.appBarHeight, px: { xs: 2, sm: 3 }, gap: 1,
      }}
    >
      {showHamburger && (
        <IconButton onClick={onMenuClick} size="small" edge="start" sx={{ mr: 0.5 }}>
          <MenuIcon fontSize="small" />
        </IconButton>
      )}

      <Typography variant="h6" noWrap sx={{ flexGrow: 1, fontSize: '1.05rem' }}>
        {pageTitle}
      </Typography>

      <Tooltip title={darkMode ? 'Light mode' : 'Dark mode'}>
        <IconButton size="small" onClick={toggleDark} sx={{ color: 'text.secondary' }}>
          {darkMode ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
        </IconButton>
      </Tooltip>

      <Tooltip title="Notifications">
        <IconButton size="small" sx={{ color: 'text.secondary' }}>
          <Badge badgeContent={notifications} color="primary" max={9}>
            <NotificationsIcon fontSize="small" />
          </Badge>
        </IconButton>
      </Tooltip>

      <Divider orientation="vertical" flexItem sx={{ mx: 1, my: 1.5 }} />

      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ cursor: 'pointer' }}>
        <Avatar
          sx={{
            width: 34, height: 34, fontSize: 13, fontWeight: 700,
            bgcolor: 'primary.main', color: 'primary.contrastText',
          }}
        >
          AD
        </Avatar>
        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
          <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.2, fontSize: 12 }}>
            Admin Dev
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: 10 }}>
            Enterprise
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
};
