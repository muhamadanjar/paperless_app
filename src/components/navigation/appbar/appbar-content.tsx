import { LAYOUT_CONFIG } from "@/configs/layout.config";
import { useLayoutStore, selectPageTitle, selectNotifications, selectDarkMode } from "@/stores/layout-store";
import { Box, IconButton, Typography, Tooltip, Badge, Divider, Stack, Avatar, Chip } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SearchIcon from "@mui/icons-material/Search";
import { useSession } from "next-auth/react";

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

  const { data: session } = useSession();
  const user = session?.user;
  const name = user?.name || "Anjar";
  const email = user?.email || "anjar@nexus.io";

  return (
    <Box
      sx={{
        display: 'flex', alignItems: 'center',
        height: LAYOUT_CONFIG.appBarHeight, px: { xs: 2, sm: 2.5 }, gap: 1,
      }}
    >
      {showHamburger && (
        <IconButton onClick={onMenuClick} size="small" edge="start" sx={{ mr: 0.5 }}>
          <MenuIcon fontSize="small" />
        </IconButton>
      )}

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexGrow: 1 }}>
        <Typography variant="subtitle1" noWrap sx={{ fontWeight: 600, fontSize: '0.95rem' }}>
          {pageTitle}
        </Typography>
        <Chip 
          label="Mainnet" 
          size="small" 
          sx={{ 
            fontSize: '0.65rem', height: 20, bgcolor: 'secondary.main', color: '#fff', 
            fontWeight: 600, display: { xs: 'none', sm: 'flex' } 
          }} 
        />
      </Box>

      <Stack direction="row" alignItems="center" spacing={0.5}>
        <Tooltip title="Search">
          <IconButton size="small" sx={{ color: 'text.secondary' }}>
             <SearchIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title={darkMode ? 'Light mode' : 'Dark mode'}>
          <IconButton size="small" onClick={toggleDark} sx={{ color: 'text.secondary' }}>
            {darkMode ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
          </IconButton>
        </Tooltip>

        <Tooltip title="Notifications">
          <IconButton size="small" sx={{ color: 'text.secondary' }}>
            <Badge badgeContent={notifications} color="primary" max={9} sx={{ '& .MuiBadge-badge': { height: 16, minWidth: 16, fontSize: '0.65rem' } }}>
              <NotificationsIcon fontSize="small" />
            </Badge>
          </IconButton>
        </Tooltip>
      </Stack>

      <Divider orientation="vertical" flexItem sx={{ mx: 1, my: 1.5 }} />

      <Stack direction="row" alignItems="center" spacing={1.25} sx={{ cursor: 'pointer', '&:hover': { opacity: 0.8 } }}>
        <Box sx={{ display: { xs: 'none', sm: 'flex' }, flexDirection: 'column', alignItems: 'flex-end' }}>
          <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.2, fontSize: '0.8rem' }}>
            {name}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem', fontWeight: 500 }}>
            {email}
          </Typography>
        </Box>
        <Avatar
          sx={{
            width: 28, height: 28, fontSize: '0.75rem', fontWeight: 700,
            bgcolor: 'primary.main', color: 'primary.contrastText',
          }}
        >
          {name.charAt(0).toUpperCase()}
        </Avatar>
      </Stack>
    </Box>
  );
};
