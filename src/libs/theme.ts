import { alpha, createTheme } from "@mui/material";

export function buildTheme(dark: boolean) {

  return createTheme({
    palette: {
      mode: "dark",
      primary: {
        main: "#00D99C",
        dark: "#00B880",
        light: "#33E0AC",
      },
      secondary: {
        main: "#FF4D6A",
      },
      background: {
        default: "#080B10",
        paper: "#0D1117",
      },
      text: {
        primary: "#E8EDF5",
        secondary: "#6B7A99",
      },
      divider: "rgba(255,255,255,0.06)",
      success: { main: "#00D99C" },
      error: { main: "#FF4D6A" },
      warning: { main: "#F59E0B" },

    },
    typography: {
      fontFamily: '"DM Sans", "IBM Plex Mono", monospace',
      h1: { fontWeight: 700, letterSpacing: "-0.02em" },
      h2: { fontWeight: 700, letterSpacing: "-0.01em" },
      h3: { fontWeight: 600 },
      h4: { fontWeight: 600 },
      h5: { fontWeight: 600 },
      h6: { fontWeight: 600 },
      body1: { fontSize: "0.875rem" },
      body2: { fontSize: "0.75rem" },
      caption: { fontSize: "0.7rem", letterSpacing: "0.05em" },
    },
    shape: { borderRadius: 6 }, // tighter border radius
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: "#080B10",
            scrollbarWidth: "thin",
            scrollbarColor: "#1E2633 transparent",
            "&::-webkit-scrollbar": { width: "6px" },
            "&::-webkit-scrollbar-track": { background: "transparent" },
            "&::-webkit-scrollbar-thumb": {
              background: "#1E2633",
              borderRadius: "3px",
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
            border: "1px solid rgba(255,255,255,0.06)",
            backgroundColor: "#0D1117",
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            textTransform: "none",
            fontWeight: 500,
            fontSize: "0.8rem",
            minHeight: 36,
            padding: "6px 14px",
            color: "#6B7A99",
            "&.Mui-selected": { color: "#00D99C" },
          },
        },
      },
      MuiTabs: {
        styleOverrides: {
          indicator: { backgroundColor: "#00D99C", height: 2 },
          root: { minHeight: 36 },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            fontSize: "0.7rem",
            height: 22,
            borderRadius: 4,
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            fontWeight: 500,
            borderRadius: 6,
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderBottom: "1px solid rgba(255,255,255,0.04)",
            padding: "10px 12px",
            fontSize: "0.8rem",
          },
          head: {
            color: "#6B7A99",
            fontWeight: 500,
            fontSize: "0.7rem",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            backgroundColor: "#080B10",
          },
        },
      },
      MuiTableRow: {
        styleOverrides: {
          root: {
            "&:hover": { backgroundColor: "rgba(255,255,255,0.025)" },
          },
        },
      },
  

    }
  });
}