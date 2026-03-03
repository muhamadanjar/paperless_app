import { alpha, createTheme } from "@mui/material";

export function buildTheme(dark: boolean) {
  return createTheme({
    palette: {
      mode: dark ? 'dark' : 'light',
      primary: { main: '#F59E0B', contrastText: '#0F0F0F' },
      secondary: { main: '#06B6D4' },
      background: dark
        ? { default: '#0C0D0F', paper: '#161820' }
        : { default: '#F4F3EF', paper: '#FFFFFF' },
      text: dark
        ? { primary: '#E8E6E0', secondary: '#7C7B78' }
        : { primary: '#1A1814', secondary: '#7A7569' },
      divider: dark ? '#2A2C35' : '#E2DFD8',
    },
    typography: {
      fontFamily: "'Sora', 'Segoe UI', sans-serif",
      h6: { fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 700, letterSpacing: '-0.3px' },
      h5: { fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 700 },
      h4: { fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 700 },
      overline: { letterSpacing: '0.12em', fontSize: '0.65rem' },
    },
    shape: { borderRadius: 10 },
    components: {
      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: 8, margin: '2px 8px', padding: '8px 12px',
            '&.Mui-selected': {
              backgroundColor: alpha('#F59E0B', 0.12),
              '&:hover': { backgroundColor: alpha('#F59E0B', 0.18) },
            },
          },
        },
      },
      MuiDrawer:  { styleOverrides: { paper: { borderRight: '1px solid', backgroundImage: 'none' } } },
      MuiAppBar:  { styleOverrides: { root: { backgroundImage: 'none' } } },
      MuiCard:    { styleOverrides: { root: { backgroundImage: 'none' } } },
      MuiPaper:   { styleOverrides: { root: { backgroundImage: 'none' } } },
    },
  });
}