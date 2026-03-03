import { useLayoutStore } from "@/stores/layoutStore";
import { TemplateKey } from "@/types/layout";
import { ThemeProvider } from "@emotion/react";
import { Box, Paper, Stack, Typography, IconButton, alpha } from "@mui/material";
import { useState } from "react";
import { buildTheme } from "@/components/theme-registry/theme";
import CloseIcon from "@mui/icons-material/Close";
import TuneIcon from "@mui/icons-material/Tune";

export const TemplateSwitcher = () => {
  const [open, setOpen] = useState(false);
  const { activeTemplate, setTemplate } = useLayoutStore();
  const darkMode = useLayoutStore((s) => s.darkMode);
  const theme = buildTheme(darkMode);

  const labels: Record<TemplateKey, string> = {
    dashboard: "Dashboard",
    minimal: "Minimal", 
    splitpanel: "Split Panel"
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ position: "fixed", bottom: 24, right: 24, zIndex: 9999 }}>
        {open && (
          <Paper elevation={8} sx={{ mb: 1.5, width: 220, border: 1, borderColor: "divider", borderRadius: 3, overflow: "hidden" }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 2, py: 1.5, borderBottom: 1, borderColor: "divider" }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <TuneIcon fontSize="small" sx={{ color: "primary.main" }} />
                <Typography variant="caption" sx={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>Layout</Typography>
              </Stack>
              <IconButton size="small" onClick={() => setOpen(false)} sx={{ color: "text.secondary" }}>
                <CloseIcon sx={{ fontSize: 14 }} />
              </IconButton>
            </Box>
            <Box sx={{ p: 1.5, display: "flex", flexDirection: "column", gap: 0.75 }}>
              {(Object.entries(labels) as [TemplateKey, string][]).map(([key, label]) => {
                const active = activeTemplate === key;
                return (
                  <Box key={key} onClick={() => setTemplate(key)} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 1.5, py: 1.25, borderRadius: 2, cursor: "pointer", bgcolor: active ? alpha(theme.palette.primary.main, 0.12) : "action.hover", border: 1, borderColor: active ? alpha(theme.palette.primary.main, 0.4) : "transparent", "&:hover": { borderColor: "divider" }, transition: "all .15s" }}>
                    <Typography variant="body2" sx={{ fontSize: 13, fontWeight: active ? 600 : 400, color: active ? "primary.main" : "text.primary" }}>{label}</Typography>
                    {active && <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: "primary.main" }} />}
                  </Box>
                );
              })}
            </Box>
          </Paper>
        )}
        <Box onClick={() => setOpen((v) => !v)} sx={{ width: 48, height: 48, borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", bgcolor: "primary.main", color: "primary.contrastText", boxShadow: 6, ml: "auto", transition: "transform .15s", "&:hover": { transform: "scale(1.05)" }, "&:active": { transform: "scale(0.95)" } }}>
          <TuneIcon fontSize="small" />
        </Box>
      </Box>
    </ThemeProvider>
  );
};