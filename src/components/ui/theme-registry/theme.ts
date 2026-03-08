import { alpha, createTheme } from "@mui/material";

export function buildTheme(dark: boolean) {
  const primaryMain = dark ? "#60A5FA" : "#3B82F6"; // soft blue

  return createTheme({
    palette: {
      mode: dark ? "dark" : "light",
      primary: {
        main: primaryMain,
        contrastText: dark ? "#020617" : "#F9FAFB",
      },
      secondary: {
        main: dark ? "#38BDF8" : "#0EA5E9",
      },
      background: dark
        ? {
            default: "#020617", // slate-950
            paper: "#0F172A", // slate-900
          }
        : {
            default: "#F3F6FC", // soft blue-ish background
            paper: "#FFFFFF",
          },
      text: dark
        ? {
            primary: "#E5E7EB", // gray-200
            secondary: "#9CA3AF", // gray-400
          }
        : {
            primary: "#0F172A", // slate-900
            secondary: "#64748B", // slate-500
          },
      divider: dark ? "#1F2937" : "#E5E7EB",
    },
    typography: {
      fontFamily: "'Sora', 'Segoe UI', sans-serif",
      h6: {
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        fontWeight: 700,
        letterSpacing: "-0.3px",
      },
      h5: {
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        fontWeight: 700,
      },
      h4: {
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        fontWeight: 700,
      },
      overline: { letterSpacing: "0.12em", fontSize: "0.65rem" },
    },
    shape: { borderRadius: 10 },
    components: {
      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            margin: "2px 8px",
            padding: "8px 12px",
            "&.Mui-selected": {
              backgroundColor: alpha(primaryMain, 0.12),
              "&:hover": { backgroundColor: alpha(primaryMain, 0.18) },
            },
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: { borderRight: "1px solid", backgroundImage: "none" },
        },
      },
      MuiAppBar: {
        styleOverrides: { root: { backgroundImage: "none" } },
      },
      MuiCard: { styleOverrides: { root: { backgroundImage: "none" } } },
      MuiPaper: { styleOverrides: { root: { backgroundImage: "none" } } },
    },
  });
}