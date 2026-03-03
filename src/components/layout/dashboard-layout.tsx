"use client";

import { TemplateProps } from "@/types/layout";
import { useLayoutStore, selectSidebarCollapsed, selectMobileOpen } from "@/stores/layoutStore";
import { useMediaQuery, Box, Drawer, AppBar } from "@mui/material";
import { LAYOUT_CONFIG } from "@/configs/layout.config";
import { SidebarLogo } from "@/components/sidebar-logo";
import { SidebarNav } from "@/components/sidebar-nav";
import { SidebarFooter } from "@/components/sidebar-footer";
import { AppBarContent } from "@/components/appbar-content";

export const DashboardTemplate: React.FC<TemplateProps> = ({ children, theme }) => {
  const sidebarCollapsed = useLayoutStore(selectSidebarCollapsed);
  const mobileOpen = useLayoutStore(selectMobileOpen);
  const toggleMobile = useLayoutStore((s) => s.toggleMobile);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const w = sidebarCollapsed ? LAYOUT_CONFIG.sidebarCollapsedWidth : LAYOUT_CONFIG.sidebarWidth;

  const SidebarContent: React.FC<{ mobile?: boolean }> = ({ mobile = false }) => (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', bgcolor: 'background.paper' }}>
      <SidebarLogo collapsed={!mobile && sidebarCollapsed} />
      <Box sx={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
        <SidebarNav collapsed={!mobile && sidebarCollapsed} theme={theme} />
      </Box>
      <SidebarFooter collapsed={!mobile && sidebarCollapsed} mobile={mobile} theme={theme} />
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden', bgcolor: 'background.default' }}>
      {/* Desktop — permanent */}
      {!isMobile && (
        <Drawer
          variant="permanent"
          sx={{
            width: w, flexShrink: 0,
            transition: 'width .22s ease',
            '& .MuiDrawer-paper': {
              width: w, transition: 'width .22s ease',
              overflowX: 'hidden', borderColor: 'divider',
            },
          }}
        >
          <SidebarContent />
        </Drawer>
      )}

      {/* Mobile — temporary overlay */}
      {isMobile && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={toggleMobile}
          ModalProps={{ keepMounted: true }}
          sx={{ '& .MuiDrawer-paper': { width: LAYOUT_CONFIG.sidebarWidth } }}
        >
          <SidebarContent mobile />
        </Drawer>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0, overflow: 'hidden' }}>
        <AppBar
          position="sticky"
          elevation={0}
          sx={{ bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider', color: 'text.primary' }}
        >
          <AppBarContent showHamburger={isMobile} onMenuClick={toggleMobile} />
        </AppBar>
        <Box sx={{ flex: 1, overflow: 'auto', p: { xs: 2, md: 3 } }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};
